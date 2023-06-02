// DarkPlasma_SetColorByCode 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/06/02 1.0.0 公開
 */

/*:
 * @plugindesc 制御文字による色指定を#から始まるカラーコードで行う
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 制御文字\Cによる色指定を、#から始まるカラーコードで行えるようにします。
 *
 * 例: \C[#adff2f]
 * 黄緑色になります。
 */

(() => {
  'use strict';

  function Window_ObtainEscapeParamTextMixIn(windowClass) {
    windowClass.obtainEscapeParamText = function (textState) {
      const arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
      if (arr) {
        textState.index += arr[0].length;
        return arr[1];
      } else {
        return '';
      }
    };
  }

  Window_ObtainEscapeParamTextMixIn(Window_Base.prototype);
  function Window_SetColorByCodeMixIn(windowClass) {
    windowClass.processEscapeCharacter = function (code, textState) {
      if (code === 'C') {
        const color = this.obtainEscapeParamText(textState);
        if (color.startsWith('#')) {
          this.changeTextColor(color);
        } else {
          this.processColorChange(Number(color));
        }
      }
    };
  }
  Window_SetColorByCodeMixIn(Window_Base.prototype);
})();
