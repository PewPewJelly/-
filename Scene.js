function resetGame() {
    gameState.turns = MAX_TURNS;
    gameState.stage = 1;
    gameState.inventory = { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 };
    gameState.history = [];
    gameState.gameWon = false;
    gameState.activeView = "map";
    gameState.isExploring = false;
    gameState.explorationTimer = 0;
    gameState.pendingBuildingId = null;
    updateDOMVisibility();
}

function updateDOMVisibility() {
  if (gameState.activeView === "phone") {
    inputField.show(); submitBtn.show();
  } else {
    inputField.hide(); submitBtn.hide();
  }
}