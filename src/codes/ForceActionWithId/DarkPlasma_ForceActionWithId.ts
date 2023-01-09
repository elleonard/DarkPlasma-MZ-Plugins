/// <reference path="./ForceActionWithId.d.ts" />

import { pluginName } from '../../common/pluginName';
import { command_forceActionActorToActor, command_forceActionActorToEnemy, command_forceActionEnemyToActor, command_forceActionEnemyToEnemy, parseArgs_forceActionActorToActor, parseArgs_forceActionActorToEnemy, parseArgs_forceActionEnemyToActor, parseArgs_forceActionEnemyToEnemy } from './_build/DarkPlasma_ForceActionWithId_commands';

PluginManager.registerCommand(pluginName, command_forceActionActorToActor, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_forceActionActorToActor(args);
  this.iterateActorId(
    parsedArgs.subject,
    this.iterateBattlerCallback.bind(
      this,
      parsedArgs.skill,
      $gameActors.actor(parsedArgs.target)?.index() ?? -1
    )
  );
});

PluginManager.registerCommand(pluginName, command_forceActionActorToEnemy, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_forceActionActorToEnemy(args);
  this.iterateActorId(
    parsedArgs.subject,
    this.iterateBattlerCallback.bind(
      this,
      parsedArgs.skill,
      $gameTroop.members().find(enemy => enemy.enemyId() === parsedArgs.target)?.index() ?? -1
    )
  );
});

PluginManager.registerCommand(pluginName, command_forceActionEnemyToActor, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_forceActionEnemyToActor(args);
  const subjectEnemy = $gameTroop.members().find(enemy => enemy.enemyId() === parsedArgs.subject);
  if (parsedArgs.subject > 0 && !subjectEnemy) {
    return;
  }
  this.iterateEnemyIndex(
    parsedArgs.subject === 0 ? -1 : subjectEnemy!.index(),
    this.iterateBattlerCallback.bind(
      this,
      parsedArgs.skill,
      $gameActors.actor(parsedArgs.target)?.index() ?? -1
    )
  );
});

PluginManager.registerCommand(pluginName, command_forceActionEnemyToEnemy, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_forceActionEnemyToEnemy(args);
  const subjectEnemy = $gameTroop.members().find(enemy => enemy.enemyId() === parsedArgs.subject);
  if (parsedArgs.subject > 0 && !subjectEnemy) {
    return;
  }
  this.iterateEnemyIndex(
    parsedArgs.subject === 0 ? -1 : subjectEnemy!.index(),
    this.iterateBattlerCallback.bind(
      this,
      parsedArgs.skill,
      $gameTroop.members().find(enemy => enemy.enemyId() === parsedArgs.target)?.index() ?? -1
    )
  );
});

function Game_Interpreter_ForceActionWithIdMixIn(gameInterpreter: Game_Interpreter) {
  gameInterpreter.iterateBattlerCallback = function (skillId, targetIndex, battler) {
    if (!battler.isDeathStateAffected()) {
      battler.forceAction(skillId, targetIndex);
      BattleManager.forceAction(battler);
      this.setWaitMode("action");
    }
  };
}

Game_Interpreter_ForceActionWithIdMixIn(Game_Interpreter.prototype);
