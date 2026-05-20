/* 숭실 단어 탐험 v0.2.2 - 아이템 하위 호환 로직 추가 버전 */
/*
필요 기능
- 2개의 스테이지
- 마우스,키보드 입력
- 시작 화면에서 소개 및 사용법 안내 + 기존 게임에서 추가된 기능에 대한 설명
- 종료 화면에서 게임을 다시 할지 묻는 안내o, 제작자의 이름과 소속, 제작 소감
- 중간 저장을 통해 이어하는 기능 
*/

const MAX_TURNS = 2;
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
}

function drawGlobalHeader() {
  fill(50, 100, 150); rect(0, 0, width, 60);
  fill(255); textSize(22); textAlign(LEFT, CENTER);
  text("숭실 단어 탐험: 진리 수집", 20, 30);
  textAlign(RIGHT, CENTER);
  text(`남은 기회: ${gameState.turns}/${MAX_TURNS}`, width - 20, 30);
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
  if (gameState.activeView === "phone" && mouseX > pX && mouseX < pX + 150 && mouseY > 80 && mouseY < 120) {
    gameState.activeView = "map"; updateDOMVisibility(); return;
  }
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
  if (gameState.activeView === "title") {
    gameState.activeView = "map"; updateDOMVisibility();
  }
  else if (gameState.activeView === "gameWin") {
    if(mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 50 && mouseY < height / 2 + 70) {
      resetGame();
    }
  }
  else if (gameState.activeView === "gameOver") {
    if(mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 50 && mouseY < height / 2 + 70) {
      resetGame();
    }
  }
}
