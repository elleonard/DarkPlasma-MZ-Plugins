/// <reference path="./Scene_MessageMixIn.d.ts" />

import { settings } from "./_build/DarkPlasma_Scene_MessageMixIn_parameters";

function Scene_MessageMixIn(sceneClass: Scene_Base) {
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
    this.createGoldWindow();
    this.createNameBoxWindow();
    this.createChoiceListWindow();
    this.createNumberInputWindow();
    this.createEventItemWindow();
    this.associateWindows();
  };

  sceneClass.createMessageWindow = function () {
    this._messageWindow = new Window_Message(this.messageWindowRect());
    this._messageWindowLayer.addChild(this._messageWindow);
  };

  sceneClass.messageWindowRect = function () {
    return Scene_Message.prototype.messageWindowRect.call(this);
  };

  sceneClass.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(this.goldWindowRect());
    this._goldWindow.openness = 0;
    this._messageWindowLayer.addChild(this._goldWindow);
  };

  sceneClass.goldWindowRect = function () {
    return Scene_Message.prototype.goldWindowRect.call(this);
  };

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

  sceneClass.associateWindows = function () {
    Scene_Message.prototype.associateWindows.call(this);
  };

  const _isBusy = sceneClass.isBusy;
  sceneClass.isBusy = function () {
    return _isBusy.call(this) || $gameMessage.isBusy();
  };
}

function Window_Selectable_MessageMixIn(windowClass: Window_Selectable) {
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
    return !!this._messageWindow;
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

settings.scenes
  .filter(scene => scene in globalThis && scene !== "Scene_Map" && scene !== "Scene_Battle")
  .forEach(scene => Scene_MessageMixIn(window[scene as keyof _Window].prototype));
