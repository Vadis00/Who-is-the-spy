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
    knownCategoryIds: WORD_LIBRARY.map(category => category.id),
    isKnowledgeOpen: false
  };
}

const USED_WORDS_STORAGE_KEY = "spy_game_used_words_v1";
const USED_WORDS_TTL_MS = 1000 * 60 * 60 * 6; // 6 годин

let usedWordIdsMemory = new Set();

function loadUsedWords() {
  try {
    const raw = localStorage.getItem(USED_WORDS_STORAGE_KEY);
    if (!raw) {
      usedWordIdsMemory = new Set();
      return;
    }

    const parsed = JSON.parse(raw);
    const now = Date.now();

    if (!parsed || !Array.isArray(parsed.ids) || !parsed.expiresAt || parsed.expiresAt < now) {
      localStorage.removeItem(USED_WORDS_STORAGE_KEY);
      usedWordIdsMemory = new Set();
      return;
    }

    usedWordIdsMemory = new Set(parsed.ids);
  } catch (error) {
    console.error("Failed to load used words:", error);
    usedWordIdsMemory = new Set();
  }
}

function saveUsedWords() {
  try {
    const payload = {
      ids: Array.from(usedWordIdsMemory),
      expiresAt: Date.now() + USED_WORDS_TTL_MS
    };

    localStorage.setItem(USED_WORDS_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save used words:", error);
  }
}

function markWordAsUsed(wordId) {
  usedWordIdsMemory.add(wordId);
  saveUsedWords();
}

function isWordUsed(wordId) {
  return usedWordIdsMemory.has(wordId);
}

function clearUsedWords() {
  usedWordIdsMemory = new Set();
  localStorage.removeItem(USED_WORDS_STORAGE_KEY);
}