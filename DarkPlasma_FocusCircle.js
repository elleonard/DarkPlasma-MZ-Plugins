// DarkPlasma_FocusCircle 2.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/11/02 2.0.0 フォーカス時に専用のメッセージウィンドウを前面に出す
 *                  楕円系に変更
 * 2025/11/02 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 楕円形フォーカス効果
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param opacity
 * @text フォーカス不透明度
 * @type number
 * @default 200
 *
 * @command FocusOn
 * @text フォーカスする
 * @desc 指定した座標と半径で、楕円形にフォーカスします。
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
 * @arg radiusX
 * @text 半径X
 * @type number
 * @default 0
 * @arg radiusY
 * @text 半径Y
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
 * @arg radiusX
 * @text 半径X
 * @type number
 * @default 0
 * @arg radiusY
 * @text 半径Y
 * @type number
 * @default 0
 *
 * @command ClearAllFocus
 * @text 全てのフォーカスを削除する
 * @desc 全てのフォーカスを削除します。
 *
 * @help
 * version: 2.0.0
 * 楕円形フォーカス効果を実現します。
 *
 * 画面上の特定の楕円形エリアにフォーカスします。
 * フォーカスの状態はセーブデータに含まれません。
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
      radiusX: Number(args.radiusX || 0),
      radiusY: Number(args.radiusY || 0),
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
      radiusX: Number(args.radiusX || 0),
      radiusY: Number(args.radiusY || 0),
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
  function Bitmap_FocusCircleMixIn(bitmap) {
    bitmap.fillGradientEllipse = function (centerX, centerY, radiusX, radiusY, rotation, insideColor, outsideColor) {
      const context = this._context;
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
      gradient.addColorStop(0, insideColor);
      gradient.addColorStop(1, outsideColor);
      context.save();
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(centerX, centerY, radiusX, radiusY, rotation, 0, 2 * Math.PI);
      context.fill();
      context.restore();
      this._baseTexture.update();
    };
  }
  Bitmap_FocusCircleMixIn(Bitmap.prototype);
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
    $gameTemp.moveFocus(parsedArgs);
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
    gameTemp.moveFocus = function (focus) {
      this._focusList
        .filter((f) => f.id === focus.id)
        .forEach((f) => {
          f.x = focus.x;
          f.y = focus.y;
          f.radiusX = focus.radiusX;
          f.radiusY = focus.radiusY;
        });
      this._needsFocusRefresh = true;
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
      if (this._messageWindowLayer) {
        this.addChild(this._focusCircleLayer);
        this.createFocusMessageWindowLayer(this._messageWindowLayer.x, this._messageWindowLayer.y);
      } else if (this._windowLayer && this._messageWindow) {
        this.addChild(this._focusCircleLayer);
        this.createFocusMessageWindowLayer(this._windowLayer.x, this._windowLayer.y);
      } else {
        this.addChild(this._focusCircleLayer);
      }
    };
    sceneBase.createFocusMessageWindowLayer = function (x, y) {
      this._focusMessageWindowLayer = new WindowLayer();
      this._focusMessageWindowLayer.x = x;
      this._focusMessageWindowLayer.y = y;
      const messageWindow = new Window_FocusMessage(this.messageWindowRect());
      const nameBoxWindow = new Window_NameBox();
      messageWindow.setGoldWindow(this._goldWindow);
      messageWindow.setNameBoxWindow(nameBoxWindow);
      messageWindow.setChoiceListWindow(this._choiceListWindow);
      messageWindow.setNumberInputWindow(this._numberInputWindow);
      messageWindow.setEventItemWindow(this._eventItemWindow);
      nameBoxWindow.setMessageWindow(messageWindow);
      this._focusMessageWindowLayer.addChild(messageWindow);
      this._focusMessageWindowLayer.addChild(nameBoxWindow);
      this.addChild(this._focusMessageWindowLayer);
      Window_Message_FocusCircleMixIn(this._messageWindow);
    };
  }
  Scene_Base_FocusCircleMixIn(Scene_Base.prototype);
  function Window_Message_FocusCircleMixIn(windowMessage) {
    const _canStart = windowMessage.canStart;
    windowMessage.canStart = function () {
      return _canStart.call(this) && !$gameTemp.isFocusMode();
    };
    const _updateInput = windowMessage.updateInput;
    windowMessage.updateInput = function () {
      if ($gameTemp.isFocusMode()) {
        return true;
      }
      return _updateInput.call(this);
    };
    const _doesContinues = windowMessage.doesContinue;
    windowMessage.doesContinue = function () {
      return _doesContinues.call(this) && !$gameTemp.isFocusMode();
    };
  }
  class Window_FocusMessage extends Window_Message {
    canStart() {
      return super.canStart() && $gameTemp.isFocusMode();
    }
    update() {
      if (!$gameTemp.isFocusMode()) {
        this.close();
      }
      super.update();
    }
    updateInput() {
      if (!$gameTemp.isFocusMode()) {
        return true;
      }
      return super.updateInput();
    }
    doesContinue() {
      return super.doesContinue() && $gameTemp.isFocusMode();
    }
  }
  class FocusCircleLayer extends Sprite {
    constructor() {
      super();
      this._width = Graphics.width;
      this._height = Graphics.height;
      this.bitmap = new Bitmap(this._width, this._height);
      this.opacity = settings.opacity;
      this.blendMode = 2;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if ($gameTemp.isFocusRefreshRequested()) {
        this.refresh();
        $gameTemp.clearFocusRefreshRequest();
      }
    }
    refresh() {
      this.bitmap?.clear();
      if ($gameTemp.isFocusMode()) {
        this.bitmap?.fillRect(0, 0, this._width, this._height, ColorManager.focusOutsideColor());
        $gameTemp.focusList().forEach((focus) => {
          this.bitmap?.fillGradientEllipse(
            focus.x,
            focus.y,
            focus.radiusX,
            focus.radiusY,
            0,
            ColorManager.focusInsideColor(),
            ColorManager.focusOutsideColor(),
          );
        });
      }
    }
  }
})();
