import { createServer } from 'vite';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Serve the already-built production assets with Vite's normal server.
// The upstream providers attach through configureServer(), so this avoids
// relying on PreviewServer to install the API middleware.
const server = await createServer({
    root: '/app/dist',
    configFile: false,
    envFile: false,
    publicDir: false,
    appType: 'spa',
    logLevel: 'info',
    plugins: [...localProviderPlugins(), apiNotFoundPlugin()],
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
