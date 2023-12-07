const {
  app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification,
} = require('electron');

let win;
let tray;

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: '../preload.js',
    },
    icon: nativeImage.createFromPath('src/assets/cat.png'),
  });
  win.setMenu(null);
  win.maximize();
  win.show();
  win.webContents.openDevTools();
  win.loadFile('../views/index.html');

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }

    return false;
  });
};

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('src/assets/cat.png');
  tray = new Tray(icon);

  let mockStore = [
    { name: 'Fact 1', id: '0' }, { name: 'Fact 2', id: '' },
  ];

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click() {
        win.show();
      },
    },
    {
      label: 'Quit',
      click() {
        win.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Cat app');
  tray.setTitle('Cat app');

  createWindow();

  let isFetching = false;

  ipcMain.handle('runNotifier', () => {
    const NOTIFICATION_APP_NAME = 'Cat app';
    const NOTIFICATION_TITLE = 'New fact!';
    const NOTIFICATION_BODY = 'New cat fact is waiting for you.';

    const showNotification = () => {
      if (process.platform === 'win32') {
        app.setAppUserModelId(NOTIFICATION_APP_NAME);
      }
      new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
        subtitle: 'Test',
        icon: 'src/assets/cat.png',
      }).show();
    };

    const interval = 1000 * 60 * 5;

    setInterval(() => showNotification(), interval);
  });

  ipcMain.handle('getFact', async () => {
    if (isFetching === false) {
      try {
        isFetching = true;
        win.webContents.send('gettingFactStarted');
        const response = await fetch('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1');
        const body = await response.text();
        const factText = JSON.parse(body).text;
        win.webContents.send('gotFact', factText);
      } catch {
        win.webContents.send('gotFact', 'Error, no fact found, please try again later');
      } finally {
        isFetching = false;
        win.webContents.send('gettingFactEnded');
      }
    }
  });

  ipcMain.handle('getStoredFacts', () => {
    const storedFacts = [...mockStore];
    if (storedFacts.length !== 0) {
      storedFacts.forEach((factObject) => {
        win.webContents.send('populateFacts', factObject);
      });
    } else {
      win.webContents.send('addPlaceholderFact');
    }
  });

  ipcMain.handle('addToStoredFacts', (e, newFact) => {
    const storedFacts = [...mockStore];
    const newStoredFacts = [...storedFacts];
    let firstAvailableIndex = 0;
    if (newStoredFacts.length !== 0) {
      const indexList = newStoredFacts.map((fact) => parseInt(fact.id, 10));
      firstAvailableIndex = Math.max(...indexList) + 1;
    }
    const newFactObject = { name: newFact, id: firstAvailableIndex.toString() };
    newStoredFacts.unshift(newFactObject);
    mockStore = newStoredFacts;
    win.webContents.send('clearFacts');
    newStoredFacts.forEach((fact) => {
      win.webContents.send('populateFacts', fact);
    });
  });

  ipcMain.handle('removeFromStoredFacts', (e, factToRemove) => {
    const storedFacts = [...mockStore];
    const newStoredFacts = storedFacts.filter((fact) => fact.id !== factToRemove.id);
    mockStore = newStoredFacts;
    win.webContents.send('clearFacts');
    newStoredFacts.forEach((fact) => {
      win.webContents.send('populateFacts', fact);
    });
    if (newStoredFacts.length === 0) {
      win.webContents.send('addPlaceholderFact');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
