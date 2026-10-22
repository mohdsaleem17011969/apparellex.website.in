import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'apparellex.db'));

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
  const passwordHash = bcrypt.hashSync(defaultPassword, 12);

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

export function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDb() {
  return db;
}

export default db;
