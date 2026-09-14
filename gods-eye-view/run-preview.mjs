import { preview } from 'vite';
import { createBrowserViteConfig } from './build/vite.js';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Build-time config is intentionally loaded explicitly here instead of relying
// on Vite's config-file discovery. This mirrors upstream's preview-serving test
// and guarantees that the server-side provider middleware is attached to the
// production PreviewServer as well as the browser build.
const plugins = [...localProviderPlugins(), apiNotFoundPlugin()];

const config = {
    ...createBrowserViteConfig({
        plugins,
        googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
        cesiumToken: process.env.CESIUM_ION_TOKEN,
        host: '127.0.0.1',
        port: 4173,
    }),
    root: '/app',
    configFile: false,
    envFile: false,
    preview: {
        host: '127.0.0.1',
        port: 4173,
        strictPort: true,
    },
};

const server = await preview(config);
server.printUrls();

const shutdown = async () => {
    await server.httpServer.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
