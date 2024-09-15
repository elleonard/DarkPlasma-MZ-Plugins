// DarkPlasma_FixChoiceListPosition 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/09/15 1.0.0 公開
 */

/*:
 * @plugindesc 選択肢の表示位置を固定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command fixChoiceListPosition
 * @text 選択肢の位置固定
 * @desc 選択肢の表示位置を固定します。
 * @arg xPositionType
 * @desc X座標のタイプを指定します。
 * @text X座標タイプ
 * @type select
 * @option 左
 * @value 0
 * @option 中
 * @value 1
 * @option 右
 * @value 2
 * @option 数値指定
 * @value 3
 * @option 固定しない
 * @value 4
 * @default 4
 * @arg x
 * @desc X座標を指定します。X座標タイプが数値指定の場合のみ有効です。
 * @text X座標
 * @type number
 * @default 0
 * @arg yPositionType
 * @desc Y座標のタイプを指定します。上 中 下はメッセージウィンドウの位置を表します。
 * @text Y座標タイプ
 * @type select
 * @option 上
 * @value 0
 * @option 中
 * @value 1
 * @option 下
 * @value 2
 * @option 数値指定
 * @value 3
 * @option 固定しない
 * @value 4
 * @default 2
 * @arg y
 * @desc Y座標を指定します。Y座標タイプが数値指定の場合のみ有効です。
 * @text Y座標
 * @type number
 * @default 0
 *
 * @command unfixChoiceListPosition
 * @text 選択肢の位置固定解除
 * @desc 選択肢の位置固定を解除します。
 *
 * @help
 * version: 1.0.0
 * プラグインコマンドによって選択肢の表示位置を固定します。
 *
 * 位置固定に関する情報はセーブデータに含まれます。
 *
 * Y座標タイプについて
 * 本来、選択肢はメッセージウィンドウの位置に応じてY座標が決まります。
 * メッセージウィンドウの位置 上 中 下に対応する位置に固定する場合に、
 * 上 中 下を選んでください。
 */

(() => {
  'use strict';

  function parseArgs_fixChoiceListPosition(args) {
    return {
      xPositionType: Number(args.xPositionType || 4),
      x: Number(args.x || 0),
      yPositionType: Number(args.yPositionType || 2),
      y: Number(args.y || 0),
    };
  }

  const command_fixChoiceListPosition = 'fixChoiceListPosition';

  const command_unfixChoiceListPosition = 'unfixChoiceListPosition';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const POSITION_TYPE_NUMBER = 3;
  const NO_FIX = 4;
  PluginManager.registerCommand(pluginName, command_fixChoiceListPosition, function (args) {
    const parsedArgs = parseArgs_fixChoiceListPosition(args);
    $gameSystem.fixChoiceListPosition(
      parsedArgs.xPositionType,
      parsedArgs.yPositionType,
      parsedArgs.xPositionType === POSITION_TYPE_NUMBER ? parsedArgs.x : undefined,
      parsedArgs.yPositionType === POSITION_TYPE_NUMBER ? parsedArgs.y : undefined,
    );
  });
  PluginManager.registerCommand(pluginName, command_unfixChoiceListPosition, function () {
    $gameSystem.unfixChoiceListPosition();
  });
  function Game_System_FixChoiceListPositionMixIn(gameSystem) {
    const _initialize = gameSystem.initialize;
    gameSystem.initialize = function () {
      _initialize.call(this);
      this._choiceListPosition = {
        isXFixed: false,
        isYFixed: false,
        xPositionType: 0,
        yPositionType: 0,
        x: undefined,
        y: undefined,
      };
    };
    gameSystem.fixChoiceListPosition = function (xPositionType, yPositionType, x, y) {
      this._choiceListPosition.xPositionType = xPositionType;
      this._choiceListPosition.yPositionType = yPositionType;
      this._choiceListPosition.x = x;
      this._choiceListPosition.y = y;
      this._choiceListPosition.isXFixed = xPositionType !== NO_FIX;
      this._choiceListPosition.isYFixed = yPositionType !== NO_FIX;
    };
    gameSystem.unfixChoiceListPosition = function () {
      this._choiceListPosition.isXFixed = false;
      this._choiceListPosition.isYFixed = false;
    };
    gameSystem.isChoiceListPositionFixed = function () {
      return {
        x: this._choiceListPosition.isXFixed,
        y: this._choiceListPosition.isYFixed,
      };
    };
    gameSystem.choiceListPositionType = function () {
      return {
        x: this._choiceListPosition.xPositionType,
        y: this._choiceListPosition.yPositionType,
      };
    };
    gameSystem.choiceListPosition = function () {
      return {
        x: this._choiceListPosition.x,
        y: this._choiceListPosition.y,
      };
    };
  }
  Game_System_FixChoiceListPositionMixIn(Game_System.prototype);
  function Game_Message_FixChoiceListPositionMixIn(gameMessage) {
    const _choicePositionType = gameMessage.choicePositionType;
    gameMessage.choicePositionType = function () {
      if ($gameSystem.isChoiceListPositionFixed().x) {
        return $gameSystem.choiceListPositionType().x;
      }
      return _choicePositionType.call(this);
    };
  }
  Game_Message_FixChoiceListPositionMixIn(Game_Message.prototype);
  function Window_ChoiceList_FixPositionMixIn(windowChoiceList) {
    const _windowX = windowChoiceList.windowX;
    windowChoiceList.windowX = function () {
      if (
        $gameSystem.isChoiceListPositionFixed().x &&
        $gameSystem.choiceListPositionType().x === POSITION_TYPE_NUMBER
      ) {
        return $gameSystem.choiceListPosition().x;
      }
      return _windowX.call(this);
    };
    const _windowY = windowChoiceList.windowY;
    windowChoiceList.windowY = function () {
      if ($gameSystem.isChoiceListPositionFixed().y) {
        const positionType = $gameSystem.choiceListPositionType().y;
        if (positionType === POSITION_TYPE_NUMBER) {
          return $gameSystem.choiceListPosition().y;
        }
        const messageY = (positionType * (Graphics.boxHeight - this._messageWindow.height)) / 2;
        if (messageY >= Graphics.boxHeight / 2) {
          return messageY - this.windowHeight();
        } else {
          return messageY + this._messageWindow.height;
        }
      }
      return _windowY.call(this);
    };
  }
  Window_ChoiceList_FixPositionMixIn(Window_ChoiceList.prototype);
})();
