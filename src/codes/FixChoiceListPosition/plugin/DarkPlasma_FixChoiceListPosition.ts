/// <reference path="./FixChoiceListPosition.d.ts" />

import { command_fixChoiceListPosition, command_unfixChoiceListPosition, parseArgs_fixChoiceListPosition } from '../config/_build/DarkPlasma_FixChoiceListPosition_commands';
import { pluginName } from '../../../common/pluginName';

const POSITION_TYPE_NUMBER = 3;
const NO_FIX = 4;

PluginManager.registerCommand(pluginName, command_fixChoiceListPosition, function (args) {
  const parsedArgs = parseArgs_fixChoiceListPosition(args);
  $gameSystem.fixChoiceListPosition(
    parsedArgs.xPositionType,
    parsedArgs.yPositionType,
    parsedArgs.xPositionType === POSITION_TYPE_NUMBER ? parsedArgs.x : undefined,
    parsedArgs.yPositionType === POSITION_TYPE_NUMBER ? parsedArgs.y : undefined
  );
});

PluginManager.registerCommand(pluginName, command_unfixChoiceListPosition, function () {
  $gameSystem.unfixChoiceListPosition();
});

function Game_System_FixChoiceListPositionMixIn(gameSystem: Game_System) {
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

function Game_Message_FixChoiceListPositionMixIn(gameMessage: Game_Message) {
  const _choicePositionType = gameMessage.choicePositionType;
  gameMessage.choicePositionType = function () {
    if ($gameSystem.isChoiceListPositionFixed().x) {
      return $gameSystem.choiceListPositionType().x;
    }
    return _choicePositionType.call(this);
  };
}

Game_Message_FixChoiceListPositionMixIn(Game_Message.prototype);

function Window_ChoiceList_FixPositionMixIn(windowChoiceList: Window_ChoiceList) {
  const _windowX = windowChoiceList.windowX;
  windowChoiceList.windowX = function () {
    if ($gameSystem.isChoiceListPositionFixed().x && $gameSystem.choiceListPositionType().x === POSITION_TYPE_NUMBER) {
      return $gameSystem.choiceListPosition().x!;
    }
    return _windowX.call(this);
  };

  const _windowY = windowChoiceList.windowY;
  windowChoiceList.windowY = function () {
    if ($gameSystem.isChoiceListPositionFixed().y) {
      const positionType = $gameSystem.choiceListPositionType().y;
      if (positionType === POSITION_TYPE_NUMBER) {
        return $gameSystem.choiceListPosition().y!;
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