function resetGame() {
    loadGameProgress();
    currentMaxTurns = MAX_TURNS;
    gameState.turns = currentMaxTurns; 
    gameState.stage = 1;
    currentAnswer = STAGE_ANSWERS[1];
    gameState.inventory = { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 };
    gameState.history = [];
    gameState.gameWon = false;
    gameState.activeView = "map";
    gameState.isExploring = false;
    gameState.explorationTimer = 0;
    gameState.pendingBuildingId = null;
    updateDOMVisibility();
    saveGameProgress();
}

function nextStage() {
    gameState.stage += 1;
    currentMaxTurns = MAX_TURNS - (gameState.stage - 1) * 4; // 스테이지가 올라갈수록 턴 수 감소
    gameState.turns = currentMaxTurns; // 다음 스테이지 시작 시 기회 초기화
    currentAnswer = STAGE_ANSWERS[gameState.stage] || "진리";
    gameState.gameWon = false;
    gameState.history = []; // 이전 스테이지 추리 내역 초기화 (선택 사항)
    gameState.activeView = "map";
    gameState.isExploring = false;
    updateDOMVisibility();
    saveGameProgress();
}

function updateDOMVisibility() {
  if (gameState.activeView === "phone") {
    if (inputField && submitBtn) { inputField.show(); submitBtn.show(); }
  } else {
    if (inputField && submitBtn) { inputField.hide(); submitBtn.hide(); }
  }
}