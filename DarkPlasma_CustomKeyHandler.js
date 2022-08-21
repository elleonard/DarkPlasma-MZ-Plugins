// DarkPlasma_CustomKeyHandler 1.2.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/21 1.2.1 typescript移行
 * 2022/08/16 1.2.0 キー有効チェックの仕組みを追加
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
 * version: 1.2.1
 * shiftなどを押した際のハンドラを追加できるようにします。
 *
 * 本プラグインは単体では機能しません。
 * 本プラグインを必要とする別のプラグインと一緒に利用してください。
 *
 * 以下、プラグイン開発者向け
 * (例) shiftキーハンドラをすべての選択可能ウィンドウにハンドラ名hogeで追加する:
 * Window_CustomKeyHandlerMixIn("shift", Window_Selectable.prototype, "hoge");
 * ハンドラ名は省略するとキー名と同じになります。
 * このウィンドウに対して、 window.setHandler("hoge", method) などとして
 * ハンドラを追加することで、shiftキーでその操作を行わせることができます。
 *
 * キーの有効状態をチェックしたい場合、
 * 対象ウィンドウクラスの isCustomKeyEnabled メソッドをフックし、
 * keyが"hoge"の際に評価する条件式を記述してください。
 */

(() => {
  'use strict';

  class CustomKeyMethod {
    /**
     * @param {() => boolean} isTriggered
     * @param {(Window_Selectable) => void} process
     * @param {(Window_Selectable) => boolean} isEnabled
     */
    constructor(isTriggered, process, isEnabled) {
      this._isTriggered = isTriggered;
      this._process = process;
      this._isEnabled = isEnabled;
    }
    isTriggered() {
      return this._isTriggered();
    }
    process(self) {
      this._process(self);
    }
    isEnabled(self) {
      return this._isEnabled(self);
    }
  }
  /**
   * @param {string} key キー
   * @param {Window_Selectable.prototype} windowClass
   * @param {?string} handlerName
   */
  function Window_CustomKeyHandlerMixIn(key, windowClass, handlerName) {
    if (!windowClass.customKeyMethods) {
      windowClass.customKeyMethods = [];
      const _processHandling = windowClass.processHandling;
      windowClass.processHandling = function () {
        _processHandling.call(this);
        if (this.isOpenAndActive()) {
          const customKeyMethod = this.customKeyMethods.find((method) => method.isTriggered());
          if (customKeyMethod && customKeyMethod.isEnabled(this)) {
            return customKeyMethod.process(this);
          }
        }
      };
    }
    windowClass.isCustomKeyEnabled = function (key) {
      return true;
    };
    windowClass.customKeyMethods.push(
      new CustomKeyMethod(
        () => Input.isTriggered(key),
        (self) => {
          self.playCursorSound();
          self.updateInputData();
          self.callHandler(handlerName || key);
        },
        (self) => self.isCustomKeyEnabled(key)
      )
    );
  }
  globalThis.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
})();
