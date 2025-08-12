/// <reference path="./ChangeForeground.d.ts" />

import { command_ChangeForeground, command_ClearForeground, parseArgs_ChangeForeground } from '../config/_build/DarkPlasma_ChangeForeground_commands';
import { pluginName } from '../../../common/pluginName';

PluginManager.registerCommand(pluginName, command_ChangeForeground, function (args) {
  $gameMap.setForeground(parseArgs_ChangeForeground(args));
});

PluginManager.registerCommand(pluginName, command_ClearForeground, function () {
  $gameMap.clearForeground();
});

function Game_Map_ChangeForegroundMixIn(gameMap: Game_Map) {
  gameMap.setForeground = function (foreground) {
    this._foregroundDefined = true;
    this._foregroundName = foreground.file;
    this._foregroundZero = ImageManager.isZeroForeground(this._foregroundName);
    this._foregroundLoopX = foreground.loopX;
    this._foregroundLoopY = foreground.loopY;
    this._foregroundSx = foreground.scrollSpeedX;
    this._foregroundSy = foreground.scrollSpeedY;
    this._foregroundX = 0;
    this._foregroundY = 0;
  };

  gameMap.clearForeground = function () {
    this._foregroundName = '';
  };
}

Game_Map_ChangeForegroundMixIn(Game_Map.prototype);
