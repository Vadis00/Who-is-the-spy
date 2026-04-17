function addPlayer() {
  const name = els.playerInput.value.trim();
  if (!name) {
    els.playerInput.focus();
    return;
  }

  const duplicate = state.players.some(player => player.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    alert('Гравець з таким ім’ям уже існує.');
    return;
  }

  state.players.push(createPlayer(name));
  els.playerInput.value = '';
  renderAll();
  switchScreen('screenSetup');
  els.playerInput.focus();
}

window.removePlayer = function(playerId) {
  state.players = state.players.filter(player => player.id !== playerId);
  renderAll();
  switchScreen('screenSetup');
};

function fillDemoPlayers() {
  if (state.players.length && !confirm('Замінити поточний список гравців на демо-список?')) {
    return;
  }

  state.players = ['Анна', 'Ігор', 'Марія', 'Олег'].map(createPlayer);
  renderAll();
  switchScreen('screenSetup');
};