/// <reference path="./ChangePartyLeader.d.ts" />

import { pluginName } from '../../common/pluginName';
import { command_changeLeader, command_resetLeader, parseArgs_changeLeader } from './_build/DarkPlasma_ChangePartyLeader_commands';

PluginManager.registerCommand(pluginName, command_changeLeader, function(this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_changeLeader(args);
  const actor = $gameActors.actor(parsedArgs.actorId);
  if (!actor || actor.index() === 0) {
    return;
  }
  this._leaderActorIdBeforeChange = $gameParty.leader().actorId();
  $gameParty.swapOrder(0, actor.index());
});

PluginManager.registerCommand(pluginName, command_resetLeader, function(this: Game_Interpreter) {
  const actor = $gameActors.actor(this._leaderActorIdBeforeChange || 0);
  if (actor && actor.index() > 0) {
    $gameParty.swapOrder(0, actor.index());
  }
});
