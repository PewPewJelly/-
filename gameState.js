let gameState = {
    turns: MAX_TURNS,
    stage: 1,
    inventory: { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 },
    history: [],
    gameWon: false,
    // "map" 또는 "phone" 또는 "title" 또는 "gameOver"
    activeView: "title",
    isExploring: false,
    explorationTimer: 0,
    pendingBuildingId: null
};

function drawGameOverOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 150, height / 2 - 50, 300, 120, 15);
  fill(50); textAlign(CENTER, CENTER); textSize(24);
  text(gameState.gameWon ? "진리 수집 성공!" : "도전 실패... 클릭하여 다시 시작", width / 2, height / 2 - 10);
  textSize(16); text(`정답: ${ANSWER_WORD}`, width / 2, height / 2 + 30);
}

function drawGameWinOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 150, height / 2 - 50, 300, 120, 15);
  fill(50); textAlign(CENTER, CENTER); textSize(24);
  text("진리 수집 성공! 제작소감어쩌구저쩌구", width / 2, height / 2 - 10);
}