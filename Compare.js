// 핵심 변경 지점: 아이템 소모 및 힌트 결정 로직
const HINT_CONFIG = {
  jinri:    { name: "진리", icon: "✨" },
  baekma:   { name: "백마", icon: "🐴" },
  soongsil: { name: "숭실", icon: "🏫" },
  shung:    { name: "슝슝", icon: "🔄" },
  bongsa:   { name: "봉사", icon: "🤝" },
  tulip:    { name: "목튤립",icon: "🥀" }
};

function guessWordAction() {
  let val = inputField.value().trim();
  
  // 💡 1. 글자 수 검사 -> 커스텀 팝업
  if (val.length !== 2) {
    showInGamePopup("정확히 2글자를 입력해주세요!");
    inputField.value("");
    return;
  }
  
  // 💡 2. 완성형 한글 검사 -> 커스텀 팝업
  for (let ch of val) {
    if (!(ch >= '가' && ch <= '힣')) {
      showInGamePopup("올바른 완성형 한글을 입력해주세요!\n(자음/모음 낱자는 입력할 수 없습니다.)");
      inputField.value("");
      return;
    }
  }

  // 고정된 ANSWER_WORD 대신 현재 스테이지의 정답(currentAnswer)을 적용합니다.
  determineHintsForItemSystem(val, currentAnswer);
  inputField.value("");
  if (gameState.activeView === "gameOver") updateDOMVisibility();
}

// 💡 3. Compare.js 안에서만 작동하는 HTML/CSS 커스텀 팝업 함수
function showInGamePopup(message) {
  let existingOverlay = document.getElementById("custom-popup-overlay");
  if (existingOverlay) existingOverlay.remove();

  let overlay = document.createElement("div");
  overlay.id = "custom-popup-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999"; // zindex 오타 수정 (zIndex)

  let box = document.createElement("div");
  box.style.backgroundColor = "#ffffff";
  box.style.padding = "25px 35px";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0px 4px 15px rgba(0,0,0,0.2)";
  box.style.textAlign = "center";
  box.style.fontFamily = "sans-serif";
  box.style.minWidth = "280px";

  let textNode = document.createElement("p");
  textNode.innerText = message;
  textNode.style.fontSize = "16px";
  textNode.style.color = "#333333";
  textNode.style.lineHeight = "1.5";
  textNode.style.margin = "0 0 20px 0";
  box.appendChild(textNode);

  let btn = document.createElement("button");
  btn.innerText = "확인";
  btn.style.backgroundColor = "#6496dc";
  btn.style.color = "#ffffff";
  btn.style.border = "none";
  btn.style.padding = "8px 25px";
  btn.style.borderRadius = "6px";
  btn.style.fontSize = "14px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "bold";
  
  btn.onmouseover = () => btn.style.backgroundColor = "#1e90ff";
  btn.onmouseout = () => btn.style.backgroundColor = "#6496dc";
  btn.onclick = () => overlay.remove();
  
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function determineHintsForItemSystem(guess, answer) {
  if (gameState.turns <= 0 || gameState.activeView === "gameOver") return;
  let guess_comps = splitHangulWord(guess);
  let answer_comps = splitHangulWord(answer);
  if (!guess_comps || !answer_comps) return;

  let hint_types = [];
  for (let i = 0; i < 2; i++) {
    if (guess[i] === answer[i]) {
      hint_types.push("jinri");
      continue;
    }
    let gc = guess_comps[i], ac = answer_comps[i], other_ac = answer_comps[1 - i];
    let cnt = 0, cnt_other = 0;
    let gc_arr = [gc.first, gc.middle, gc.final];
    let ac_arr = [ac.first, ac.middle, ac.final];
    let other_ac_arr = [other_ac.first, other_ac.middle, other_ac.final];
    for (let component of gc_arr) {
      if (component && ac_arr.includes(component)) cnt++;
      if (component && other_ac_arr.includes(component)) cnt_other++;
    }
    
    // 원래 판정
    if (gc.first == ac.first && cnt >= 2) hint_types.push("baekma");
    else if (gc.first != ac.first && cnt >= 2) hint_types.push("soongsil");
    else if (cnt_other >= 1) hint_types.push("shung");
    else if (cnt >= 1) hint_types.push("bongsa");
    else hint_types.push("tulip");
  }

  let final_hint_icons = [];
  
  // 승리 조건: 두 글자 모두 진리 판정
  if (hint_types[0] === "jinri" && hint_types[1] === "jinri") {
    gameState.gameWon = true;
    gameState.activeView = "gameWin";
    
    // 🔥 [연승 반영] 단어 추리 성공 시 연승 증가!
    gameState.winStreak += 1;
    
    updateDOMVisibility(); // 괄호() 누락 수정 완료
    gameState.history.push({ guess: guess, hint: ["✨", "✨"] });
    
    saveGameProgress(); // 상태 실시간 저장
    return;
  }

  // --- 아이템 소모 및 하위 단계 체크 ---
  for (let type of hint_types) {
    if (type === "jinri") {
      final_hint_icons.push("✨");
    } 
    else if (gameState.inventory[type] > 0) {
      gameState.inventory[type] -= 1;
      final_hint_icons.push(HINT_CONFIG[type].icon);
    } 
    else if (type !== "tulip" && gameState.inventory.bongsa > 0) {
      gameState.inventory.bongsa -= 1;
      final_hint_icons.push(HINT_CONFIG.bongsa.icon);
    } 
    else {
      final_hint_icons.push("?");
    }
  }

  gameState.history.push({ guess: guess, hint: final_hint_icons });
  gameState.turns -= 1;
  checkGameOverCondition();
  
  saveGameProgress(); // 턴 차감 및 힌트 히스토리 저장
}