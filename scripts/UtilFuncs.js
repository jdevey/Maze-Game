'use strict';

function isValidCoord(size, point) {
  return point.x >= 0 && point.y >= 0 && point.x < size && point.y < size;
}
