// DarkPlasma_AdjustEnemyPosition 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/11/13 1.0.0 公開
 */

/*:ja
 * @plugindesc 敵の座標をUIエリアサイズに合わせて移動する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 敵の配置をUIエリアサイズに合わせて移動します。
 */

(() => {
  'use strict';

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
})();
