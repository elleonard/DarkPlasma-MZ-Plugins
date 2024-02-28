/// <reference path="./NoseForTreasure.d.ts" />

import { pluginName } from '../../common/pluginName';
import { parseArgs_noseForTreasure } from './_build/DarkPlasma_NoseForTreasure_commands';

const PLUGIN_COMMANDS = {
  NOSE_FOR_TREASURE: 'noseForTreasure',
};

PluginManager.registerCommand(pluginName, PLUGIN_COMMANDS.NOSE_FOR_TREASURE, function (args) {
  const parsedArgs = parseArgs_noseForTreasure(args);
  const targetEvents = $gameMap
    .events()
    .filter(
      (gameEvent) =>
        gameEvent.event().meta[parsedArgs.tag] &&
        parsedArgs.selfSwitches.every(
          (selfSwitch) => $gameSelfSwitches.value(gameEvent.selfSwitchKey(selfSwitch.name)) === selfSwitch.state
        )
    );
  $gameVariables.setValue(parsedArgs.variableId, targetEvents.length);
  if (parsedArgs.balloon) {
    targetEvents.forEach((event) => $gameTemp.requestBalloon(event, parsedArgs.balloon));
  }
});

function Game_Event_NoseForTreasureMixIn(gameEvent: Game_Event) {
  gameEvent.selfSwitchKey = function (selfSwitchCh) {
    return [this._mapId, this._eventId, selfSwitchCh];
  };
}

Game_Event_NoseForTreasureMixIn(Game_Event.prototype);