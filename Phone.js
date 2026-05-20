function drawPhoneScreen() {
  drawCollectionBox(width - 150, 80);
  let pW = 280, pH = 500;
  let pX = width/2 - pW/2, pY = 80;
  fill(220); stroke(100); rect(pX, pY, pW, pH, 20); noStroke();
  fill(50); rect(pX + 20, pY + 50, pW - 40, pH - 100, 5);
  fill(150); rect(pX, pY, pW, 40, 20, 20, 0, 0);
  fill(50); textSize(14); textAlign(LEFT, CENTER); text("🔙 지도로 돌아가기", pX + 15, pY + 20);
  fill(255); textAlign(LEFT, TOP); textSize(14);
  let histY = pY + 60;
  for (let entry of gameState.history.slice(-15)) {
    text(`${entry.guess} - ${entry.hint[0]} ${entry.hint[1]}`, pX + 30, histY);
    histY += 25;
  }
}