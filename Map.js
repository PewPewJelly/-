function drawMapScreen() {
    drawCollectionBox(width - 150, 80);
    for (let b of buildings) {
        fill(200); stroke(150); rect(width * b.x, height * b.y, width * b.w, height * b.h, 5); noStroke();
        fill(50); textAlign(CENTER, CENTER); text(b.name, width * b.x + width * b.w / 2, height * b.y + height * b.h / 2);
    }
}

function drawExplorationOverlay() {
    // 반투명 오버레이
    fill(0, 180); rect(0, 0, width, height);
    fill(255); textSize(30); textAlign(CENTER, CENTER); text("탐색 중 ...", width / 2, height / 2 - 140);

    // 바(미니게임) 영역
    let barW = width * 0.6, barH = 24;
    let barX = width / 2 - barW / 2, barY = height / 2 - 20;
    // 바 배경
    fill(80); rect(barX, barY, barW, barH, 6);

    // 타깃 영역 그리기
    let tStart = barX + gameState.explorationTargetStart * barW;
    let tW = gameState.explorationTargetWidth * barW;
    noStroke(); fill(60, 200, 120, 180); rect(tStart, barY, tW, barH, 6);

    // 이동 바 위치 업데이트 및 그리기
    gameState.explorationBarPos += gameState.explorationBarSpeed;
    if (gameState.explorationBarPos > 1) {
        gameState.explorationBarPos = 1; gameState.explorationBarSpeed *= -1;
    } else if (gameState.explorationBarPos < 0) {
        gameState.explorationBarPos = 0; gameState.explorationBarSpeed *= -1;
    }
    let handleX = barX + gameState.explorationBarPos * barW;
    fill(240, 200, 60); rect(handleX - 6, barY - 6, 12, barH + 12, 6);

    // 안내 텍스트
    fill(255); textSize(14); textAlign(CENTER, CENTER);
    text("스페이스바로 타이밍을 맞춰 아이템 획득 확률을 올리세요!", width / 2, barY - 30);

    // 타이머 감소 및 완료 처리
    gameState.explorationTimer--;
    if (gameState.explorationTimer <= 0 && !gameState.explorationPressed) {
        // 타임아웃 시 정확도 0으로 탐색 실행
        gameState.isExploring = false;
        executeExploreLogic(gameState.pendingBuildingId, 0);
    }
}

function drawExplorationResultOverlay() {
    if (!gameState.explorationResultLabel) return;
    fill(0, 180); rect(0, 0, width, height);
    fill(255); textSize(32); textAlign(CENTER, CENTER);
    text("탐색 결과", width / 2, height / 2 - 40);
    textSize(24); fill(220, 240, 180);
    text(gameState.explorationResultLabel, width / 2, height / 2 + 20);

    gameState.explorationResultTimer--;
    if (gameState.explorationResultTimer <= 0) {
        gameState.explorationResultLabel = null;
    }
}