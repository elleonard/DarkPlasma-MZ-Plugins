// DarkPlasma_FocusCircle 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/11/02 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 円形フォーカス効果
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_FillGradientCircle
 *
 * @param opacity
 * @text フォーカス不透明度
 * @type number
 * @default 200
 *
 * @command FocusOn
 * @text フォーカスする
 * @desc 指定した座標と半径で、円形にフォーカスします。
 * @arg id
 * @text フォーカスID
 * @type number
 * @default 0
 * @arg x
 * @text X座標
 * @type number
 * @default 0
 * @arg y
 * @text Y座標
 * @type number
 * @default 0
 * @arg radius
 * @text 半径
 * @type number
 * @default 0
 *
 * @command FocusOff
 * @text フォーカスを削除する
 * @desc 指定したIDのフォーカスを削除します。
 * @arg id
 * @text フォーカスID
 * @type number
 * @default 0
 *
 * @command MoveFocus
 * @text フォーカスを移動する
 * @desc 指定したIDのフォーカスを移動します。
 * @arg id
 * @text フォーカスID
 * @type number
 * @default 0
 * @arg x
 * @text 移動先X座標
 * @type number
 * @default 0
 * @arg y
 * @text 移動先Y座標
 * @type number
 * @default 0
 * @arg radius
 * @text 半径
 * @type number
 * @default 0
 *
 * @command ClearAllFocus
 * @text 全てのフォーカスを削除する
 * @desc 全てのフォーカスを削除します。
 *
 * @help
 * version: 1.0.0
 * 円形フォーカス効果を実現します。
 *
 * 画面上の特定の円形エリアのみフォーカスします。
 * フォーカスの状態はセーブデータに含まれません。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_FillGradientCircle version:1.0.0
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_FocusOn(args) {
    return {
      id: Number(args.id || 0),
      x: Number(args.x || 0),
      y: Number(args.y || 0),
      radius: Number(args.radius || 0),
    };
  }

  function parseArgs_FocusOff(args) {
    return {
      id: Number(args.id || 0),
    };
  }

  function parseArgs_MoveFocus(args) {
    return {
      id: Number(args.id || 0),
      x: Number(args.x || 0),
      y: Number(args.y || 0),
      radius: Number(args.radius || 0),
    };
  }

  const command_FocusOn = 'FocusOn';

  const command_FocusOff = 'FocusOff';

  const command_MoveFocus = 'MoveFocus';

  const command_ClearAllFocus = 'ClearAllFocus';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    opacity: Number(pluginParameters.opacity || 200),
  };

  function convertColor(color) {
    return `#${((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue).toString(16).slice(1)}`;
  }
  PluginManager.registerCommand(pluginName, command_FocusOn, function (args) {
    const parsedArgs = parseArgs_FocusOn(args);
    $gameTemp.focusOn(parsedArgs);
  });
  PluginManager.registerCommand(pluginName, command_FocusOff, function (args) {
    const parsedArgs = parseArgs_FocusOff(args);
    $gameTemp.focusOff(parsedArgs.id);
  });
  PluginManager.registerCommand(pluginName, command_MoveFocus, function (args) {
    const parsedArgs = parseArgs_MoveFocus(args);
    $gameTemp.moveFocus(parsedArgs.id, parsedArgs.x, parsedArgs.y, parsedArgs.radius);
  });
  PluginManager.registerCommand(pluginName, command_ClearAllFocus, function () {
    $gameTemp.clearAllFocus();
  });
  function ColorManager_FocusCircleMixIn(colorManager) {
    colorManager.focusInsideColor = function () {
      return convertColor({
        red: 255,
        green: 255,
        blue: 255,
      });
    };
    colorManager.focusOutsideColor = function () {
      return convertColor({
        red: 0,
        green: 0,
        blue: 0,
      });
    };
  }
  ColorManager_FocusCircleMixIn(ColorManager);
  function SceneManager_FocusCircleMixIn(sceneManager) {
    const _onBeforeSceneStart = sceneManager.onBeforeSceneStart;
    sceneManager.onBeforeSceneStart = function () {
      _onBeforeSceneStart.call(this);
      this._scene?.createFocusCircleLayer();
    };
  }
  SceneManager_FocusCircleMixIn(SceneManager);
  function Game_Temp_FocusCircleMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._focusList = [];
      this._needsFocusRefresh = false;
    };
    gameTemp.isFocusRefreshRequested = function () {
      return this._needsFocusRefresh;
    };
    gameTemp.clearFocusRefreshRequest = function () {
      this._needsFocusRefresh = false;
    };
    gameTemp.isFocusMode = function () {
      return this.focusList().length > 0;
    };
    gameTemp.focusList = function () {
      return this._focusList;
    };
    gameTemp.focusOn = function (focus) {
      this._focusList.push(focus);
      this._needsFocusRefresh = true;
    };
    gameTemp.focusOff = function (focusId) {
      this._focusList = this._focusList.filter((f) => f.id !== focusId);
      this._needsFocusRefresh = true;
    };
    gameTemp.moveFocus = function (focusId, x, y, radius) {
      this._focusList
        .filter((focus) => focus.id === focusId)
        .forEach((focus) => {
          focus.x = x;
          focus.y = y;
          focus.radius = radius;
        });
    };
    gameTemp.clearAllFocus = function () {
      this._focusList = [];
      this._needsFocusRefresh = true;
    };
  }
  Game_Temp_FocusCircleMixIn(Game_Temp.prototype);
  function Scene_Base_FocusCircleMixIn(sceneBase) {
    sceneBase.createFocusCircleLayer = function () {
      this._focusCircleLayer = new FocusCircleLayer();
      this.addChild(this._focusCircleLayer);
    };
  }
  Scene_Base_FocusCircleMixIn(Scene_Base.prototype);
  class FocusCircleLayer extends PIXI.Container {
    constructor() {
      super();
      this._width = Graphics.width;
      this._height = Graphics.height;
      this._bitmap = new Bitmap(this._width, this._height);
      this.createSprite();
    }
    createSprite() {
      const sprite = new Sprite(null);
      sprite.bitmap = this._bitmap;
      sprite.opacity = settings.opacity;
      sprite.blendMode = 2;
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    }
    update() {
      if ($gameTemp.isFocusRefreshRequested()) {
        this.refresh();
        $gameTemp.clearFocusRefreshRequest();
      }
    }
    refresh() {
      this._bitmap.clear();
      if ($gameTemp.isFocusMode()) {
        this._bitmap.fillRect(0, 0, this._width, this._height, ColorManager.focusOutsideColor());
        $gameTemp.focusList().forEach((focus) => {
          this._bitmap.fillGradientCircle(
            focus.x,
            focus.y,
            focus.radius,
            ColorManager.focusInsideColor(),
            ColorManager.focusOutsideColor(),
          );
        });
      }
    }
  }
})();
