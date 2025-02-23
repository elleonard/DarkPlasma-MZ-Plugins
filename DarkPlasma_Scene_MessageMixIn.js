// DarkPlasma_Scene_MessageMixIn 1.0.3
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/02/23 1.0.3 ショップシーンに表示するとお金ウィンドウが複製されて位置がズレる不具合を修正
 * 2023/09/21 1.0.2 TextLogと併用するとログウィンドウを閉じることができない不具合を修正
 * 2023/01/18 1.0.1 すでにお金ウィンドウがあるシーンにはお金ウィンドウを再定義しない
 *                  指定シーンを開こうとするとエラーが起きる不具合を修正
 * 2023/01/13 1.0.0 公開
 */

/*:
 * @plugindesc 指定のシーンにメッセージウィンドウを表示させる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param scenes
 * @text シーン
 * @type string[]
 * @default []
 *
 * @help
 * version: 1.0.3
 * パラメータで指定したシーンにメッセージウィンドウを表示できるようになります。
 *
 * $gameMessage.add などでメッセージを追加した際に、
 * そのシーンでもメッセージを表示します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    scenes: JSON.parse(pluginParameters.scenes || '[]').map((e) => {
      return String(e || ``);
    }),
  };

  function Scene_MessageMixIn(sceneClass) {
    const _create = sceneClass.create;
    sceneClass.create = function () {
      _create.call(this);
      this.createMessageWindows();
    };
    sceneClass.isMessageWindowClosing = function () {
      return Scene_Message.prototype.isMessageWindowClosing.call(this);
    };
    sceneClass.createMessageWindows = function () {
      this._messageWindowLayer = new WindowLayer();
      this._messageWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._messageWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._messageWindowLayer);
      this.createMessageWindow();
      if (!this._goldWindow) {
        this.createGoldWindow();
      }
      this.createNameBoxWindow();
      this.createChoiceListWindow();
      this.createNumberInputWindow();
      this.createEventItemWindow();
      this.associateWindows();
    };
    sceneClass.createMessageWindow = function () {
      this._messageWindow = new Window_Message(this.messageWindowRect());
      this._messageWindow.setMustKeepGoldWindowY(this.mustKeepGoldWindowY());
      this._messageWindowLayer.addChild(this._messageWindow);
    };
    if (!sceneClass.mustKeepGoldWindowY) {
      sceneClass.mustKeepGoldWindowY = function () {
        return this.constructor.name === 'Scene_Shop';
      };
    }
    sceneClass.messageWindowRect = function () {
      return Scene_Message.prototype.messageWindowRect.call(this);
    };
    if (!sceneClass.createGoldWindow) {
      sceneClass.createGoldWindow = function () {
        this._goldWindow = new Window_Gold(this.goldWindowRect());
        this._goldWindow.openness = 0;
        this._messageWindowLayer.addChild(this._goldWindow);
      };
      sceneClass.goldWindowRect = function () {
        return Scene_Message.prototype.goldWindowRect.call(this);
      };
    }
    sceneClass.createNameBoxWindow = function () {
      this._nameBoxWindow = new Window_NameBox();
      this._messageWindowLayer.addChild(this._nameBoxWindow);
    };
    sceneClass.createChoiceListWindow = function () {
      this._choiceListWindow = new Window_ChoiceList();
      this._messageWindowLayer.addChild(this._choiceListWindow);
    };
    sceneClass.createNumberInputWindow = function () {
      this._numberInputWindow = new Window_NumberInput();
      this._messageWindowLayer.addChild(this._numberInputWindow);
    };
    sceneClass.createEventItemWindow = function () {
      this._eventItemWindow = new Window_EventItem(this.eventItemWindowRect());
      this._messageWindowLayer.addChild(this._eventItemWindow);
    };
    sceneClass.eventItemWindowRect = function () {
      return Scene_Message.prototype.eventItemWindowRect.call(this);
    };
    sceneClass.associateWindows = function () {
      Scene_Message.prototype.associateWindows.call(this);
    };
    const _isBusy = sceneClass.isBusy;
    sceneClass.isBusy = function () {
      return _isBusy.call(this) || $gameMessage.isBusy();
    };
  }
  function Window_Selectable_MessageMixIn(windowClass) {
    const _isOpenAndActive = windowClass.isOpenAndActive;
    windowClass.isOpenAndActive = function () {
      /**
       * メッセージ表示中は、関連ウィンドウ以外非アクティブ判定とする
       */
      if ($gameMessage.isBusy() && !this.isAssociatedWithMessageWindow()) {
        return false;
      }
      return _isOpenAndActive.call(this);
    };
    windowClass.isAssociatedWithMessageWindow = function () {
      return !!this._messageWindow || this.constructor.name === 'Window_TextLog';
    };
    const _update = windowClass.update;
    windowClass.update = function () {
      /**
       * メッセージウィンドウに関係しないウィンドウのアクティブ状態を制御する
       * メッセージ表示中にアクティブであったら非アクティブ化し、
       * 表示が終了したらアクティブに戻す
       */
      if (!this.isAssociatedWithMessageWindow()) {
        if ($gameMessage.isBusy() && this.active) {
          this.deactivate();
          this._deactivatedByMessage = true;
        } else if (this._deactivatedByMessage) {
          this.activate();
          this._deactivatedByMessage = false;
        }
      }
      _update.call(this);
    };
  }
  Window_Selectable_MessageMixIn(Window_Selectable.prototype);
  function Window_Message_KeepGoldWindowYMixIn(windowMessage) {
    windowMessage.setMustKeepGoldWindowY = function (mustKeep) {
      this._mustKeepGoldWindowY = mustKeep;
    };
    const _updatePlacement = windowMessage.updatePlacement;
    windowMessage.updatePlacement = function () {
      const goldWindowY = this._goldWindow.y;
      _updatePlacement.call(this);
      if (this._mustKeepGoldWindowY) {
        this._goldWindow.y = goldWindowY;
      }
    };
  }
  Window_Message_KeepGoldWindowYMixIn(Window_Message.prototype);
  settings.scenes
    .filter((scene) => scene in globalThis && scene !== 'Scene_Map' && scene !== 'Scene_Battle')
    .forEach((scene) => Scene_MessageMixIn(window[scene].prototype));
})();
