const { execSync } = require('child_process');
const fs = require('fs');

function needsInstall() {
  try {
    if (!fs.existsSync('node_modules/mongoose/package.json')) return true;
    const version = require('./node_modules/mongoose/package.json').version;
    if (!version.startsWith('7.')) return true;
    const saslprepPath = 'node_modules/@mongodb-js/saslprep/dist/node.js';
    if (
      fs.existsSync('node_modules/@mongodb-js/saslprep') &&
      !fs.existsSync(saslprepPath)
    ) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

if (needsInstall()) {
  console.log('==> Fixing dependencies (stale cache detected)...');
  fs.rmSync('node_modules', { recursive: true, force: true });
  execSync('npm ci --omit=dev', { stdio: 'inherit' });
}

console.log('==> Starting server...');
require('./src/index.js');
