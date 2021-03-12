const _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function () {
  const info = _DataManager_makeSavefileInfo.call(this);
  info.mapName = $gameMap.displayName();
  return info;
};

const _Window_SavefileList_drawContents = Window_SavefileList.prototype.drawContents;
Window_SavefileList.prototype.drawContents = function (info, rect) {
  _Window_SavefileList_drawContents.call(this, info, rect);
  this.drawMapName(info, rect.x, rect.y, rect.width);
};

Window_SavefileList.prototype.drawMapName = function (info, x, y, width) {
  if (info.mapName) {
    this.drawText(info.mapName, x, y, width, 'right');
  }
};
