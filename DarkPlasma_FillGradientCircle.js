// DarkPlasma_FillGradientCircle 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/11/02 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 円形グラデーション描画機能
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 円形グラーデション描画機能のインターフェースを提供します。
 *
 * 本プラグインは単体では機能しません。
 * 拡張プラグインと合わせて利用してください。
 */

(() => {
  'use strict';

  function Bitmap_FillGradientCircleMixIn(bitmap) {
    bitmap.fillGradientCircle = function (centerX, centerY, radius, insideColor, outsideColor) {
      const context = this._context;
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, insideColor);
      gradient.addColorStop(1, outsideColor);
      context.save();
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fill();
      context.restore();
      this._baseTexture.update();
    };
  }
  Bitmap_FillGradientCircleMixIn(Bitmap.prototype);
})();
