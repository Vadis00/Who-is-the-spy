function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });

  state.currentScreen = screenId;
  renderHero();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHero() {
  const texts = {
    screenSetup:
      "Додайте гравців, а потім переходьте до вибору знайомих персонажів.",
    screenKnowledge:
      "Для кожного гравця окремо відмітьте персонажів, яких він знає.",
    screenReveal:
      "Передавайте телефон по колу. Кожен гравець бачить лише свою картку.",
    screenVoting: "Після обговорення оберіть одного підозрюваного.",
    screenResults: "Подивіться, хто був шпигуном, і почніть новий раунд.",
  };

  els.heroText.textContent = texts[state.currentScreen] || texts.screenSetup;
}

function updateTopChips() {
  els.playersChip.textContent = `Гравців: ${state.players.length}`;
  els.roundsChip.textContent = `Раундів: ${state.roundNumber}`;
  els.toKnowledgeBtn.disabled = state.players.length < 3;
}

function renderPlayers() {
  if (!state.players.length) {
    els.playersList.innerHTML =
      '<div class="hint-box">Поки що немає гравців. Додайте щонайменше трьох учасників.</div>';
    return;
  }

  els.playersList.innerHTML = state.players
    .map(
      (player, index) => `
        <article class="player-item">
          <div>
            <div class="player-name">${index + 1}. ${escapeHtml(player.name)}</div>
            <div class="meta">Знає категорій: ${(player.knownCategoryIds || []).length} з ${WORD_LIBRARY.length}</div>
          </div>
          <button class="icon-button" type="button" onclick="removePlayer('${player.id}')">✕</button>
        </article>
      `,
    )
    .join("");
}

function renderKnowledge() {
  if (!state.players.length) {
    els.knowledgeContainer.innerHTML =
      '<div class="hint-box">Спочатку додайте гравців на стартовому екрані.</div>';
    return;
  }

  els.knowledgeContainer.innerHTML = state.players
    .map(
      (player, playerIndex) => `
    <div class="knowledge-player card" data-player-card="${player.id}" style="padding:16px; border-radius:22px;">
      <div class="knowledge-header">
        <div>
          <h3 class="card__title" style="font-size:18px;">${playerIndex + 1}. ${escapeHtml(player.name)}</h3>
          <p class="card__subtitle">Позначте категорії, у яких цей гравець добре орієнтується.</p>
        </div>
        <div class="knowledge-count" data-known-count>
          ${(player.knownCategoryIds || []).length}/${WORD_LIBRARY.length}
        </div>
      </div>

      <div class="knowledge-actions">
        <button
          class="button button--secondary"
          type="button"
          onclick="toggleKnowledgeVisibility('${player.id}')"
        >
          ${player.isKnowledgeOpen ? "Сховати список" : "Показати список"}
        </button>

        <button
          class="button button--ghost"
          type="button"
          onclick="setAllCategoriesForPlayer('${player.id}', true)"
        >
          Знає всі
        </button>

        <button
          class="button button--ghost"
          type="button"
          onclick="setAllCategoriesForPlayer('${player.id}', false)"
        >
          Очистити
        </button>
      </div>

      ${
        player.isKnowledgeOpen
          ? `
        <div class="knowledge-words-scroll">
          <div class="knowledge-list">
            ${WORD_LIBRARY.map((category) => {
              const checked = (player.knownCategoryIds || []).includes(
                category.id,
              );

              return `
                <article class="knowledge-word">
                  <div>
                    <h4 class="knowledge-word__title">${escapeHtml(category.category)}</h4>
                    <div class="knowledge-word__sub">Персонажів у категорії: ${category.words.length}</div>
                  </div>

                  <label class="check">
                    <input
                      type="checkbox"
                      ${checked ? "checked" : ""}
                      onchange="toggleKnownCategory('${player.id}', '${category.id}', this.checked)"
                    />
                    <span>Знає</span>
                  </label>
                </article>
              `;
            }).join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `,
    )
    .join("");
}

function renderReveal() {
  const round = state.currentRound;

  if (!round) {
    els.revealSubtitle.textContent = "Раунд ще не розпочато.";
    els.revealProgress.innerHTML = "";
    els.revealCard.innerHTML = `
      <div class="word-display__eyebrow">Очікування</div>
      <h3 class="word-display__title">Спочатку запустіть раунд</h3>
      <div class="word-display__hint">
        Поверніться до екрану вибору персонажів і натисніть «Почати гру».
      </div>
    `;
    return;
  }

  const player = state.players[round.revealIndex];
  const isSpy = round.spyPlayerIds.includes(player.id);
  const isLast = round.revealIndex === state.players.length - 1;

  els.revealSubtitle.textContent = `Хід гравця: ${player.name}`;
  els.revealProgress.innerHTML = state.players
    .map((_, index) => {
      const cls =
        index < round.revealIndex
          ? "is-done"
          : index === round.revealIndex
            ? "is-active"
            : "";

      return `<div class="progress__item ${cls}"></div>`;
    })
    .join("");

  if (!round.cardVisible) {
    els.revealCard.innerHTML = `
      <div class="word-display__eyebrow">Секретна картка</div>
      <h3 class="word-display__title">${escapeHtml(player.name)}</h3>
      <div class="word-display__hint">
        Натисни «Показати», подивись свою роль і сховай екран перед передачею іншому гравцеві.
      </div>
    `;
  } else if (isSpy) {
    els.revealCard.innerHTML = `
  <div class="word-display__eyebrow">Твоя роль</div>
  <div class="word-display__spy">Ти шпіон</div>
  <div class="word-display__hint">Категорія: ${escapeHtml(round.category.category)}</div>
  <div class="word-display__hint">
    Ти не знаєш точного слова, але знаєш тему. Слухай інших і спробуй не видати себе.
  </div>
`;
  } else {
    els.revealCard.innerHTML = `
  <div class="word-display__eyebrow">Твоя категорія</div>
  <div class="word-display__hint">Категорія: ${escapeHtml(round.category.category)}</div>
  <h3 class="word-display__title">${escapeHtml(round.word.text)}</h3>
  <div class="word-display__hint">Підказка: ${escapeHtml(round.word.hint)}</div>

      ${
        round.word.imageUrl
          ? `
        <div class="word-display__image-wrap">
          <img
            class="word-display__image"
            src="${escapeHtml(round.word.imageUrl)}"
            alt="${escapeHtml(round.word.text)}"
          />
        </div>
      `
          : ""
      }

      ${
        round.word.infoUrl
          ? `
        <div class="word-display__url">URL: ${escapeHtml(round.word.infoUrl)}</div>
      `
          : ""
      }
    `;
  }

  els.showCardBtn.classList.toggle("hidden", round.cardVisible);
  els.hideCardBtn.classList.toggle("hidden", !round.cardVisible);
  els.nextPlayerBtn.classList.toggle("hidden", !round.cardVisible || isLast);
  els.toVotingBtn.classList.toggle("hidden", !round.cardVisible || !isLast);
}

function renderVoting() {
  const round = state.currentRound;

  if (!round) {
    els.voteList.innerHTML =
      '<div class="hint-box">Раунд ще не розпочато.</div>';
    els.showResultsBtn.disabled = true;
    return;
  }

  els.votingWordChip.textContent = `Слово: ${round.word.text}`;
  els.votingHintChip.textContent = `Підказка: ${round.word.hint}`;
  els.showResultsBtn.disabled = !state.selectedSuspectId;
  els.votingWordChip.textContent = `Категорія: ${round.category.category}`;
  els.votingHintChip.textContent = `Слово приховане до кінця раунду`;

  els.voteList.innerHTML = state.players
    .map(
      (player) => `
    <article class="vote-item ${state.selectedSuspectId === player.id ? "is-selected" : ""}">
      <div>
        <div class="vote-name">${escapeHtml(player.name)}</div>
        <div class="meta">Натисніть, щоб обрати підозрюваного</div>
      </div>

      <button class="pill" type="button" onclick="selectSuspect('${player.id}')">
        ${state.selectedSuspectId === player.id ? "Обрано" : "Обрати"}
      </button>
    </article>
  `,
    )
    .join("");

  if (els.votingChips) {
    els.votingChips.classList.remove("chips--visible");
    els.votingChips.classList.add("chips--hidden");
  }
}

function renderResults() {
  const round = state.currentRound;

  if (!round) {
    els.resultsSummary.textContent = "Раунд ще не завершено.";
    els.resultWord.textContent = "—";
    els.resultHint.textContent = "—";
    els.resultList.innerHTML =
      '<div class="hint-box">Запустіть гру, щоб побачити результат.</div>';
    return;
  }

const spies = state.players.filter(player => round.spyPlayerIds.includes(player.id));
const foundSpy = round.spyPlayerIds.includes(state.selectedSuspectId);


if (round.spyPlayerIds.length === state.players.length) {
  els.resultsSummary.textContent =
    'Це був спеціальний раунд: шпигунами були всі.';
} else if (round.spyPlayerIds.length === 2) {
  els.resultsSummary.textContent = foundSpy
    ? `Було два шпигуни. Ви вгадали одного з них.`
    : `Було два шпигуни, але ви нікого не вгадали.`;
} else {
  const spy = spies[0];
  els.resultsSummary.textContent = foundSpy
    ? `Шпигуна викрили. Це був ${spy ? spy.name : 'один з гравців'}.`
    : `Шпигуна не вгадали. Це був ${spy ? spy.name : 'один з гравців'}.`;
}

  els.resultWord.textContent = round.word.text;
  els.resultHint.textContent = round.word.hint;
  els.resultWord.textContent = round.word.text;
  els.resultHint.textContent = round.category.category;

  els.resultList.innerHTML = state.players
    .map((player) => {
      const isSpy = round.spyPlayerIds.includes(player.id);
      const wasSelected = player.id === state.selectedSuspectId;

      return `
      <article class="result-item">
        <div>
          <div class="result-name">${escapeHtml(player.name)}</div>
          <div class="meta">${wasSelected ? "Обраний у голосуванні" : "Не був обраний"}</div>
        </div>

        <div class="pill ${isSpy ? "pill--spy" : "pill--safe"}">
          ${isSpy ? "Шпіон" : "Не шпіон"}
        </div>
      </article>
    `;
    })
    .join("");
}

function renderAll() {
  updateTopChips();
  renderHero();
  renderPlayers();
  renderKnowledge();
  renderReveal();
  renderVoting();
  renderResults();
}
