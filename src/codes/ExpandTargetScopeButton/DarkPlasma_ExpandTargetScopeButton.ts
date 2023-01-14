/// <reference path="./ExpandTargetScopeButton.d.ts" />

import { Sprite_ToggleButton } from '../../common/sprite/toggleButton';
import { settings } from './_build/DarkPlasma_ExpandTargetScopeButton_parameters';

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_ExpandScopeTargetButtonMixIn(sceneBattle: Scene_Battle) {
  const _createActorWindow = sceneBattle.createActorWindow;
  sceneBattle.createActorWindow = function () {
    _createActorWindow.call(this);
    this.addChild(this._actorWindow.expandScopeButton());
  };

  const _createEnemyWindow = sceneBattle.createEnemyWindow;
  sceneBattle.createEnemyWindow = function () {
    _createEnemyWindow.call(this);
    this.addChild(this._enemyWindow.expandScopeButton());
  };
}

Scene_Battle_ExpandScopeTargetButtonMixIn(Scene_Battle.prototype);

function Scene_ItemBase_ExpandScopeTargetButtonMixIn(sceneItemBase: Scene_ItemBase) {
  const _createActorWindow = sceneItemBase.createActorWindow;
  sceneItemBase.createActorWindow = function () {
    _createActorWindow.call(this);
    this.addChild(this._actorWindow?.expandScopeButton());
  };

  const _showActorWindow = sceneItemBase.showActorWindow;
  sceneItemBase.showActorWindow = function () {
    if (this.isCursorLeft()) {
      this._actorWindow?.expandScopeButton().setPosition(
        settings.positionInMenu.cursorLeft.x,
        settings.positionInMenu.cursorLeft.y
      );
    } else {
      this._actorWindow?.expandScopeButton().setPosition(
        settings.positionInMenu.cursorRight.x,
        settings.positionInMenu.cursorRight.y
      );
    }
    _showActorWindow.call(this);
  };
}

Scene_ItemBase_ExpandScopeTargetButtonMixIn(Scene_ItemBase.prototype);

function Window_ExpandTargetScopeButtonMixIn(windowClass: Window_BattleActor|Window_BattleEnemy|Window_MenuActor) {
  const _initialize = windowClass.initialize;
  windowClass.initialize = function (rect: Rectangle) {
    _initialize.call(this, rect);
    this._expandScopeButton = new Sprite_ExpandTargetScopeButton(this.toggleCursorAll.bind(this));
  };

  windowClass.expandScopeButton = function () {
    return this._expandScopeButton;
  };

  const _setCursorAll = windowClass.setCursorAll;
  windowClass.setCursorAll = function (cursorAll) {
    _setCursorAll.call(this, cursorAll);
    this._expandScopeButton.setImage(this._cursorAll);
  };

  const _show = windowClass.show;
  windowClass.show = function () {
    _show.call(this);
    if (this.canToggleScope()) {
      this.showExpandScopeButton();
    }
  };

  const _hide = windowClass.hide;
  windowClass.hide = function () {
    _hide.call(this);
    this.hideExpandScopeButton();
  };

  windowClass.showExpandScopeButton = function () {
    this._expandScopeButton.show();
  };

  windowClass.hideExpandScopeButton = function () {
    if (this._expandScopeButton) {
      this._expandScopeButton.hide();
    }
  };
}

Window_ExpandTargetScopeButtonMixIn(Window_BattleActor.prototype);
Window_ExpandTargetScopeButtonMixIn(Window_BattleEnemy.prototype);
Window_ExpandTargetScopeButtonMixIn(Window_MenuActor.prototype);

class Sprite_ExpandTargetScopeButton extends Sprite_ToggleButton {
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  scaleXY() {
    return settings.scale / 100;
  }

  /**
   * デフォルトは戦闘画面上のポジションとする
   */
  positionX() {
    return settings.positionInBattle.x;
  }

  positionY() {
    return settings.positionInBattle.y;
  }

  onImageName() {
    return settings.singleButtonImage;
  }

  offImageName() {
    return settings.allButtonImage;
  }
}
