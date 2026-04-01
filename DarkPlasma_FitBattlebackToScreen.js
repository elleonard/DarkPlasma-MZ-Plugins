// DarkPlasma_FitBattlebackToScreen 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/04/02 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 戦闘背景を画面の大きさに合わせる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 戦闘背景を画面の大きさに合わせて拡大します。
 */

(() => {
  'use strict';

  function Sprite_Battleback_FitToScreenMixIn(spriteBattleback) {
    spriteBattleback.adjustPosition = function () {
      this.width = Graphics.width;
      this.height = Graphics.height;
      const ratioX = this.width / this.bitmap.width;
      const ratioY = this.height / this.bitmap.height;
      const scale = Math.max(ratioX, ratioY, 1.0);
      this.scale.x = scale;
      this.scale.y = scale;
    };
  }
  Sprite_Battleback_FitToScreenMixIn(Sprite_Battleback.prototype);
})();
