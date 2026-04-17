window.selectSuspect = function(playerId) {
  state.selectedSuspectId = playerId;
  renderVoting();
};

function showResults() {
  if (!state.currentRound) return;

  if (!state.selectedSuspectId) {
    alert('Спочатку оберіть підозрюваного.');
    return;
  }

  renderResults();
  switchScreen('screenResults');
}

function newRound() {
  state.currentRound = null;
  state.selectedSuspectId = null;
  renderAll();
  switchScreen('screenKnowledge');
  setTimeout(startRound, 40);
}