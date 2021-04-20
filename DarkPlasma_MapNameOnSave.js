// DarkPlasma_MapNameOnSave 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/03/13 1.0.0 公開
 */

/*:ja
 * @plugindesc セーブ・ロード画面にマップ名を表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * セーブ・ロード画面にマップ名を表示します。
 */

(() => {
  'use strict';

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
})();