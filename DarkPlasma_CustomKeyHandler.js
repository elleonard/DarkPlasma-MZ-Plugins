// DarkPlasma_CustomKeyHandler 1.1.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/01/07 1.1.0 ハンドラ名をキー名とは別に設定可能にする
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
 * version: 1.1.0
 * shiftなどを押した際のハンドラを追加できるようにします。
 *
 * 本プラグインは単体では機能しません。
 * 本プラグインを必要とする別のプラグインと一緒に利用してください。
 *
 * (例) shiftキーハンドラをすべての選択可能ウィンドウにハンドラ名hogeで追加する:
 * Window_CustomKeyHandlerMixIn("shift", Window_Selectable.prototype, "hoge");
 * ハンドラ名は省略するとキー名と同じになります。
 * このウィンドウに対して、 window.setHandler("hoge", method) などとして
 * ハンドラを追加することで、shiftキーでその操作を行わせることができます。
 */

(() => {
  'use strict';

  class CustomKeyMethods {
    /**
     * @param {() => boolean} isTriggered
     * @param {() => void} process
     */
    constructor(isTriggered, process) {
      this._isTriggered = isTriggered;
      this._process = process;
    }

    isTriggered() {
      return this._isTriggered();
    }

    process(self) {
      this._process(self);
    }
  }

  /**
   * @param {string} key キー
   * @param {Window_Base.prototype} windowClass
   * @param {string} handlerName
   */
  function Window_CustomKeyHandlerMixIn(key, windowClass, handlerName) {
    if (!windowClass.customKeyMethods) {
      windowClass.customKeyMethods = [];

      const _processHandling = windowClass.processHandling;
      windowClass.processHandling = function () {
        _processHandling.call(this);
        if (this.isOpenAndActive()) {
          const customKeyMethod = this.customKeyMethods.find((method) => method.isTriggered());
          if (customKeyMethod) {
            return customKeyMethod.process(this);
          }
        }
      };
    }

    windowClass.customKeyMethods.push(
      new CustomKeyMethods(
        () => Input.isTriggered(key),
        (self) => {
          self.playCursorSound();
          self.updateInputData();
          self.callHandler(handlerName || key);
        }
      )
    );
  }

  window.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
})();
