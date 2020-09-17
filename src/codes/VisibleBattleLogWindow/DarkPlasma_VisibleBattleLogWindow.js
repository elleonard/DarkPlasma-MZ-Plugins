Scene_Battle.prototype.updateLogWindowHeight = function () {
  this._logWindow.height = this.calcWindowHeight(this._logWindow.textLineCount(), false);
};

Scene_Battle.prototype.updateLogWindowVisibility = function () {
  this.updateLogWindowHeight();
  this._logWindow.visible = this._logWindow.hasText();
};

const _Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
Window_BattleLog.prototype.initialize = function (rect) {
  _Window_BattleLog_initialize.call(this, rect);
  this.opacity = 255;
  this.hide();
};

Window_BattleLog.prototype.textLineCount = function () {
  return this._lines.length;
};

Window_BattleLog.prototype.hasText = function () {
  return this._lines.length > 0;
};
