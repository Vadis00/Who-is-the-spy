function startRound() {
  if (state.players.length < 3) {
    alert('Для гри потрібно щонайменше 3 гравці.');
    return;
  }

  const roundData = getRoundData();
  if (!roundData) {
    alert('Немає жодної категорії, яку знають усі гравці. Позначте більше категорій.');
    return;
  }

  state.roundNumber += 1;
  state.selectedSuspectId = null;
  state.currentRound = {
    category: roundData.category,
    word: roundData.word,
    spyPlayerId: pickRandom(state.players).id,
    revealIndex: 0,
    cardVisible: false
  };

  renderAll();
  switchScreen('screenReveal');
}

function cancelRound() {
  if (!confirm('Скасувати поточний раунд?')) return;

  state.currentRound = null;
  state.selectedSuspectId = null;
  renderAll();
  switchScreen('screenKnowledge');
}

function showCurrentCard() {
  if (!state.currentRound) return;
  state.currentRound.cardVisible = true;
  renderReveal();
}

function hideCurrentCard() {
  if (!state.currentRound) return;
  state.currentRound.cardVisible = false;
  renderReveal();
}

function nextRevealPlayer() {
  if (!state.currentRound) return;

  if (state.currentRound.revealIndex < state.players.length - 1) {
    state.currentRound.revealIndex += 1;
    state.currentRound.cardVisible = false;
    renderReveal();
  }
}