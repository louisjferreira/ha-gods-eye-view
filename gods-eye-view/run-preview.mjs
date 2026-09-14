import { createServer } from 'vite';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Run Vite only as the API/provider server. Nginx serves the already-built
// production assets directly from /app/dist. This keeps the browser on the
// production bundle while configureServer() installs all provider middleware.
const server = await createServer({
    root: '/app',
    configFile: false,
    envFile: false,
    publicDir: false,
    appType: 'custom',
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
