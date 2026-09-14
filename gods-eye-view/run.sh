#!/usr/bin/env bash
set -euo pipefail

cd /app

# Serve the production build through Vite's programmatic PreviewServer.
# Loading the standalone config explicitly guarantees that all upstream
# configurePreviewServer provider middleware is installed.
node /app/run-preview.mjs &
APP_PID=$!

cleanup() {
    kill "$APP_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Give the preview server time to initialise before starting the Ingress proxy.
sleep 2

# Fail loudly if the proxy cannot start.
nginx -t

# Keep nginx in the foreground so its status/errors are visible to the
# Home Assistant app log. This is the actual Ingress endpoint on port 8099.
exec nginx -g 'daemon off;error_log /dev/stdout info;'
