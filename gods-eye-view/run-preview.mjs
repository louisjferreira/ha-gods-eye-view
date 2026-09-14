import { loadConfigFromFile, mergeConfig, preview } from 'vite';

const configPath = new URL('./vite.config.js', import.meta.url);
const loaded = await loadConfigFromFile(
  { command: 'serve', mode: 'production' },
  configPath,
  process.cwd(),
);

if (!loaded) throw new Error('Unable to load Vite configuration');

const server = await preview(
  mergeConfig(loaded.config, {
    preview: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
    },
  }),
);

server.printUrls();

const shutdown = async () => {
  await server.httpServer.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
