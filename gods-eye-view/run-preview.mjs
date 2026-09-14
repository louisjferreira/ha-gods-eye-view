import { createServer } from 'vite';
import sirv from 'sirv';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Use Vite's normal development server so configureServer() installs all
// upstream provider middleware. Serve the already-built production bundle
// from /app/dist before Vite's own source-file middleware.
const staticDist = sirv('/app/dist', {
    dev: false,
    single: true,
});

const distPlugin = {
    name: 'gev-production-dist',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/api/')) return next();
            staticDist(req, res, next);
        });
    },
};

const server = await createServer({
    root: '/app',
    configFile: false,
    envFile: false,
    publicDir: false,
    appType: 'custom',
    logLevel: 'info',
    plugins: [
        distPlugin,
        ...localProviderPlugins(),
        apiNotFoundPlugin(),
    ],
    server: {
        host: '127.0.0.1',
        port: 4173,
        strictPort: true,
        hmr: false,
    },
});

await server.listen();
server.printUrls();

const shutdown = async () => {
    await server.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
