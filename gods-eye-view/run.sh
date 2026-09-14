#!/usr/bin/env bash
set -euo pipefail

cd /app

# God's Eye View uses Vite's standalone server. Keep the application bound to
# loopback and expose it only through the Home Assistant Ingress proxy.
npm run dev -- --host 127.0.0.1 --port 4173 &
APP_PID=$!

cleanup() {
    kill "$APP_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Give Vite time to initialise before starting the Ingress proxy.
sleep 2

# Fail loudly if the proxy cannot start. Previously nginx was started in the
# background without its errors being visible in the Home Assistant log.
nginx -t

# Keep nginx in the foreground so its status/errors are visible to the
# Home Assistant app log. This is the actual Ingress endpoint on port 8099.
exec nginx -g 'daemon off;error_log /dev/stdout info;'
