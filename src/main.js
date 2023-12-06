const { app, BrowserWindow, ipcMain, net } = require('electron')
const path = require('node:path')

let win;
const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.setMenu(null)
  win.maximize();
  win.show();
  win.webContents.openDevTools()
  win.loadFile('src/views/index.html')
}

app.whenReady().then(() => {
  createWindow()

  // ipcMain.handle('ping', () => 'pong')

  ipcMain.handle('getFact', async () => {
    try {
      win.webContents.send("gettingFactStarted")
      const response = await fetch('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1')
      const body = await response.text()
      const factText = JSON.parse(body).text
      win.webContents.send("gotFact", factText)
    } catch {
      win.webContents.send("gotFact", 'Error, no fact found, please try again later')
    } finally {
      win.webContents.send("gettingFactEnded")
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
