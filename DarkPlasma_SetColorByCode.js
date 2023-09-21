// DarkPlasma_SetColorByCode 1.0.2
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/09/21 1.0.2 TextLogと併用するとエラーになる不具合を修正
 * 2023/06/29 1.0.1 色変更以外の制御文字を握り潰してしまう不具合を修正
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
 * version: 1.0.2
 * 制御文字\Cによる色指定を、#から始まるカラーコードで行えるようにします。
 *
 * 例: \C[#adff2f]
 * 黄緑色になります。
 */

(() => {
  'use strict';

  function Window_ObtainEscapeParamTextMixIn(windowClass) {
    /**
     * [YYY]のYYYを取り出し、カンマ区切りで配列化して返す
     */
    windowClass.obtainEscapeParamText = function (textState) {
      const arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
      if (arr) {
        textState.index += arr[0].length;
        return arr[1].split(',');
      } else {
        return [];
      }
    };
  }

  Window_ObtainEscapeParamTextMixIn(Window_Base.prototype);
  function Window_SetColorByCodeMixIn(windowClass) {
    const _processEscapeCharacter = windowClass.processEscapeCharacter;
    windowClass.processEscapeCharacter = function (code, textState) {
      if (code === 'C') {
        const color = this.obtainEscapeParamText(textState)[0];
        if (color.startsWith('#')) {
          this.changeTextColor(color);
        } else {
          this.processColorChange(Number(color));
        }
      } else {
        _processEscapeCharacter.call(this, code, textState);
      }
    };
  }
  Window_SetColorByCodeMixIn(Window_Base.prototype);
})();
