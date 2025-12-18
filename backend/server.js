const path = require('path');
const { spawn } = require('child_process');

// Prefer running via `tsx` so the TypeScript source is executed directly.
const tsEntry = path.join(__dirname, 'index.ts');
console.log('Starting server via `npx tsx server/index.ts`');
const child = spawn('npx', ['tsx', tsEntry], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code));
