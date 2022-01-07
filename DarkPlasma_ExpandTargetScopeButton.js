// DarkPlasma_ExpandTargetScopeButton 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/01/07 1.0.1 リファクタ
 * 2022/01/03 1.0.0 公開
 */

/*:ja
 * @plugindesc スキル/アイテムの対象全体化切り替えボタン
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_ExpandTargetScope
 * @orderAfter DarkPlasma_ExpandTargetScope
 *
 * @param allButtonImage
 * @text 全体化ボタン画像
 * @type file
 * @dir img
 *
 * @param singleButtonImage
 * @text 単体化ボタン画像
 * @type file
 * @dir img
 *
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param scale
 * @desc ボタン画像のサイズ倍率（％）
 * @text サイズ倍率
 * @type number
 * @default 100
 *
 * @help
 * version: 1.0.1
 * スキル/アイテムの対象を単体/全体に切り替えるボタンを表示します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_ExpandTargetScope version:1.1.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ExpandTargetScope
 */

(() => {
  'use strict';

  class Sprite_ToggleButton extends Sprite_Clickable {
    initialize(toggleHandler) {
      super.initialize(null);
      this._handler = toggleHandler;
      this.loadButtonImage();
      this.scale.x = this.scaleXY();
      this.scale.y = this.scaleXY();
      this.x = this.positionX();
      this.y = this.positionY();
      this.hide();
    }

    /**
     * @return {number}
     */
    scaleXY() {
      return 1;
    }

    /**
     * @return {number}
     */
    positionX() {
      return 0;
    }

    /**
     * @return {number}
     */
    positionY() {
      return 0;
    }

    /**
     * @return {string}
     */
    onImageName() {
      return '';
    }

    /**
     * @return {string}
     */
    offImageName() {
      return '';
    }

    loadButtonImage() {
      this._onBitmap = ImageManager.loadBitmap('img/', this.onImageName());
      this._offBitmap = ImageManager.loadBitmap('img/', this.offImageName());
      this.bitmap = this._onBitmap;
    }

    onClick() {
      this._handler();
    }

    /**
     * @param {boolean} on
     */
    setImage(on) {
      this.bitmap = on ? this._onBitmap : this._offBitmap;
    }
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    allButtonImage: String(pluginParameters.allButtonImage || ''),
    singleButtonImage: String(pluginParameters.singleButtonImage || ''),
    x: Number(pluginParameters.x || 0),
    y: Number(pluginParameters.y || 0),
    scale: Number(pluginParameters.scale || 100),
  };

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
})();
