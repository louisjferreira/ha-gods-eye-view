#!/usr/bin/env bash
set -euo pipefail

cd /app

# God's Eye View uses Vite's standalone server. Keep the application bound to
# loopback and expose it only through the Home Assistant Ingress proxy.
npm run dev -- --host 127.0.0.1 --port 4173 &
APP_PID=$!

# Give Vite a moment to initialise before starting the proxy.
sleep 2

nginx -g 'daemon off;' &
NGINX_PID=$!

cleanup() {
    kill "$NGINX_PID" "$APP_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait "$APP_PID"
