/// <reference path="./Scene_MessageMixIn.d.ts" />

import { settings } from "../config/_build/DarkPlasma_Scene_MessageMixIn_parameters";

function Scene_MessageMixIn(sceneClass: Scene_Base) {
  const _create = sceneClass.create;
  sceneClass.create = function () {
    _create.call(this);
    if (this.mustCreateMessageWindow()) {
      this.createMessageWindows();
    }
  };

  sceneClass.mustCreateMessageWindow = function () {
    return true;
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
    this._messageWindow.setAssociatedWindowOptions(this.messageWindowAssociatedGoldWindowOptions());
    this._messageWindowLayer.addChild(this._messageWindow);
  };

  if (!sceneClass.mustKeepGoldWindowY) {
    sceneClass.mustKeepGoldWindowY = function () {
      return this.constructor.name === "Scene_Shop";
    };
  }

  if (!sceneClass.messageWindowAssociatedGoldWindowOptions) {
    sceneClass.messageWindowAssociatedGoldWindowOptions = function () {
      return {
        keepGoldWindowOpen: this.constructor.name === "Scene_Shop",
        keepGoldWindowY: this.mustKeepGoldWindowY(),
      };
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
      if ($gameMessage.isBusy()) {
        if (this.active) {
          this.deactivate();
          this._deactivatedByMessage = true;
        }
      } else if (this._deactivatedByMessage) {
        this.activate();
        this._deactivatedByMessage = false;
      }
    }
    _update.call(this);
  };
}

Window_Selectable_MessageMixIn(Window_Selectable.prototype);

function Window_Message_KeepGoldWindowYMixIn(windowMessage: Window_Message) {
  windowMessage.setMustKeepGoldWindowY = function (mustKeep) {
    this.setAssociatedWindowOptions({ keepGoldWindowY: mustKeep });
  };

  windowMessage.setAssociatedWindowOptions = function (options) {
    if (!this._associatedWindowOptions) {
      this._associatedWindowOptions = this.defaultAssociatedWindowOptions();
    }
    (Object.keys(options) as (keyof Window_Message_AssociatedWindowOptions)[]).forEach(key => {
      this._associatedWindowOptions![key] = options[key];
    });
  };
  
  windowMessage.defaultAssociatedWindowOptions = function () {
    return {};
  };

  windowMessage.associatedWindowOptions = function () {
    if (!this._associatedWindowOptions) {
      this._associatedWindowOptions = this.defaultAssociatedWindowOptions();
    }
    return this._associatedWindowOptions;
  };

  windowMessage.keepGoldWindowOpen = function () {
    return this.associatedWindowOptions().keepGoldWindowOpen || false;
  };

  windowMessage.keepGoldWindowY = function () {
    return this.associatedWindowOptions().keepGoldWindowY || false;
  };

  const _updatePlacement = windowMessage.updatePlacement;
  windowMessage.updatePlacement = function () {
    const goldWindowY = this._goldWindow?.y || 0;
    _updatePlacement.call(this);
    if (this.keepGoldWindowY() && this._goldWindow) {
      this._goldWindow.y = goldWindowY;
    }
  };

  const _terminateMessage = windowMessage.terminateMessage;
  windowMessage.terminateMessage = function () {
    const _close = this._goldWindow.close;
    if (this.keepGoldWindowOpen()) {
      this._goldWindow.close = () => {};
    }
    _terminateMessage.call(this);
    this._goldWindow.close = _close;
  };
}

Window_Message_KeepGoldWindowYMixIn(Window_Message.prototype);

settings.scenes
  .filter(scene => scene in globalThis && scene !== "Scene_Map" && scene !== "Scene_Battle")
  .forEach(scene => Scene_MessageMixIn(window[scene as keyof _Window].prototype));
