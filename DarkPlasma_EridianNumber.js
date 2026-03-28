// DarkPlasma_EridianNumber I.ℓ.ℓ
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * IλVI+/ℓλ/++ I.ℓ.ℓ 最初のバージョン
 */

/*:
 * @plugindesc 数字をエリディアン表記にする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: I.ℓ.ℓ
 * 本プラグインは表示文字列に現れる数値を
 * エリディアン表記に変換します。
 *
 * 本プラグインを利用する前に、プロジェクト・ヘイル・メアリーを
 * 第∀ℓ章まで読了していただくことを推奨します。
 */

(() => {
  'use strict';

  const numberMapping = ['ℓ', 'I', 'V', 'λ', '+', '∀'];
  function replaceNumberToEridian(str) {
    return String(str)
      .replaceAll(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replaceAll(/([0-9]+)/gi, (s) => decimalToEridianNumber(Number(s)));
  }
  function decimalToEridianNumber(decimal) {
    return [...decimal.toString(6)].map((c) => numberMapping[Number(c)]).join('');
  }
  function Game_Message_EridianNumberMixIn(gameMessage) {
    const _allText = gameMessage.allText;
    gameMessage.allText = function () {
      return replaceNumberToEridian(_allText.call(this));
    };
  }
  Game_Message_EridianNumberMixIn(Game_Message.prototype);
  function Window_Base_EridianNumberMixIn(windowBase) {
    const _drawText = windowBase.drawText;
    windowBase.drawText = function (text, x, y, maxWidth, align) {
      _drawText.call(this, replaceNumberToEridian(text), x, y, maxWidth, align);
    };
    const _drawTextEx = windowBase.drawTextEx;
    windowBase.drawTextEx = function (text, x, y, width) {
      return _drawTextEx.call(this, replaceNumberToEridian(text), x, y, width);
    };
  }
  Window_Base_EridianNumberMixIn(Window_Base.prototype);
  function Sprite_Gauge_EridianNumberMixIn(spriteGauge) {
    spriteGauge.drawValue = function () {
      const currentValue = this.currentValue();
      const width = this.bitmapWidth();
      const height = this.textHeight();
      this.setupValueFont();
      this.bitmap?.drawText(decimalToEridianNumber(currentValue), 0, 0, width, height, 'right');
    };
  }
  Sprite_Gauge_EridianNumberMixIn(Sprite_Gauge.prototype);
})();
