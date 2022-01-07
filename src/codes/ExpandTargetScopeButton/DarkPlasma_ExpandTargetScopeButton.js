import { Sprite_ToggleButton } from '../../common/sprite/toggleButton';
import { settings } from './_build/DarkPlasma_ExpandTargetScopeButton_parameters';

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_ExpandScopeTargetButtonMixIn(sceneBattle) {
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

/**
 * @param {Window_BattleActor.prototype|Window_BattleEnemy.prototype} windowClass
 */
function Window_BattleTarget_ExpandTargetScopeButtonMixIn(windowClass) {
  const _initialize = windowClass.initialize;
  windowClass.initialize = function (rect) {
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
    if (BattleManager.inputtingAction().canExpandScope()) {
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

Window_BattleTarget_ExpandTargetScopeButtonMixIn(Window_BattleActor.prototype);
Window_BattleTarget_ExpandTargetScopeButtonMixIn(Window_BattleEnemy.prototype);

class Sprite_ExpandTargetScopeButton extends Sprite_ToggleButton {
  scaleXY() {
    return settings.scale / 100;
  }

  positionX() {
    return settings.x;
  }

  positionY() {
    return settings.y;
  }

  onImageName() {
    return settings.allButtonImage;
  }

  offImageName() {
    return settings.singleButtonImage;
  }
}
