import { createServer } from 'vite';
import { localProviderPlugins } from './server/providers/local.js';
import { apiNotFoundPlugin } from './server/standalone/api-not-found.js';

// Nginx serves the production bundle from /app/dist. Vite runs only as the
// local API/provider server on loopback port 4173.
//
// The upstream providers expose Vite's configureServer hooks. We install
// those hooks explicitly here instead of relying on Vite's plugin-resolution
// path; this makes the API middleware deterministic in the packaged
// Home Assistant environment while leaving the provider code unchanged.
const providerPlugins = [...localProviderPlugins(), apiNotFoundPlugin()];

const server = await createServer({
    root: '/app',
    configFile: false,
    envFile: false,
    publicDir: false,
    appType: 'custom',
    logLevel: 'info',
    plugins: [],
    server: {
        host: '127.0.0.1',
        port: 4173,
        strictPort: true,
        hmr: false,
    },
});

// Install the upstream Vite middleware hooks directly. Keep any returned
// post-hooks and run them after Vite's own middleware stack is installed.
const postHooks = [];
for (const plugin of providerPlugins) {
    if (typeof plugin?.configureServer !== 'function') continue;
    const postHook = await plugin.configureServer(server);
    if (typeof postHook === 'function') postHooks.push(postHook);
    console.log(`[God's Eye View] API provider installed: ${plugin.name || 'unnamed'}`);
}

await server.listen();

for (const postHook of postHooks) {
    await postHook();
}

server.printUrls();

const shutdown = async () => {
    await server.close();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
