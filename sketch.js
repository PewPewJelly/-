/* 숭실 단어 탐험 v0.2.2 - 아이템 하위 호환 로직 추가 버전 */
/*
필요 기능
- 2개의 스테이지--
- 마우스,키보드 입력o
- 시작 화면에서 소개 및 사용법 안내 + 기존 게임에서 추가된 기능에 대한 설명
- 종료 화면에서 게임을 다시 할지 묻는 안내o, 제작자의 이름과 소속, 제작 소감
- 중간 저장을 통해 이어하는 기능o
- 
*/

const MAX_TURNS = 10; // 스테이지가 올라갈수록 기회는 줄어듦
let currentMaxTurns = MAX_TURNS;
const ANSWER_WORD = "방학"; 

let inputField, submitBtn;

// ... (나머지 UI 및 시스템 함수들은 이전 중앙 배치 버전과 동일합니다) ...

function checkGameOverCondition() {
  if (gameState.turns <= 0 && !gameState.gameWon){
    gameState.activeView = "gameOver";
    updateDOMVisibility();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  inputField = createInput();
  inputField.position(width/2 - 60, 580); 
  inputField.size(120, 20);
  submitBtn = createButton("제출");
  submitBtn.position(width/2 + 70, 580);
  submitBtn.mousePressed(guessWordAction);
  updateDOMVisibility();
}

function draw() {
  background(240);

  drawGlobalHeader();

  if (gameState.activeView === "map") drawMapScreen();
  else if (gameState.activeView === "phone") drawPhoneScreen();
  else if (gameState.activeView === "title") drawTitleScreen();
  else if (gameState.activeView === "gameOver") drawGameOverOverlay();
  else if (gameState.activeView === "gameWin") drawGameWinOverlay();
  if (gameState.isExploring) drawExplorationOverlay();
  else if (gameState.explorationResultLabel) drawExplorationResultOverlay();
}

function drawGlobalHeader() {
  currentMaxTurns = MAX_TURNS - ((gameState.stage-1)*4);
  fill(50, 100, 150); rect(0, 0, width, 60);
  fill(255); textSize(22); textAlign(LEFT, CENTER);
  text("숭실 단어 탐험: 진리 수집", 20, 30);
  
  // 헤더 중앙에 현재 연승 상태 표시 추가
  textAlign(CENTER, CENTER);
  textSize(18);
  if (gameState.winStreak > 0) {
    text(`🔥 ${gameState.winStreak} 연승 중`, width / 2, 30);
  }
  
  textAlign(RIGHT, CENTER);
  textSize(22);
  text(`남은 기회: ${gameState.turns}/${currentMaxTurns}`, width - 20, 30);
}

function drawCollectionBox(x, y) {
  push(); translate(x, y);
  fill(255); stroke(200); strokeWeight(1);
  rect(0, 0, 130, 210, 10); 
  noStroke(); fill(50); textSize(16); textAlign(CENTER, TOP); text("수집 현황", 65, 10);
  textAlign(LEFT, TOP); let y_off = 40;
  for (let k in HINT_CONFIG) {
    if (k === "jinri") continue;
    text(`${HINT_CONFIG[k].icon} ${HINT_CONFIG[k].name}: ${gameState.inventory[k]}`, 15, y_off);
    y_off += 30;
  }
  pop();
}

function mousePressed() {
  if (gameState.isExploring) return;
  let pW = 280, pX = width/2 - pW/2;
  
  // 1. 타이틀 화면 처리
  if (gameState.activeView === "title") {
    // 새 게임 시작 버튼 범위
    if (mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > height / 2 + 80 && mouseY < height / 2 + 120) {
      resetGame();
      loadGameProgress(); // 새 게임 시작 시에도 초기 상태 저장
    }
    // 이어하기 버튼 범위
    else if (localStorage.getItem("ssu_word_game_save") &&
             mouseX > width / 2 - 140 && mouseX < width / 2 + 140 && mouseY > height / 2 + 135 && mouseY < height / 2 + 175) {
      loadGameProgress();
    }
    return;
  }
  
  // 2. 폰 화면에서 돌아가기
  if (gameState.activeView === "phone" && mouseX > pX && mouseX < pX + 150 && mouseY > 80 && mouseY < 120) {
    gameState.activeView = "map"; updateDOMVisibility(); return;
  }
  
  // 3. 맵 화면에서 건물 클릭
  if (gameState.activeView === "map") {
    for (let b of buildings) {
      if (mouseX > width * b.x && mouseX < width * b.x + width * b.w && mouseY > height * b.y && mouseY < height * b.y + height * b.h && b.id !== 7) {
        processExplore(b.id); return;
      }
    }
    if (mouseX > width * buildings[6].x && mouseX < width * buildings[6].x + width * buildings[6].w && mouseY > height * buildings[6].y && mouseY < height * buildings[6].y + height * buildings[6].h) {
      gameState.activeView = "phone"; updateDOMVisibility();
    }
  }
  
  // 4. 게임 승리 오버레이 클릭
  else if (gameState.activeView === "gameWin") {
    if(mouseX > width / 2 - 200 && mouseX < width / 2 + 200 && mouseY > height / 2 - 120 && mouseY < height / 2 + 120) {
      if (gameState.stage < 2) {
        nextStage(); // 다음 스테이지로
      } else {
        resetGame(); // 완전 클리어 후 처음부터
      }
    }
  }
  
  // 5. 게임 오버 오버레이 클릭
  else if (gameState.activeView === "gameOver") {
    if(mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 60 && mouseY < height / 2 + 80) {
      resetGame();
    }
  }
}

function keyPressed() {
  // 탐색 중일 때 스페이스바로 타이밍 판정
  if (gameState.isExploring && !gameState.explorationPressed && (key === ' ' || keyCode === 32)) {
    gameState.explorationPressed = true;
    // 바 위치와 타깃 중심 비교로 정확도 산정 (0~1)
    let pos = gameState.explorationBarPos; // 0~1
    let tStart = gameState.explorationTargetStart;
    let tW = gameState.explorationTargetWidth;
    let tCenter = tStart + tW / 2;
    let diff = Math.abs(pos - tCenter);
    let accuracy = 0;
    if (diff <= tW / 2) {
      accuracy = 1 - (diff / (tW / 2));
    } else {
      let outerLimit = tW * 1.1;
      if (diff <= outerLimit) {
        accuracy = 0.4 * (1 - (diff - tW / 2) / (outerLimit - tW / 2));
      } else {
        accuracy = 0;
      }
    }
    gameState.explorationResult = accuracy;
    // 탐색 처리 호출
    gameState.isExploring = false;
    executeExploreLogic(gameState.pendingBuildingId, accuracy);
  }
}
