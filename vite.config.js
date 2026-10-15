import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Local API Plugin for Vite
 * Allows /api/health, /api/tribunal, and /api/twin to run locally in dev mode
 * identically to Vercel Serverless Functions and Chrome Extension endpoints.
 */
function localApiPlugin() {
  return {
    name: 'local-api-endpoints',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        // Attach serverless helper methods
        res.status = function(code) {
          res.statusCode = code;
          return res;
        };
        res.json = function(data) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        // Parse JSON body for POST requests
        if (req.method === 'POST') {
          try {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const bodyStr = Buffer.concat(buffers).toString();
            req.body = bodyStr ? JSON.parse(bodyStr) : {};
          } catch (e) {
            req.body = {};
          }
        }

        const urlPath = req.url.split('?')[0];
        try {
          if (urlPath === '/api/health') {
            const { default: handler } = await import('./api/health.js');
            return handler(req, res);
          }
          if (urlPath === '/api/tribunal') {
            const { default: handler } = await import('./api/tribunal.js');
            return handler(req, res);
          }
          if (urlPath === '/api/twin') {
            const { default: handler } = await import('./api/twin.js');
            return handler(req, res);
          }
        } catch (err) {
          console.error('Local API error:', err);
          return res.status(500).json({ error: err.message });
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
