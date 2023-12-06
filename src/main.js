const {
  app, BrowserWindow, ipcMain,
} = require('electron');
const path = require('node:path');
const Store = require('electron-store');

let win;
const store = new Store();
const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.setMenu(null);
  win.maximize();
  win.show();
  win.webContents.openDevTools();
  win.loadFile('src/views/index.html');
};

app.whenReady().then(() => {
  createWindow();

  let isFetching = false;

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
    // store.delete('StoredFacts')
    // console.log(typeof storedFacts)
    if (typeof store.get('StoredFacts') === 'undefined') {
      store.set('StoredFacts', [{ name: '1', id: '1' }, { name: '2', id: '2' }]);
    }
    const storedFacts = store.get('StoredFacts');
    // console.log(storedFacts)
    if (storedFacts.legth !== 0) {
      storedFacts.forEach((factObject) => {
        win.webContents.send('populateFacts', factObject);
      });
    }
    // store.set("TestKey", "TestValue")
    // console.log('Main:', store.get('StoredFacts'));
    // store.delete('TestKey')
  });

  ipcMain.handle('addToStoredFacts', (e, newFact) => {
    const storedFacts = store.get('StoredFacts');
    const newStoredFacts = [...storedFacts];
    const indexList = newStoredFacts.map((fact) => parseInt(fact.id, 10));
    const firstAvailableIndex = Math.max(...indexList) + 1;
    const newFactObject = { name: newFact, id: firstAvailableIndex.toString() };
    newStoredFacts.unshift(newFactObject);
    store.set('StoredFacts', newStoredFacts);
    win.webContents.send('clearFacts');
    newStoredFacts.forEach((fact) => {
      win.webContents.send('populateFacts', fact);
    });
  });

  ipcMain.handle('removeFromStoredFacts', (e, factToRemove) => {
    const storedFacts = store.get('StoredFacts');
    const newStoredFacts = storedFacts.filter((fact) => fact.id !== factToRemove.id);
    store.set('StoredFacts', newStoredFacts);
    win.webContents.send('clearFacts');
    newStoredFacts.forEach((fact) => {
      win.webContents.send('populateFacts', fact);
    });
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
