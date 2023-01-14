// DarkPlasma_ExpandTargetScopeButton 2.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/01/14 2.0.0 typescript移行
 *                  全体化・単体化ボタンの設定が逆だったのを修正
 *                  メニュー画面でのアイテム/スキル使用時にもボタンを表示する機能追加
 *                  ボタンの座標設定を戦闘/メニューで分離
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
 * @param positionInBattle
 * @text 戦闘画面上の座標
 * @type struct<Point>
 * @default {"x":"0", "y":"0"}
 *
 * @param positionInMenu
 * @text メニュー画面上の座標
 * @type struct<PositionInMenu>
 * @default {"cursorLeft":"{\"x\":\"0\", \"y\":\"0\"}", "cursorRight":"{\"x\":\"500\", \"y\":\"0\"}"}
 *
 * @param scale
 * @desc ボタン画像のサイズ倍率（％）
 * @text サイズ倍率
 * @type number
 * @default 100
 *
 * @help
 * version: 2.0.0
 * スキル/アイテムの対象を単体/全体に切り替えるボタンを表示します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_ExpandTargetScope version:1.4.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ExpandTargetScope
 */
/*~struct~Point:
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 */
/*~struct~PositionInMenu:
 * @param cursorLeft
 * @text カーソル左時の座標
 * @type struct<Point>
 * @default {"x":"0", "y":"0"}
 *
 * @param cursorRight
 * @text カーソル右時の座標
 * @type struct<Point>
 * @default {"x":"500", "y":"0"}
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
      this.bitmap = this._offBitmap;
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

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    allButtonImage: String(pluginParameters.allButtonImage || ''),
    singleButtonImage: String(pluginParameters.singleButtonImage || ''),
    positionInBattle: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        x: Number(parsed.x || 0),
        y: Number(parsed.y || 0),
      };
    })(pluginParameters.positionInBattle || '{"x":"0", "y":"0"}'),
    positionInMenu: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        cursorLeft: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            x: Number(parsed.x || 0),
            y: Number(parsed.y || 0),
          };
        })(parsed.cursorLeft || '{"x":"0", "y":"0"}'),
        cursorRight: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            x: Number(parsed.x || 0),
            y: Number(parsed.y || 0),
          };
        })(parsed.cursorRight || '{"x":"500", "y":"0"}'),
      };
    })(pluginParameters.positionInMenu || '{"cursorLeft":{"x":"0", "y":"0"}, "cursorRight":{"x":"500", "y":"0"}}'),
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
  function Scene_ItemBase_ExpandScopeTargetButtonMixIn(sceneItemBase) {
    const _createActorWindow = sceneItemBase.createActorWindow;
    sceneItemBase.createActorWindow = function () {
      _createActorWindow.call(this);
      this.addChild(this._actorWindow?.expandScopeButton());
    };
    const _showActorWindow = sceneItemBase.showActorWindow;
    sceneItemBase.showActorWindow = function () {
      if (this.isCursorLeft()) {
        this._actorWindow
          ?.expandScopeButton()
          .setPosition(settings.positionInMenu.cursorLeft.x, settings.positionInMenu.cursorLeft.y);
      } else {
        this._actorWindow
          ?.expandScopeButton()
          .setPosition(settings.positionInMenu.cursorRight.x, settings.positionInMenu.cursorRight.y);
      }
      _showActorWindow.call(this);
    };
  }
  Scene_ItemBase_ExpandScopeTargetButtonMixIn(Scene_ItemBase.prototype);
  function Window_ExpandTargetScopeButtonMixIn(windowClass) {
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
    setPosition(x, y) {
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
})();
