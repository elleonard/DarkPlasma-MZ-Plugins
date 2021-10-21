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
  $gameVariables.setValue(
    variableId,
    $gameMap
      .events()
      .filter(
        (gameEvent) =>
          gameEvent.event().meta[tag] &&
          selfSwitches.every(
            (selfSwitch) => $gameSelfSwitches.value(gameEvent.selfSwitchKey(selfSwitch.name)) === selfSwitch.state
          )
      ).length
  );
});

Game_Event.prototype.selfSwitchKey = function (selfSwitchCh) {
  return [this._mapId, this._eventId, selfSwitchCh];
};
