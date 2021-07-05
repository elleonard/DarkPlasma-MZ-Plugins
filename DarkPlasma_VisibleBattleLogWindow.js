// DarkPlasma_VisibleBattleLogWindow 1.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/09/18 1.0.0 公開
 */

/*:ja
 * @plugindesc バトルログウィンドウに縁をつける
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.2
 * バトルログウィンドウに縁をつけます。
 */

(() => {
  'use strict';

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
})();
