let gameState = {
    turns: currentMaxTurns,
    stage: 1,
    inventory: { baekma: 0, soongsil: 0, shung: 1, bongsa: 3, tulip: 1 },
    history: [],
    gameWon: false,
    activeView: "title",
    isExploring: false,
    explorationTimer: 0,
    pendingBuildingId: null,

  // 탐색 미니게임 상태 (이동 바 및 타이밍 판정)
  explorationBarPos: 0, // 0~1 비율
  explorationBarSpeed: 0.01,
  explorationTargetStart: 0, // 0~1 비율 (타깃 시작 위치)
  explorationTargetWidth: 0.12, // 0~1 비율 (타깃 너비)
  explorationPressed: false,
  explorationResult: null, // 0~1 정확도
  explorationResultLabel: null,
  explorationResultTimer: 0,

    winStreak: 0
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
    activeView: gameState.activeView,
    winStreak: gameState.winStreak
  }));
}

function loadGameProgress() {
  let saved = localStorage.getItem("ssu_word_game_save");
  if (saved) {
    let data = JSON.parse(saved);
    Object.assign(gameState, data);
    // 만약 기존 세이브 파일에 winStreak이 없다면 0으로 초기화
    if (gameState.winStreak === undefined) gameState.winStreak = 0;
    
    currentAnswer = STAGE_ANSWERS[gameState.stage] || "진리";
    updateDOMVisibility();
    return true;
  }
  return false;
}

function drawGameOverOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 150, height / 2 - 70, 300, 160, 15);
  fill(50); textAlign(CENTER, CENTER); textSize(24);
  text("도전 실패...", width / 2, height / 2 - 30);
  
  // 패배 시 안내 및 정답 표시
  textSize(16); 
  text(`정답: ${currentAnswer}`, width / 2, height / 2 + 5);
  fill(200, 50, 50);
  text("연승이 초기화되었습니다. 😭", width / 2, height / 2 + 30);
  gameState.winStreak = 0; // 패배 시 연승 초기화
  
  fill(50);
  text("클릭하여 다시 시작", width / 2, height / 2 + 55);
  saveGameProgress(); // 패배 시에도 진행 상황 저장 (연승 초기화 포함)
}

function drawGameWinOverlay() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255); rect(width / 2 - 200, height / 2 - 130, 400, 260, 15);
  fill(50); textAlign(CENTER, CENTER);
  
  updateDOMVisibility(); // 승리 화면에서도 DOM 업데이트
  if (gameState.stage < 2) {
    textSize(24); text(`Stage ${gameState.stage} 성공!`, width / 2, height / 2 - 40);
    textSize(18); fill(0, 150, 50);
    text(`현재 🔥 ${gameState.winStreak} 연승 중!`, width / 2, height / 2 - 5);
    
    textSize(16); fill(50);
    text("다음 스테이지로 나아가려면 클릭하세요.", width / 2, height / 2 + 30);
  } else {
    textSize(26); fill(0, 102, 204);
    text("🎉 모든 진리 수집 성공! 🎉", width / 2, height / 2 - 70);
    
    // 최종 연승 표시
    textSize(18); fill(0, 150, 50);
    text(`최종 기록: ✨ ${gameState.winStreak} 연승!`, width / 2, height / 2 - 35);
    
    fill(50); textSize(14);
    text("소속: 글로벌미디어학부", width / 2, height / 2 + 5);
    text("제작자: 이준배, 김성윤", width / 2, height / 2 + 25);
    textSize(12);
    text('"숭실의 자음과 모음을 모아 진리를 찾는\n여정을 게임으로 구현하게 되어 뜻깊었습니다!"', width / 2, height / 2 + 65);
    textSize(14); fill(100);
    text("클릭하여 처음부터 다시 시작", width / 2, height / 2 + 110);
  }
}