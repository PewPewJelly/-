function drawMapScreen() {
    drawCollectionBox(width - 150, 80);
    for (let b of buildings) {
        fill(200); stroke(150); rect(width * b.x, height * b.y, width * b.w, height * b.h, 5); noStroke();
        fill(50); textAlign(CENTER, CENTER); text(b.name, width * b.x + width * b.w / 2, height * b.y + height * b.h / 2);
    }
}

function drawExplorationOverlay() {
    fill(0, 180); rect(0, 0, width, height);
    fill(255); textSize(30); textAlign(CENTER, CENTER); text("탐색 중 ...", width / 2, height / 2);
    gameState.explorationTimer--;
    if (gameState.explorationTimer <= 0) {
        gameState.isExploring = false;
        executeExploreLogic(gameState.pendingBuildingId);
    }
}