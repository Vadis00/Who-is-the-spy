window.toggleKnownWord = function(playerId, wordId, checked) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  if (checked) {
    if (!player.knownWordIds.includes(wordId)) {
      player.knownWordIds.push(wordId);
    }
  } else {
    player.knownWordIds = player.knownWordIds.filter(id => id !== wordId);
  }

  renderPlayers();
};

window.setAllWordsForPlayer = function(playerId, value) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.knownWordIds = value ? WORD_LIBRARY.map(word => word.id) : [];
  renderKnowledge();
  renderPlayers();
};

function getCommonCategories() {
  return WORD_LIBRARY.filter(category =>
    state.players.every(player => player.knownCategoryIds.includes(category.id))
  );
}

function getRoundData() {
  const commonCategories = getCommonCategories();
  if (!commonCategories.length) return null;

  const selectedCategory = pickRandom(commonCategories);
  const selectedWord = pickRandom(selectedCategory.words);

  return {
    category: selectedCategory,
    word: selectedWord
  };
}

window.toggleKnownCategory = function(playerId, categoryId, checked) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  if (checked) {
    if (!player.knownCategoryIds.includes(categoryId)) {
      player.knownCategoryIds.push(categoryId);
    }
  } else {
    player.knownCategoryIds = player.knownCategoryIds.filter(id => id !== categoryId);
  }

  renderPlayers();

  const playerCard = document.querySelector(`[data-player-card="${playerId}"]`);
  if (!playerCard) return;

  const countEl = playerCard.querySelector('[data-known-count]');
  if (countEl) {
    countEl.textContent = `${player.knownCategoryIds.length}/${WORD_LIBRARY.length}`;
  }
};

window.setAllCategoriesForPlayer = function(playerId, value) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.knownCategoryIds = value ? WORD_LIBRARY.map(category => category.id) : [];
  renderKnowledge();
  renderPlayers();
};