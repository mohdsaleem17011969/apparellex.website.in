import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db, { cryptoRandomId } from './server/db.js';
import {
  generateOutfitSuggestions,
  generateFitSuggestions,
  generateTrendSuggestions,
  generateSmartSearch,
} from './server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port determination: In AI Studio Dev, Nginx proxies 8080 to 3000, so dev must listen on 3000.
// In Cloud Run production, Cloud Run forwards directly to process.env.PORT (defaults to 8080).
const isProduction = process.env.NODE_ENV === 'production';
const isDev = !isProduction && process.env.DISABLE_HMR === 'true';
const PORT = isDev ? 3000 : (Number(process.env.PORT) || 8080);
const JWT_SECRET = process.env.JWT_SECRET || 'apparellex_super_secret_jwt_key_2026';

process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception caught:', err);
});

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // -------------------------------------------------------------
  // Health Check Routes (Probes for Cloud Run & Monitoring)
  // -------------------------------------------------------------
  app.get('/healthz', (_req, res) => {
    res.status(200).send('OK');
  });

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // -------------------------------------------------------------
  // Auth API
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // Products API
  // -------------------------------------------------------------
  app.get('/api/products', (_req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all() as any[];
      const formatted = (products || []).map((p) => ({
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

  // -------------------------------------------------------------
  // Site Settings API
  // -------------------------------------------------------------
  app.get('/api/settings', (_req, res) => {
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
  // Gemini AI Suggestion Routes
  // -------------------------------------------------------------

  // 1. AI Outfit Suggestions
  app.post('/api/ai/outfit-suggestions', async (req, res) => {
    try {
      const { productContext, occasion, gender, catalog } = req.body;
      const suggestions = await generateOutfitSuggestions(
        productContext || 'Urban Streetwear Statement',
        occasion || 'Metropolitan Evening',
        gender || 'unisex',
        Array.isArray(catalog) ? catalog : []
      );
      res.json(suggestions);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate outfit suggestions', details: err?.message });
    }
  });

  // 2. AI Fit & Tailoring Suggestions
  app.post('/api/ai/fit-suggestions', async (req, res) => {
    try {
      const { productName, productFit, height, weight, bodyType, preferredDrape } = req.body;
      const suggestions = await generateFitSuggestions(
        productName || 'Garment',
        productFit || 'Regular Fit',
        height || "5'10\"",
        weight || '165 lbs',
        bodyType || 'Athletic',
        preferredDrape || 'Relaxed Everyday'
      );
      res.json(suggestions);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate fit suggestions', details: err?.message });
    }
  });

  // 3. AI Hyperlocal Trend Suggestions
  app.post('/api/ai/trend-suggestions', async (req, res) => {
    try {
      const { vibe, catalog } = req.body;
      const trends = await generateTrendSuggestions(
        vibe || 'SoHo & Downtown NYC',
        Array.isArray(catalog) ? catalog : []
      );
      res.json(trends);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate trend suggestions', details: err?.message });
    }
  });

  // 4. AI Smart Search Suggestions
  app.post('/api/ai/smart-search', async (req, res) => {
    try {
      const { query, catalog } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const searchResult = await generateSmartSearch(
        query,
        Array.isArray(catalog) ? catalog : []
      );
      res.json(searchResult);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to execute smart search', details: err?.message });
    }
  });

  // -------------------------------------------------------------
  // Frontend Serving (Production Static vs Development Middleware)
  // -------------------------------------------------------------
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(distPath);

  if (distExists) {
    // In production or built environment, serve static files directly from dist
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!doctype html><html><head><title>Apparellex</title></head><body><div id="root"></div></body></html>');
      }
    });
  } else if (!isProduction) {
    // Development mode without pre-built dist: mount Vite middlewares
    try {
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: {
          middlewareMode: true,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e: any) {
      console.warn('Vite middleware could not be loaded:', e?.message);
    }
  } else {
    // Fallback if dist is missing in production
    app.get('*', (_req, res) => {
      res.status(200).send('<!doctype html><html><head><title>Apparellex</title></head><body><div id="root">Ready</div></body></html>');
    });
  }

  // Global error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error', details: err?.message });
  });

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
  console.error('Fatal server startup error caught:', err);
});
