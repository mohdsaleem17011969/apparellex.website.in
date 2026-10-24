import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db, { cryptoRandomId } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || (isProduction ? 8080 : 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'apparellex_super_secret_jwt_key_2026';

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------

  // Health check endpoint for Cloud Run and monitoring
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
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
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
    } catch {
      res.status(500).json({ error: 'Internal authentication error' });
    }
  });

  // Products API
  app.get('/api/products', (req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as any[];
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
    } catch {
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });

  // Site Settings API
  app.get('/api/settings', (req, res) => {
    try {
      const settings = db.prepare('SELECT * FROM site_settings LIMIT 1').get() as any;
      if (!settings) {
        return res.json(null);
      }
      res.json({
        ...settings,
        socialLinks: settings.social_links ? JSON.parse(settings.social_links) : [],
        directors: settings.directors ? JSON.parse(settings.directors) : [],
        employees: settings.employees ? JSON.parse(settings.employees) : [],
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve site settings' });
    }
  });

  app.post('/api/settings', (req, res) => {
    try {
      const s = req.body;
      const existing = db.prepare('SELECT id FROM site_settings LIMIT 1').get() as any;
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
    } catch {
      res.status(500).json({ error: 'Failed to update site settings' });
    }
  });

  // -------------------------------------------------------------
  // Frontend Serving (Dev Vite Middleware vs Production Static)
  // -------------------------------------------------------------
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(distPath);

  if (!isProduction && !distExists) {
    // Development mode with Vite middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve pre-built static assets from dist
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please run npm run build.');
      }
    });
  }

  // Bind to 0.0.0.0 and PORT for Cloud Run compatibility
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apparellex server running on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });

  const shutdown = () => {
    console.log('Shutdown signal received, closing server...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
