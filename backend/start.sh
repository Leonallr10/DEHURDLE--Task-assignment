#!/usr/bin/env bash
set -euo pipefail

# Render sometimes reuses a stale/broken node_modules cache.
# Reinstall if mongoose is missing or still on v8+ (broken saslprep chain).
needs_install() {
  node -e "
    const fs = require('fs');
    const path = require('path');
    if (!fs.existsSync('node_modules/mongoose/package.json')) process.exit(1);
    const v = require('mongoose/package.json').version;
    if (!v.startsWith('7.')) process.exit(1);
    if (fs.existsSync('node_modules/@mongodb-js/saslprep') &&
        !fs.existsSync('node_modules/@mongodb-js/saslprep/dist/node.js')) process.exit(1);
  " 2>/dev/null
}

if ! needs_install; then
  echo "==> Fixing dependencies (stale Render cache detected)..."
  rm -rf node_modules
  npm ci --omit=dev
fi

echo "==> Starting server..."
exec node src/index.js
