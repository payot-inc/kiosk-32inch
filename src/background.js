'use strict';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import AutoLaunch from 'auto-launch';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
const isDevelopment = process.env.NODE_ENV !== 'production';

// import './background/logger';
import CoinMachineInit from './background/coin-machine';
// import './background/serialport';
import './background/mqtt';
import './background/ad';

if(process.arch === 'x64') {
  import('./background/kicc')
    .then(() => {
      // console.log('kicc import');
    });
} else {
  import('./background/koces')
    .then(() => {
      // console.log('koces import');
    });
}

let window;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

/** 앱이 여러개 실행되는것을 방지 */
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
  app.exit();
}
app.on('second-instance', () => {
  if (window) {
    if (window.isMinimized()) {
      window.restore();
    } else if (!window.isVisible()) {
      window.show();
    }
    window.focus();
  }
});

/**  */
async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: !isDevelopment,
    kiosk: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      enableRemoteModule: true,
    },
  });

  if(!isDevelopment) {
    win.setMenu(null);
  }
  window = win;
  CoinMachineInit(win.webContents);
  // win.webContents.openDevTools();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 디렉토리에 접근 가능하도록 설정
  // file 프로토콜 활성
  protocol.interceptFileProtocol(
    'file',
    (req, callback) => {
      var url = req.url.substr(7);
      callback({ path: path.normalize(url) });
    },
    error => {
      if (error) console.error('Failed to register protocol');
    },
  );
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  /** 부팅 후 자동실행 설정 */
  if (!isDevelopment) {
    const autoLaunch = new AutoLaunch({
      name: app.getName(),
      path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then(state => {
      if (!state) {
        return autoLaunch.enable();
      }
    });
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// 앱에서 히든 종료 했을때, 레지스트리 제거(자동 재시작 비활성)
ipcMain.handle('exit-app', (event) => {
  saveLog();
  if (!isDevelopment) {
    const autoLaunch = new AutoLaunch({
      name: app.getName(),
      path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then(state => {
      if (state) {
        return autoLaunch.disable();
      }
    }).then(() => {
      app.exit();
      app.quit();
    });
  }
});

function saveLog() {
  deleteOldLog();
  hasTodayDirOrCreate();
  const savePath = path.join(
    'C:',
    'kiosk',
    'exitApp',
    moment().format('YYYY-MM-DD'),
    `${moment().format('a_hh_mm_ss')}.json`
  );
  fs.writeFileSync(savePath, JSON.stringify({ result: true }, null, 2));
}

function deleteOldLog() {
  const rootDir = path.join(
    'C:',
    'kiosk',
    'exitApp'
  );
  const list = fs.readdirSync(rootDir);
  list
    .filter(name => {
      return /^\d{4}-\d{2}-\{2}$/.test(name);
    })
    .filter(date => moment(date).isValid())
    .forEach(date => {
      if(moment(date).add(30, 'days') < moment()) {
        fs.rmdirSync(path.join(rootDir, date), { recursive: true });
      }
    });
}

function hasTodayDirOrCreate() {
  const todayDir = path.join(
    'C:',
    'kiosk',
    'exitApp',
    moment().format('YYYY-MM-DD'),
  );
  const hasDir = fs.existsSync(todayDir);
  if(hasDir) return;
  fs.mkdirSync(todayDir, { recursive: true });
}