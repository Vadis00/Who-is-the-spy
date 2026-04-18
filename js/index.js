els.addPlayerBtn.addEventListener('click', addPlayer);

els.playerInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') addPlayer();
});

els.demoPlayersBtn.addEventListener('click', fillDemoPlayers);
els.toKnowledgeBtn.addEventListener('click', () => switchScreen('screenKnowledge'));
els.backToSetupBtn1.addEventListener('click', () => switchScreen('screenSetup'));
els.startRoundBtn.addEventListener('click', startRound);
els.cancelRoundBtn.addEventListener('click', cancelRound);
els.showCardBtn.addEventListener('click', showCurrentCard);
els.hideCardBtn.addEventListener('click', hideCurrentCard);
els.nextPlayerBtn.addEventListener('click', nextRevealPlayer);
els.toVotingBtn.addEventListener('click', () => switchScreen('screenVoting'));
els.backToRevealBtn.addEventListener('click', () => switchScreen('screenReveal'));
els.showResultsBtn.addEventListener('click', showResults);
els.newRoundBtn.addEventListener('click', newRound);
els.toKnowledgeBtn2.addEventListener('click', () => switchScreen('screenKnowledge'));
els.backToSetupBtn2.addEventListener('click', () => switchScreen('screenSetup'));


const votingChips = document.getElementById('votingChips');

if (votingChips) {
  votingChips.addEventListener('click', () => {
    votingChips.classList.toggle('chips--hidden');
    votingChips.classList.toggle('chips--visible');
  });
}

loadUsedWords();
renderAll();