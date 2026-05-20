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
  if (!compareHangulInput(val)) { inputField.value(""); return; }
  determineHintsForItemSystem(val, ANSWER_WORD);
  inputField.value("");
  if (gameState.activeView === "gameOver") updateDOMVisibility();
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
  
  //승리 조건: 두 글자 모두 진리 판정
  if (hint_types[0] === "jinri" && hint_types[1] === "jinri") {
    gameState.gameWon = true;
    gameState.activeView = "gameWin";
    updateDOMVisibility
    gameState.history.push({ guess: guess, hint: ["✨", "✨"] });
    return;
  }

  // --- [수정된 부분] 아이템 소모 및 하위 단계 체크 ---
  for (let type of hint_types) {
    if (type === "jinri") {
      final_hint_icons.push("✨"); 
    } 
    else if (gameState.inventory[type] > 0) {
      // 1. 해당 아이템이 있으면 소모
      gameState.inventory[type] -= 1;
      final_hint_icons.push(HINT_CONFIG[type].icon);
    } 
    else if (type !== "tulip" && gameState.inventory.bongsa > 0) {
      // 2. 해당 아이템이 없는데 목튤립 판정이 아니라면, 봉사 아이템이라도 소모해서 힌트 표시
      gameState.inventory.bongsa -= 1;
      final_hint_icons.push(HINT_CONFIG.bongsa.icon);
    } 
    else {
      // 3. 둘 다 없으면 ? 표시
      final_hint_icons.push("?");
    }
  }

  gameState.history.push({ guess: guess, hint: final_hint_icons });
  gameState.turns -= 1;
  checkGameOverCondition();
}