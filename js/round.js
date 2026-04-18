function startRound() {
  if (state.players.length < 3) {
    alert("Для гри потрібно щонайменше 3 гравці.");
    return;
  }

  const roundData = getRoundData();
  if (!roundData) {
    alert("Немає доступних слів для поточного складу гравців.");
    return;
  }

  markWordAsUsed(roundData.word.id);

  state.roundNumber += 1;
  state.selectedSuspectId = null;
  state.currentRound = {
    category: roundData.category,
    word: roundData.word,
    spyPlayerIds: pickSpyPlayerIds(state.players),
    revealIndex: 0,
    cardVisible: false,
  };

  renderAll();
  switchScreen("screenReveal");
}

function cancelRound() {
  if (!confirm("Скасувати поточний раунд?")) return;

  state.currentRound = null;
  state.selectedSuspectId = null;
  renderAll();
  switchScreen("screenKnowledge");
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

function pickSpyPlayerIds(players) {
  const roll = Math.random();

  // 5% — всі шпіони
  if (roll < 0.05) {
    return players.map((player) => player.id);
  }

  // 5% — два шпіони
  if (roll < 0.1) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2).map((player) => player.id);
  }

  // 90% — один шпіон
  return [pickRandom(players).id];
}
