import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db, { cryptoRandomId } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'apparellex_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal authentication error' });
  }
});

// Products API
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    const formatted = products.map((p) => ({
      ...p,
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      colors: p.colors ? JSON.parse(p.colors) : [],
      isNewDrop: Boolean(p.is_new_drop),
      originalPrice: p.original_price,
      estDeliveryMins: p.est_delivery_mins,
      reviewsCount: p.reviews_count,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Site Settings API
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM site_settings LIMIT 1').get();
    if (!settings) {
      return res.json(null);
    }
    res.json({
      ...settings,
      socialLinks: settings.social_links ? JSON.parse(settings.social_links) : [],
      directors: settings.directors ? JSON.parse(settings.directors) : [],
      employees: settings.employees ? JSON.parse(settings.employees) : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve site settings' });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const s = req.body;
    const existing = db.prepare('SELECT id FROM site_settings LIMIT 1').get();
    if (existing) {
      db.prepare(`
        UPDATE site_settings
        SET company_name = ?, founder_name = ?, founder_role = ?, founder_image = ?,
            about_title = ?, about_intro = ?, about_body = ?, email = ?,
            social_links = ?, directors = ?, employees = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        s.companyName,
        s.founderName,
        s.founderRole,
        s.founderImage,
        s.aboutTitle,
        s.aboutIntro,
        s.aboutBody,
        s.email,
        JSON.stringify(s.socialLinks || []),
        JSON.stringify(s.directors || []),
        JSON.stringify(s.employees || []),
        existing.id
      );
    } else {
      db.prepare(`
        INSERT INTO site_settings (
          id, company_name, founder_name, founder_role, founder_image,
          about_title, about_intro, about_body, email, social_links, directors, employees
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        cryptoRandomId(),
        s.companyName,
        s.founderName,
        s.founderRole,
        s.founderImage,
        s.aboutTitle,
        s.aboutIntro,
        s.aboutBody,
        s.email,
        JSON.stringify(s.socialLinks || []),
        JSON.stringify(s.directors || []),
        JSON.stringify(s.employees || [])
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

app.listen(PORT, () => {
  console.log(`Apparellex API server listening on http://localhost:${PORT}`);
});
