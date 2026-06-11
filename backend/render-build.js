const { execSync } = require('child_process');
const fs = require('fs');

console.log('==> Removing cached node_modules...');
fs.rmSync('node_modules', { recursive: true, force: true });

console.log('==> Installing dependencies...');
execSync('npm ci --omit=dev', { stdio: 'inherit' });

console.log('==> Verifying mongoose...');
const version = require('./node_modules/mongoose/package.json').version;
if (!version.startsWith('7.')) {
  throw new Error(`Expected mongoose 7, got ${version}`);
}
console.log(`mongoose ${version} OK`);
