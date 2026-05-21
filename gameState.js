let gameState = {
    turns: 2,
    stage: 1,
    inventory: { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 },
    history: [],
    gameWon: false,
    activeView: "title",
    isExploring: false,
    explorationTimer: 0,
    pendingBuildingId: null
};

// 정답 단어 목록 (스테이지별)
const STAGE_ANSWERS = {
  1: "방학",
  2: "진리"
};
let currentAnswer = STAGE_ANSWERS[1];

// 로컬 스토리지를 이용한 중간 저장 기능
function saveGameProgress() {
  localStorage.setItem("ssu_word_game_save", JSON.stringify({
    turns: gameState.turns,
    stage: gameState.stage,
    inventory: gameState.inventory,
    history: gameState.history,
    gameWon: gameState.gameWon,
    activeView: gameState.activeView
  }));
}

function loadGameProgress() {
  let saved = localStorage.getItem("ssu_word_game_save");
  if (saved) {
    let data = JSON.parse(saved);
    Object.assign(gameState, data);
    currentAnswer = STAGE_ANSWERS[gameState.stage] || "진리";
    updateDOMVisibility();
    return true;
  }
  return false;
}

function drawGameOverOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 150, height / 2 - 60, 300, 140, 15);
  fill(50); textAlign(CENTER, CENTER); textSize(24);
  text("도전 실패...", width / 2, height / 2 - 20);
  textSize(16); 
  text(`정답: ${currentAnswer}`, width / 2, height / 2 + 15);
  text("클릭하여 다시 시작", width / 2, height / 2 + 45);
}

function drawGameWinOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 200, height / 2 - 120, 400, 240, 15);
  fill(50); textAlign(CENTER, CENTER);
  
  if (gameState.stage < 2) {
    textSize(24); text(`Stage ${gameState.stage} 성공!`, width / 2, height / 2 - 30);
    textSize(16); text("다음 스테이지로 나아가려면 클릭하세요.", width / 2, height / 2 + 20);
  } else {
    textSize(26); fill(0, 102, 204);
    text("🎉 모든 진리 수집 성공! 🎉", width / 2, height / 2 - 60);
    
    // 제작자 정보 및 소감 출력 요구사항 반영
    fill(50); textSize(14);
    text("소속: 글로벌미디어학부", width / 2, height / 2 - 20);
    text("제작자: 이준배, 김성윤", width / 2, height / 2);
    textSize(12);
    text('"숭실의 자음과 모음을 모아 진리를 찾는\n여정을 게임으로 구현하게 되어 뜻깊었습니다!"', width / 2, height / 2 + 40);
    textSize(14); fill(100);
    text("클릭하여 처음부터 다시 시작", width / 2, height / 2 + 90);
  }
}