import { spawn, exec } from 'child_process';
import http from 'http';

console.log('\x1b[32m%s\x1b[0m', '==================================================');
console.log('\x1b[32m%s\x1b[0m', '  🚀 Launching PermitFlow Nexus (Full Stack)');
console.log('\x1b[32m%s\x1b[0m', '  Backend: Express (Port 5000)');
console.log('\x1b[32m%s\x1b[0m', '  Frontend: Vite + React (Port 5173)');
console.log('\x1b[32m%s\x1b[0m', '  Database: Supabase PostgreSQL (Connected)');
console.log('\x1b[32m%s\x1b[0m', '==================================================\n');

// 1. Start Backend
const backend = spawn('npm.cmd', ['run', 'server'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend
const frontend = spawn('npm.cmd', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 3. Helper to check if frontend is ready
function pollFrontend(retries = 20) {
  if (retries <= 0) {
    openBrowser('http://localhost:5173/');
    return;
  }

  const req = http.get('http://localhost:5173/', (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log('\x1b[36m%s\x1b[0m', '\n✨ Website is live! Opening browser at http://localhost:5173/ ...\n');
      openBrowser('http://localhost:5173/');
    } else {
      setTimeout(() => pollFrontend(retries - 1), 500);
    }
  });

  req.on('error', () => {
    setTimeout(() => pollFrontend(retries - 1), 500);
  });
}

// 4. Open default browser across platforms
function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  exec(startCmd, (err) => {
    if (err) console.log(`Could not automatically open browser: ${err.message}. Please navigate to ${url}`);
  });
}

// Start polling
setTimeout(() => pollFrontend(), 1000);

// Handle clean shutdown
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});
