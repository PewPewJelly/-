function drawTitleScreen() {
  background(30, 144, 255);
  fill(255); textAlign(CENTER, CENTER);
  
  textSize(42); text("숭실 단어 탐험: 진리 수집", width / 2, height / 2 - 160);
  
  // 게임 소개 및 규칙 안내
  textSize(14); fill(230, 245, 255);
  let introText = 
    "게임 방법\n" +
    "1. 캠퍼스 건물을 탐색하여 자소 힌트 아이템을 획득하세요.\n" +
    "2. 학생회관(폰)에서 2글자 단어를 입력해 정답을 추리합니다.\n\n"
  text(introText, width / 2, height / 2 - 30);

  // 버튼 가이드
  stroke(255); strokeWeight(1); noFill();
  rect(width / 2 - 140, height / 2 + 80, 280, 40, 10);
  noStroke(); fill(255); textSize(18);
  text("새 게임 시작", width / 2, height / 2 + 100);
  
  // 저장 데이터가 있을 때만 이어하기 가이드 표시
  if (localStorage.getItem("ssu_word_game_save")) {
    stroke(255); noFill();
    rect(width / 2 - 140, height / 2 + 135, 280, 40, 10);
    noStroke(); fill(255);
    text("이어서 하기", width / 2, height / 2 + 155);
  }
}