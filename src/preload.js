const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('gettingFactStarted', () => {
  const isLoading = document.getElementById('isLoading');
  isLoading.innerText = 'True';
});

ipcRenderer.on('gettingFactEnded', () => {
  const isLoading = document.getElementById('isLoading');
  isLoading.innerText = 'False';
});

ipcRenderer.on('gotFact', (e, json) => {
  const catFact = document.getElementById('catFact');
  catFact.innerText = json;
});

ipcRenderer.on('clearFacts', () => {
  const favoriteFacts = document.getElementById('favoriteFacts');
  favoriteFacts.innerHTML = '';
});

ipcRenderer.on('populateFacts', (e, factObject) => {
  const paragraph = document.createElement('p');
  const node = document.createTextNode(factObject.name);
  paragraph.setAttribute('id', factObject.id);

  const favoriteFacts = document.getElementById('favoriteFacts');
  paragraph.appendChild(node);
  favoriteFacts.appendChild(paragraph);
});

const API = {
  removeFromStoredFacts: (factToRemove) => ipcRenderer.invoke('removeFromStoredFacts', factToRemove),
  addToStoredFacts: (newFact) => ipcRenderer.invoke('addToStoredFacts', newFact),
  getStoredFacts: () => ipcRenderer.invoke('getStoredFacts'),
  getFact: () => ipcRenderer.invoke('getFact'),
};

contextBridge.exposeInMainWorld('api', API);
