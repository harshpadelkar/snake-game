export const handleSnakeMove = (boardSize, directionState, head) => {
  switch (directionState) {
    case "down":
      head.y = (head.y - 1 + boardSize) % boardSize;
      break;
    case "up":
      head.y = (head.y + 1) % boardSize;
      break;
    case "right":
      head.x = (head.x - 1 + boardSize) % boardSize;
      break;
    case "left":
      head.x = (head.x + 1) % boardSize;
      break;
    default:
      break;
  }
};
