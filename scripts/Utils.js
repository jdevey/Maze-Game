function isValidCoord(size, x, y) {
  return x >= 0 && y >= 0 && x < size && y < size;
}

function isValidCoord(size, point) {
  return point.x >= 0 && point.y >= 0 && point.x < size && point.y < size;
}
