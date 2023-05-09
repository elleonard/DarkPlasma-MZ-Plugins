// DarkPlasma_CustomKeyHandler 1.3.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/09 1.3.0 操作SEの設定を追加
 * 2022/09/10 1.2.2 isCustomKeyEnabledを初回のみ定義するよう修正
 * 2022/08/21 1.2.1 typescript移行
 * 2022/08/16 1.2.0 キー有効チェックの仕組みを追加
 * 2022/01/07 1.1.0 ハンドラ名をキー名とは別に設定可能にする
 * 2021/10/10 1.0.0 初版
 */

/*:
 * @plugindesc ウィンドウのハンドラにカスタムキーを追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.3.0
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
 *
 * 操作SEを変更したい場合、
 * 対象ウィンドウクラスの customKeySound メソッドを定義し、
 * MZ.AudioFile型のオブジェクトを返してください。
 */

(() => {
  'use strict';

  class CustomKeyMethod {
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
    if (!windowClass.isCustomKeyEnabled) {
      windowClass.isCustomKeyEnabled = function (key) {
        return true;
      };
    }
    windowClass.customKeyMethods.push(
      new CustomKeyMethod(
        () => Input.isTriggered(key),
        (self) => {
          self.playCustomKeySound(key);
          self.updateInputData();
          self.callHandler(handlerName || key);
        },
        (self) => self.isCustomKeyEnabled(key)
      )
    );
    windowClass.playCustomKeySound = function (key) {
      const se = this.customKeySound(key);
      if (!se) {
        this.playCursorSound();
      } else {
        AudioManager.playStaticSe(se);
      }
    };
    if (!windowClass.customKeySound) {
      windowClass.customKeySound = function (key) {
        return undefined;
      };
    }
  }
  globalThis.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
})();
