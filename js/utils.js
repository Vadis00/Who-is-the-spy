function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createPlayer(name) {
  return {
    id: crypto.randomUUID(),
    name,
    knownCategoryIds: WORD_LIBRARY.map(category => category.id)
  };
}