const getFact = async () => {
  await window.api.getFact();
};

const fetchInitData = () => {
  window.api.getStoredFacts();
  getFact();
};

const runNotifier = async () => {
  window.api.runNotifier();
};

const addToStoredFacts = async () => {
  const newFact = document.getElementById('catFact').innerHTML;
  const isValidTarget = newFact !== 'Getting a fact, please wait...';
  if (isValidTarget) {
    getFact();
    await window.api.addToStoredFacts(newFact);
  }
};

const removeFromStoredFacts = async (e) => {
  const targetId = e.target.id;
  const isValidTarget = targetId !== 'favoriteFacts' && targetId !== 'placeholder';
  if (isValidTarget) {
    await window.api.removeFromStoredFacts({
      name: e.target.innerHTML,
      id: targetId,
    });
  }
};

document.getElementById('factReload').addEventListener('click', getFact);
document.getElementById('catFact').addEventListener('click', addToStoredFacts);
document.getElementById('favoriteFacts').addEventListener('click', removeFromStoredFacts);

fetchInitData();
runNotifier();
