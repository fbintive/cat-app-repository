const addToStoredFacts = async () => {
  const newFact = document.getElementById('catFact').innerHTML;
  await window.api.addToStoredFacts(newFact);
};

const removeFromStoredFacts = async (e) => {
  const targetId = e.target.id;
  const isValidTarget = targetId !== 'favoriteFacts';
  if (isValidTarget) {
    await window.api.removeFromStoredFacts({
      name: e.target.innerHTML,
      id: targetId,
    });
  }
};

const getFact = async () => {
  await window.api.getFact();
};

const fetchInitData = () => {
  window.api.getStoredFacts();
  getFact();
};

document.getElementById('factReload').addEventListener('click', getFact);
document.getElementById('catFact').addEventListener('click', addToStoredFacts);
document.getElementById('favoriteFacts').addEventListener('click', removeFromStoredFacts);

fetchInitData();
