// DarkPlasma_CustomKeyHandler 1.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/10/10 1.0.0 初版
 */

/*:ja
 * @plugindesc ウィンドウのハンドラにカスタムキーを追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * shiftなどを押した際のハンドラを追加できるようにします。
 *
 * (例) shiftキーハンドラをすべての選択可能ウィンドウに追加する:
 * Window_CustomKeyHandlerMixIn("shift", Window_Selectable.prototype);
 */

(() => {
  'use strict';

  /**
   * @param {string} key キー
   * @param {Window_Base.prototype} windowClass
   */
  function Window_CustomKeyHandlerMixIn(key, windowClass) {
    if (!windowClass.isCustomKeyTriggered) {
      windowClass.isCustomKeyTriggered = [];
      windowClass.processCustomKey = [];
      windowClass.callCustomKeyHandler = [];

      const _processHandling = windowClass.processHandling;
      windowClass.processHandling = function () {
        _processHandling.call(this);
        if (this.isOpenAndActive()) {
          const index = this.isCustomKeyTriggered.findIndex((isTriggered) => isTriggered.call(this));
          if (index >= 0) {
            return this.processCustomKey[index].call(this);
          }
        }
      };
    }

    windowClass.isCustomKeyTriggered.push(function () {
      return Input.isTriggered(key);
    });

    windowClass.processCustomKey.push(function () {
      this.playCursorSound();
      this.updateInputData();
      this.callCustomKeyHandler[windowClass.isCustomKeyTriggered.length - 1].call(this);
    });

    windowClass.callCustomKeyHandler.push(function () {
      this.callHandler(key);
    });
  }

  window.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
})();
