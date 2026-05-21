
//각 값은 화면 비율로 표현 (0~1 사이) 
//drops 의 값은 해당 건물에서 아이템이 나올 확률 (총합 1이긴 한데 남은 부분이 none이어서 1보다 작을 수도 있음)
let buildings = [
  { id: 1, name: "진리관", x: 0.49, y: 0.25, w: 0.07, h: 0.15, drops: { baekma: 0.15, soongsil: 0.15} },
  { id: 2, name: "한경직", x: 0.52, y: 0.55, w: 0.1, h: 0.2, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 3, name: "대운동장", x: 0.2, y: 0.2, w: 0.2, h: 0.23, drops: { tulip: 0.5} },
  { id: 4, name: "베어드", x: 0.3, y: 0.45, w: 0.15, h: 0.14, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 5, name: "형남공", x: 0.3, y: 0.6, w: 0.15, h: 0.14, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 6, name: "안익태", x: 0.15, y: 0.7, w: 0.12, h: 0.1, drops: { baekma: 0.15, soongsil: 0.15} },
  { id: 7, name: "학생회관", x: 0.41, y: 0.22, w: 0.07, h: 0.2, drops: { tulip: 0.5} },
  { id: 8, name: "미래관", x: 0.67, y: 0.55, w: 0.1, h: 0.1, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 9, name: "중앙도서관", x: 0.69, y: 0.32, w: 0.08, h: 0.16, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 10, name: "조만식", x: 0.57, y: 0.24, w: 0.1  , h: 0.1, drops: { baekma: 0.15, soongsil: 0.15} },
  { id: 11, name: "전산관", x: 0.8, y: 0.55, w: 0.17, h: 0.1, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 12, name: "정보섬", x: 0.77, y: 0.76, w: 0.17, h: 0.2, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 13, name: "경상관", x: 0.07, y: 0.53, w: 0.15, h: 0.12, drops: { shung: 0.25, bongsa: 0.35} },
  { id: 14, name: "문화관", x: 0.03, y: 0.67, w: 0.05, h: 0.16, drops: { baekma: 0.15, soongsil: 0.15} },
  { id: 15, name: "백마관", x: 0.24, y: 0.1, w: 0.16, h: 0.08, drops: { tulip: 0.5} }
];

function processExplore(buildingId) {
  if (gameState.gameOver || gameState.isExploring) return;
  if (gameState.turns <= 0) return;
  gameState.isExploring = true;
  gameState.explorationTimer = 60;
  gameState.pendingBuildingId = buildingId;

}

function executeExploreLogic(buildingId) {
  let building = buildings.find(b => b.id === buildingId);
  if (!building) return;
  gameState.turns -= 1;
  let rand = Math.random(), cumulative = 0, droppedItem = null;
  for (let item in building.drops) {
    cumulative += building.drops[item];
    if (rand < cumulative) {
      if (item !== "none") droppedItem = item;
      break;
    }
  }
  if (droppedItem) gameState.inventory[droppedItem] += 1;
  saveGameProgress(); // 탐색 결과 저장
  checkGameOverCondition();
}