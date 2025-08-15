/// <reference path="./IsInLights.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_isInLights, parseArgs_isInLights } from '../config/_build/DarkPlasma_IsInLights_commands';

PluginManager.registerCommand(pluginName, command_isInLights, function(this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_isInLights(args);
  const target = (() => {
    switch (parsedArgs.target) {
      case "player":
        return $gamePlayer;
      case "thisEvent":
        return this.character(0);
      case "otherEvent":
        return this.character(parsedArgs.eventId);
      default:
        return null;
    }
  })();
  $gameSwitches.setValue(parsedArgs.switchId, target?.isInLights() || false);
});

function Game_Map_IsInLightsMixIn(gameMap: Game_Map) {
  gameMap.crowFlyDistance = function (x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(this.deltaX(x1, x2), 2) + Math.pow(this.deltaY(y1, y2), 2));
  };
}

Game_Map_IsInLightsMixIn(Game_Map.prototype);

function Game_CharacterBase_IsInLightsMixIn(gameCharacterBase: Game_CharacterBase) {
  gameCharacterBase.isInLights = function () {
    return $gameMap.isDark() && $gameMap.lightEvents().some(event => event.lightCovers(this.x, this.y));
  };

  gameCharacterBase.lightCovers = function (x, y) {
    return this.isLightOn() && $gameMap.crowFlyDistance(this.x, x, this.y, y) * $gameMap.tileWidth() < this.lightRadius();
  };
}

Game_CharacterBase_IsInLightsMixIn(Game_CharacterBase.prototype);
