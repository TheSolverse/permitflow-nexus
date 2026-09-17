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

// 3. Helper to check if frontend is ready on available ports
const candidateUrls = ['http://localhost:5173/', 'http://localhost:5174/', 'http://localhost:5000/'];
let opened = false;

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function pollPorts(retries = 30) {
  if (opened) return;
  for (const url of candidateUrls) {
    const isLive = await checkUrl(url);
    if (isLive && !opened) {
      opened = true;
      console.log('\x1b[36m%s\x1b[0m', `\n✨ Application is live! Opening browser at: ${url}\n`);
      openBrowser(url);
      return;
    }
  }

  if (retries > 0 && !opened) {
    setTimeout(() => pollPorts(retries - 1), 600);
  } else if (!opened) {
    opened = true;
    openBrowser('http://localhost:5173/');
  }
}

// 4. Open default browser across platforms
function openBrowser(url) {
  const startCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  exec(startCmd, (err) => {
    if (err) console.log(`Could not automatically open browser: ${err.message}. Please navigate to ${url}`);
  });
}

// Start polling
setTimeout(() => pollPorts(), 1200);

// Handle clean shutdown
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});
