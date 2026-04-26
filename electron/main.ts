import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Potato Bro Bot',
    minWidth: 650,
    minHeight: 600,
    icon: path.join(__dirname, '../src/assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.setMenu(null);

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);
