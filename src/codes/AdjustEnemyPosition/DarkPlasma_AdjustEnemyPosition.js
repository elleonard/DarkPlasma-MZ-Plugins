const DEFAULT_WIDTH = 816 - 4 * 2;
const DEFAULT_HEIGHT = 624 - 4 * 2;

const _Game_Enemy_screenX = Game_Enemy.prototype.screenX;
Game_Enemy.prototype.screenX = function () {
  return Math.floor((_Game_Enemy_screenX.call(this) / DEFAULT_WIDTH) * Graphics.boxWidth);
};

const _Game_Enemy_screenY = Game_Enemy.prototype.screenY;
Game_Enemy.prototype.screenY = function () {
  return Math.floor((_Game_Enemy_screenY.call(this) / DEFAULT_HEIGHT) * Graphics.boxHeight);
};
