-- ============================================================================
-- APPARELLEX FASHION E-COMMERCE PLATFORM
-- PRODUCTION POSTGRESQL (15+/16) SCHEMA & SECURITY ARCHITECTURE MIGRATION
-- ============================================================================
-- Architecture: Multi-tenant, Scalable Fashion E-Commerce Core
-- Security Standard: OWASP ASVS v4.0, PCI-DSS Aligned, GDPR-Compliant
-- Engine Compatibility: PostgreSQL 15, 16+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & PREREQUISITES
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid(), cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "citext";      -- Case-insensitive string type for emails

-- ----------------------------------------------------------------------------
-- 1. ENUMERATIONS & CUSTOM DOMAINS
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin', 'super_admin');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('active', 'suspended', 'pending_verification', 'deleted');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_preference') THEN
        CREATE TYPE gender_preference AS ENUM ('all', 'men', 'women', 'unisex');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'address_type') THEN
        CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE UTILITY FUNCTIONS & AUDITING TRIGGERS
-- ----------------------------------------------------------------------------

-- Shared trigger function to guarantee updated_at integrity
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = clock_timestamp();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. CORE TABLE DEFINITIONS
-- ----------------------------------------------------------------------------

-- ============================================================================
-- TABLE: users
-- Core authentication entity. Stores identity, credentials, roles, and locks.
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                   CITEXT NOT NULL,
    phone                   VARCHAR(25) NULL,
    password_hash           VARCHAR(255) NOT NULL,
    role                    user_role NOT NULL DEFAULT 'customer',
    status                  account_status NOT NULL DEFAULT 'active',
    is_email_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    is_phone_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts   SMALLINT NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ NULL,
    last_login_at           TIMESTAMPTZ NULL,
    last_password_change_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    deleted_at              TIMESTAMPTZ NULL,

    -- Constraints
    CONSTRAINT chk_users_email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT chk_users_phone_format CHECK (
        phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$'
    ),
    CONSTRAINT chk_users_password_hash_nonempty CHECK (
        length(trim(password_hash)) >= 50
    )
);

-- Unique index for active users' email (supports soft-delete re-registration)
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_active_email
    ON users (email)
    WHERE deleted_at IS NULL;

-- Unique index for phone number
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_active_phone
    ON users (phone)
    WHERE phone IS NOT NULL AND deleted_at IS NULL;

-- Index for authentication and account status lookups
CREATE INDEX IF NOT EXISTS idx_users_login_lookup
    ON users (email, status)
    WHERE deleted_at IS NULL;

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();


-- ============================================================================
-- TABLE: user_profiles
-- One-to-one fashion customer profile with sizing, tags, and VIP attributes.
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id                 UUID PRIMARY KEY,
    first_name              VARCHAR(80) NOT NULL,
    last_name               VARCHAR(80) NOT NULL,
    avatar_url              TEXT NULL,
    date_of_birth           DATE NULL,
    gender_preference       gender_preference NOT NULL DEFAULT 'all',
    default_top_size        VARCHAR(12) NULL,
    default_bottom_size     VARCHAR(12) NULL,
    default_footwear_size   VARCHAR(12) NULL,
    styling_tags            TEXT[] NOT NULL DEFAULT '{}',
    measurements_json       JSONB NOT NULL DEFAULT '{}'::jsonb,
    vip_tier                VARCHAR(40) NOT NULL DEFAULT 'Standard',
    store_credits_cents     INTEGER NOT NULL DEFAULT 0 CHECK (store_credits_cents >= 0),
    preferred_currency      CHAR(3) NOT NULL DEFAULT 'USD',
    marketing_opt_in        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_profiles_dob_valid CHECK (
        date_of_birth IS NULL OR (
            date_of_birth > '1900-01-01' AND 
            date_of_birth <= (CURRENT_DATE - INTERVAL '13 years')
        )
    ),
    CONSTRAINT chk_user_profiles_name_length CHECK (
        length(trim(first_name)) >= 1 AND length(trim(last_name)) >= 1
    )
);

-- GIN Index for fast styling array queries (e.g. users tagged 'streetwear')
CREATE INDEX IF NOT EXISTS idx_user_profiles_styling_tags_gin
    ON user_profiles USING GIN (styling_tags);

-- GIN Index for dynamic measurements (e.g. chest, waist, inseam)
CREATE INDEX IF NOT EXISTS idx_user_profiles_measurements_gin
    ON user_profiles USING GIN (measurements_json);

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();


-- ============================================================================
-- TABLE: user_addresses
-- Customer shipping and billing address book with single-default enforcement.
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL,
    recipient_name          VARCHAR(120) NOT NULL,
    street_address_line1    VARCHAR(180) NOT NULL,
    street_address_line2    VARCHAR(180) NULL,
    city                    VARCHAR(100) NOT NULL,
    state_province          VARCHAR(100) NOT NULL,
    postal_code             VARCHAR(20) NOT NULL,
    country_code            CHAR(2) NOT NULL DEFAULT 'US',
    contact_number          VARCHAR(25) NOT NULL,
    address_type            address_type NOT NULL DEFAULT 'shipping',
    is_default_shipping     BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_billing      BOOLEAN NOT NULL DEFAULT FALSE,
    dispatch_notes          TEXT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    deleted_at              TIMESTAMPTZ NULL,

    CONSTRAINT fk_user_addresses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_addresses_country_code CHECK (
        country_code ~ '^[A-Z]{2}$'
    )
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_active
    ON user_addresses (user_id)
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_addresses_single_default_shipping
    ON user_addresses (user_id)
    WHERE is_default_shipping = TRUE AND deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_addresses_single_default_billing
    ON user_addresses (user_id)
    WHERE is_default_billing = TRUE AND deleted_at IS NULL;

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS trg_user_addresses_updated_at ON user_addresses;
CREATE TRIGGER trg_user_addresses_updated_at
    BEFORE UPDATE ON user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();


-- ============================================================================
-- TABLE: user_sessions
-- Multi-device stateful authentication tracking.
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL,
    session_token_hash      CHAR(64) NOT NULL UNIQUE,  -- SHA-256 of client session token
    user_agent              TEXT NULL,
    ip_address              INET NULL,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    device_label            VARCHAR(100) NULL,
    last_activity_at        TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    expires_at              TIMESTAMPTZ NOT NULL,
    revoked_at              TIMESTAMPTZ NULL,
    revocation_reason       VARCHAR(100) NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT fk_user_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_sessions_expiry CHECK (
        expires_at > created_at
    )
);

-- Composite Index for ultra-fast session validation in authentication middleware
CREATE INDEX IF NOT EXISTS idx_user_sessions_lookup_active
    ON user_sessions (session_token_hash, is_active, expires_at);

-- User active devices lookup index
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_devices
    ON user_sessions (user_id, is_active, last_activity_at DESC);


-- ============================================================================
-- TABLE: refresh_tokens
-- Cryptographic refresh tokens with Token Family Rotation & Reuse Detection.
-- ============================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id              UUID NOT NULL,
    user_id                 UUID NOT NULL,
    token_hash              CHAR(64) NOT NULL UNIQUE, -- SHA-256 hash
    family_id               UUID NOT NULL DEFAULT gen_random_uuid(),
    is_revoked              BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at              TIMESTAMPTZ NOT NULL,
    replaced_by_token_id    UUID NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT fk_refresh_tokens_session
        FOREIGN KEY (session_id)
        REFERENCES user_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_refresh_tokens_replaced_by
        FOREIGN KEY (replaced_by_token_id)
        REFERENCES refresh_tokens(id)
        ON DELETE SET NULL
);

-- Indexes for rotation checks and theft detection
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash_active
    ON refresh_tokens (token_hash, is_revoked, expires_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family
    ON refresh_tokens (family_id, is_revoked);


-- ============================================================================
-- TABLE: audit_logs
-- Immutable tamper-evident security and administrative audit log.
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 UUID NULL,
    event_type              VARCHAR(100) NOT NULL,
    severity                VARCHAR(20) NOT NULL DEFAULT 'INFO',
    ip_address              INET NULL,
    user_agent              TEXT NULL,
    metadata                JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_audit_logs_severity CHECK (
        severity IN ('INFO', 'WARNING', 'CRITICAL', 'SECURITY_ALERT')
    )
);

-- Append-only enforcement rule
CREATE OR REPLACE RULE no_update_audit_logs AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_audit_logs AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- Indexing for log queries and security investigations
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_recent
    ON audit_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_severity
    ON audit_logs (event_type, severity, created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
-- Principle of Least Privilege: Tenants can only view and alter their own records.
-- ----------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Helper to extract tenant user id from session context
-- In application middleware: SET LOCAL app.current_user_id = '<authenticated_uuid>';
-- In application middleware: SET LOCAL app.current_user_role = 'customer';

-- Policy: users
CREATE POLICY user_read_own_identity ON users
    FOR SELECT
    USING (
        id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );

CREATE POLICY user_update_own_identity ON users
    FOR UPDATE
    USING (
        id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );

-- Policy: user_profiles
CREATE POLICY user_profiles_read_own ON user_profiles
    FOR SELECT
    USING (
        user_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );

CREATE POLICY user_profiles_mutate_own ON user_profiles
    FOR ALL
    USING (
        user_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );

-- Policy: user_addresses
CREATE POLICY user_addresses_isolate ON user_addresses
    FOR ALL
    USING (
        user_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );

-- Policy: user_sessions
CREATE POLICY user_sessions_isolate ON user_sessions
    FOR ALL
    USING (
        user_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
        OR current_setting('app.current_user_role', TRUE) IN ('admin', 'super_admin')
    );
