const path = require('path');
const { spawn } = require('child_process');

// Always run the server using `tsx` for reliable TypeScript execution.
// This avoids needing to keep compiled JS in sync with the TS source.
const tsEntry = path.join(__dirname, 'index.ts');
console.log('Starting server via `npx tsx server/index.ts`');
const child = spawn('npx', ['tsx', tsEntry], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code));
