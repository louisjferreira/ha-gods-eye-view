import { createServer } from 'vite';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Nginx serves the production bundle from /app/dist. Vite runs only as the
// local API/provider server on loopback port 4173.
//
// Register the upstream providers as real Vite plugins. This lets Vite run
// their configureServer hooks at the normal point in its server lifecycle,
// before requests are handled. Nginx proxies /api/* requests here while
// serving all static production assets directly.
const providerPlugins = [...localProviderPlugins(), apiNotFoundPlugin()];

const server = await createServer({
    root: '/app',
    configFile: false,
    envFile: false,
    publicDir: false,
    appType: 'custom',
    logLevel: 'info',
    plugins: providerPlugins,
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
