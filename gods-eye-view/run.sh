#!/usr/bin/env bash
set -euo pipefail

cd /app

# Serve the production Vite build. The preview server still loads God's Eye
# View's provider plugins, but avoids Vite's development module/HMR URLs.
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort &
APP_PID=$!

cleanup() {
    kill "$APP_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Give Vite preview time to initialise before starting the Ingress proxy.
sleep 2

# Fail loudly if the proxy cannot start.
nginx -t

# Keep nginx in the foreground so its status/errors are visible to the
# Home Assistant app log. This is the actual Ingress endpoint on port 8099.
exec nginx -g 'daemon off;error_log /dev/stdout info;'
