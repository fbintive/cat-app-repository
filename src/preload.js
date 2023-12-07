const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('gettingFactStarted', () => {
  const isLoading = document.getElementById('isLoading');
  const catFact = document.getElementById('catFact');
  catFact.innerText = 'Getting a fact, please wait...';
  isLoading.classList.add('visible');
  catFact.classList.add('isLoading');
});

ipcRenderer.on('gettingFactEnded', () => {
  const isLoading = document.getElementById('isLoading');
  const catFact = document.getElementById('catFact');
  isLoading.classList.remove('visible');
  catFact.classList.remove('isLoading');
});

ipcRenderer.on('gotFact', (e, json) => {
  const catFact = document.getElementById('catFact');
  catFact.innerText = json;
});

ipcRenderer.on('clearFacts', () => {
  const favoriteFacts = document.getElementById('favoriteFacts');
  favoriteFacts.innerHTML = '';
});

ipcRenderer.on('addPlaceholderFact', () => {
  const placeholder = document.createElement('i');
  const node = document.createTextNode('No facts added yet');
  placeholder.setAttribute('id', 'placeholder');

  const favoriteFacts = document.getElementById('favoriteFacts');
  placeholder.appendChild(node);
  favoriteFacts.appendChild(placeholder);
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
