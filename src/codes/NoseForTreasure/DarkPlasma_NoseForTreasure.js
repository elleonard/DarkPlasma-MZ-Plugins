import { pluginName } from '../../common/pluginName';

const PLUGIN_COMMANDS = {
  NOSE_FOR_TREASURE: 'noseForTreasure',
};

PluginManager.registerCommand(pluginName, PLUGIN_COMMANDS.NOSE_FOR_TREASURE, function (args) {
  const tag = String(args.tag);
  const variableId = Number(args.variableId);
  const selfSwitches = JSON.parse(args.selfSwitches).map((e) => {
    const parsed = JSON.parse(e);
    return {
      name: String(parsed.name),
      state: String(parsed.state) === 'true',
    };
  });
  const targetEvents = $gameMap
    .events()
    .filter(
      (gameEvent) =>
        gameEvent.event().meta[tag] &&
        selfSwitches.every(
          (selfSwitch) => $gameSelfSwitches.value(gameEvent.selfSwitchKey(selfSwitch.name)) === selfSwitch.state
        )
    );
  $gameVariables.setValue(variableId, targetEvents.length);
  const balloon = Number(args.balloon);
  if (balloon) {
    targetEvents.forEach((event) => $gameTemp.requestBalloon(event, balloon));
  }
});

Game_Event.prototype.selfSwitchKey = function (selfSwitchCh) {
  return [this._mapId, this._eventId, selfSwitchCh];
};
