// DarkPlasma_DrawLine 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/06/07 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 直線を描画する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 直線を描画するインターフェースを提供します。
 * 本プラグインは単体では動作しません。
 * 拡張プラグインといっしょに利用してください。
 */

(() => {
  'use strict';

  function Bitmap_DrawLineMixIn(bitmap) {
    bitmap.drawLine = function (x1, y1, x2, y2, thick, color) {
      this._context.strokeStyle = color;
      this._context.lineWidth = thick;
      this._context.beginPath();
      this._context.moveTo(x1, y1);
      this._context.lineTo(x2, y2);
      this._context.closePath();
      this._context.stroke();
      this._context.restore();
      this._baseTexture.update();
    };
  }
  Bitmap_DrawLineMixIn(Bitmap.prototype);
})();
