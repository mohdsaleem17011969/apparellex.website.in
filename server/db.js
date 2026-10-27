import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// In-Memory fail-safe database for environments where native better-sqlite3 binary fails
class SafeMemoryDb {
  constructor() {
    this.users = [];
    this.products = [];
    this.siteSettings = null;
  }

  exec(_sql) {
    return this;
  }

  prepare(sql) {
    const s = sql.trim().toUpperCase();

    if (s.includes('FROM USERS WHERE EMAIL = ?')) {
      return {
        get: (email) => this.users.find((u) => u.email === email),
        all: () => this.users,
        run: () => ({ changes: 0 }),
      };
    }

    if (s.startsWith('INSERT INTO USERS')) {
      return {
        run: (id, email, password_hash, role) => {
          this.users.push({
            id,
            email,
            password_hash,
            role: role || 'admin',
            created_at: new Date().toISOString(),
          });
          return { changes: 1 };
        },
        get: () => undefined,
        all: () => [],
      };
    }

    if (s.startsWith('SELECT * FROM PRODUCTS')) {
      return {
        all: () => this.products,
        get: () => this.products[0],
        run: () => ({ changes: 0 }),
      };
    }

    if (s.includes('FROM SITE_SETTINGS')) {
      return {
        get: () => this.siteSettings,
        all: () => (this.siteSettings ? [this.siteSettings] : []),
        run: () => ({ changes: 0 }),
      };
    }

    if (s.startsWith('UPDATE SITE_SETTINGS')) {
      return {
        run: (
          companyName,
          founderName,
          founderRole,
          founderImage,
          aboutTitle,
          aboutIntro,
          aboutBody,
          email,
          socialLinks,
          directors,
          employees,
          id
        ) => {
          this.siteSettings = {
            id,
            company_name: companyName,
            founder_name: founderName,
            founder_role: founderRole,
            founder_image: founderImage,
            about_title: aboutTitle,
            about_intro: aboutIntro,
            about_body: aboutBody,
            email,
            social_links: socialLinks,
            directors,
            employees,
            updated_at: new Date().toISOString(),
          };
          return { changes: 1 };
        },
      };
    }

    if (s.startsWith('INSERT INTO SITE_SETTINGS')) {
      return {
        run: (
          id,
          companyName,
          founderName,
          founderRole,
          founderImage,
          aboutTitle,
          aboutIntro,
          aboutBody,
          email,
          socialLinks,
          directors,
          employees
        ) => {
          this.siteSettings = {
            id,
            company_name: companyName,
            founder_name: founderName,
            founder_role: founderRole,
            founder_image: founderImage,
            about_title: aboutTitle,
            about_intro: aboutIntro,
            about_body: aboutBody,
            email,
            social_links: socialLinks,
            directors,
            employees,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return { changes: 1 };
        },
      };
    }

    return {
      get: () => undefined,
      all: () => [],
      run: () => ({ changes: 0 }),
    };
  }
}

let db = null;

// Dynamically attempt to load better-sqlite3 without crashing if native addon is absent
try {
  const { default: Database } = await import('better-sqlite3');
  let dataPath = null;
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dataPath = path.join(dataDir, 'apparellex.db');
    db = new Database(dataPath);
  } catch {
    const tmpDir = path.join('/tmp', 'apparellex-data');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    dataPath = path.join(tmpDir, 'apparellex.db');
    db = new Database(dataPath);
  }
} catch (err) {
  console.warn('better-sqlite3 native addon unavailable; active fail-safe in-memory store initialized.');
  db = new SafeMemoryDb();
}

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT,
      gender TEXT,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      est_delivery_mins INTEGER,
      image_url TEXT,
      description TEXT,
      fabric TEXT,
      fit TEXT,
      sizes TEXT,
      colors TEXT,
      tag TEXT,
      is_new_drop INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      company_name TEXT,
      founder_name TEXT,
      founder_role TEXT,
      founder_image TEXT,
      about_title TEXT,
      about_intro TEXT,
      about_body TEXT,
      email TEXT,
      social_links TEXT,
      directors TEXT,
      employees TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const defaultAdminEmail = 'admin@apparellex.com';
  const existingAdmin = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(defaultAdminEmail);

  if (!existingAdmin) {
    const defaultPassword = 'admin123';
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run(
      cryptoRandomId(),
      defaultAdminEmail,
      passwordHash,
      'admin'
    );
  }
} catch (err) {
  console.warn('Database bootstrap notice:', err?.message);
}

export function getDb() {
  return db;
}

export default db;
