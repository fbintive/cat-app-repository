const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.on('gettingFactStarted', () => {
  const isLoading = document.getElementById('isLoading')
  isLoading.innerText = 'True'
});

ipcRenderer.on('gettingFactEnded', () => {
  const isLoading = document.getElementById('isLoading')
  isLoading.innerText = 'False'
});

ipcRenderer.on('gotFact', (e, json) => {
  const catFact = document.getElementById('catFact')
  catFact.innerText = json
});

const API = {
  // node: () => process.versions.node,
  // chrome: () => process.versions.chrome,
  // electron: () => process.versions.electron,
  // ping: () => ipcRenderer.invoke('ping'),
  getFact: async () => await ipcRenderer.invoke('getFact'),
  // we can also expose variables, not just functions
}

contextBridge.exposeInMainWorld('api', API)
