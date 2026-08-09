import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite Dev Server Middleware Plugin to handle Vercel /api routes locally
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const urlPath = req.url.split('?')[0]; // e.g. /api/analytics/events
          const relativeApiPath = urlPath.replace(/^\/api\//, ''); // e.g. analytics/events
          const filePath = path.resolve(__dirname, 'api', `${relativeApiPath}.js`);

          const module = await server.ssrLoadModule(filePath);
          if (module && module.default) {
            // Buffer JSON body if POST/PUT
            if (req.method === 'POST' || req.method === 'PUT') {
              let bodyStr = '';
              req.on('data', (chunk) => (bodyStr += chunk));
              req.on('end', async () => {
                try {
                  req.body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch (e) {
                  req.body = bodyStr;
                }

                // Helper response mock for Vercel Serverless Function
                res.status = (code) => {
                  res.statusCode = code;
                  return res;
                };
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };

                await module.default(req, res);
              });
            } else {
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              await module.default(req, res);
            }
          } else {
            next();
          }
        } catch (err) {
          console.error('API Dev Middleware Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  server: {
    port: 5173,
  },
});
