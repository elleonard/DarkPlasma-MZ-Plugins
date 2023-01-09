// DarkPlasma_ForceActionWithId 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/01/09 1.0.0 公開
 */

/*:ja
 * @plugindesc 主体と対象IDを指定して戦闘行動を強制する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command forceActionEnemyToActor
 * @text 戦闘行動の強制(敵キャラからアクター)
 * @arg subject
 * @text 行動主体
 * @desc 行動主体を設定します。なしの場合、すべての敵が行動します。
 * @type enemy
 * @arg skill
 * @text スキル
 * @type skill
 * @arg target
 * @text 対象
 * @desc 対象を設定します。なしの場合、ランダムな対象を選択します。
 * @type actor
 *
 * @command forceActionActorToEnemy
 * @text 戦闘行動の強制(アクターから敵キャラ)
 * @arg subject
 * @text 行動主体
 * @desc 行動主体を設定します。なしの場合、すべての味方が行動します。
 * @type actor
 * @arg skill
 * @text スキル
 * @type skill
 * @arg target
 * @text 対象
 * @desc 対象を設定します。なしの場合、ランダムな対象を選択します。
 * @type enemy
 *
 * @command forceActionEnemyToEnemy
 * @text 戦闘行動の強制(敵キャラから敵キャラ)
 * @arg subject
 * @text 行動主体
 * @desc 行動主体を設定します。なしの場合、すべての敵が行動します。
 * @type enemy
 * @arg skill
 * @text スキル
 * @type skill
 * @arg target
 * @text 対象
 * @desc 対象を設定します。なしの場合、ランダムな対象を選択します。
 * @type enemy
 *
 * @command forceActionActorToActor
 * @text 戦闘行動の強制(アクターからアクター)
 * @arg subject
 * @text 行動主体
 * @desc 行動主体を設定します。なしの場合、すべての味方が行動します。
 * @type actor
 * @arg skill
 * @text スキル
 * @type skill
 * @arg target
 * @text 対象
 * @desc 対象を設定します。なしの場合、ランダムな対象を選択します。
 * @type actor
 *
 * @help
 * version: 1.0.0
 * 主体及び対象のIDを指定して戦闘行動の強制を行うプラグインコマンドを提供します。
 *
 * 主体が存在しない場合、プラグインコマンドは何もしません。
 * 対象が存在しない場合、対象をランダムに選択します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_forceActionEnemyToActor(args) {
    return {
      subject: Number(args.subject || 0),
      skill: Number(args.skill || 0),
      target: Number(args.target || 0),
    };
  }

  function parseArgs_forceActionActorToEnemy(args) {
    return {
      subject: Number(args.subject || 0),
      skill: Number(args.skill || 0),
      target: Number(args.target || 0),
    };
  }

  function parseArgs_forceActionEnemyToEnemy(args) {
    return {
      subject: Number(args.subject || 0),
      skill: Number(args.skill || 0),
      target: Number(args.target || 0),
    };
  }

  function parseArgs_forceActionActorToActor(args) {
    return {
      subject: Number(args.subject || 0),
      skill: Number(args.skill || 0),
      target: Number(args.target || 0),
    };
  }

  const command_forceActionEnemyToActor = 'forceActionEnemyToActor';

  const command_forceActionActorToEnemy = 'forceActionActorToEnemy';

  const command_forceActionEnemyToEnemy = 'forceActionEnemyToEnemy';

  const command_forceActionActorToActor = 'forceActionActorToActor';

  PluginManager.registerCommand(pluginName, command_forceActionActorToActor, function (args) {
    const parsedArgs = parseArgs_forceActionActorToActor(args);
    this.iterateActorId(
      parsedArgs.subject,
      this.iterateBattlerCallback.bind(this, parsedArgs.skill, $gameActors.actor(parsedArgs.target)?.index() ?? -1)
    );
  });
  PluginManager.registerCommand(pluginName, command_forceActionActorToEnemy, function (args) {
    const parsedArgs = parseArgs_forceActionActorToEnemy(args);
    this.iterateActorId(
      parsedArgs.subject,
      this.iterateBattlerCallback.bind(
        this,
        parsedArgs.skill,
        $gameTroop
          .members()
          .find((enemy) => enemy.enemyId() === parsedArgs.target)
          ?.index() ?? -1
      )
    );
  });
  PluginManager.registerCommand(pluginName, command_forceActionEnemyToActor, function (args) {
    const parsedArgs = parseArgs_forceActionEnemyToActor(args);
    const subjectEnemy = $gameTroop.members().find((enemy) => enemy.enemyId() === parsedArgs.subject);
    if (parsedArgs.subject > 0 && !subjectEnemy) {
      return;
    }
    this.iterateEnemyIndex(
      parsedArgs.subject === 0 ? -1 : subjectEnemy.index(),
      this.iterateBattlerCallback.bind(this, parsedArgs.skill, $gameActors.actor(parsedArgs.target)?.index() ?? -1)
    );
  });
  PluginManager.registerCommand(pluginName, command_forceActionEnemyToEnemy, function (args) {
    const parsedArgs = parseArgs_forceActionEnemyToEnemy(args);
    const subjectEnemy = $gameTroop.members().find((enemy) => enemy.enemyId() === parsedArgs.subject);
    if (parsedArgs.subject > 0 && !subjectEnemy) {
      return;
    }
    this.iterateEnemyIndex(
      parsedArgs.subject === 0 ? -1 : subjectEnemy.index(),
      this.iterateBattlerCallback.bind(
        this,
        parsedArgs.skill,
        $gameTroop
          .members()
          .find((enemy) => enemy.enemyId() === parsedArgs.target)
          ?.index() ?? -1
      )
    );
  });
  function Game_Interpreter_ForceActionWithIdMixIn(gameInterpreter) {
    gameInterpreter.iterateBattlerCallback = function (skillId, targetIndex, battler) {
      if (!battler.isDeathStateAffected()) {
        battler.forceAction(skillId, targetIndex);
        BattleManager.forceAction(battler);
        this.setWaitMode('action');
      }
    };
  }
  Game_Interpreter_ForceActionWithIdMixIn(Game_Interpreter.prototype);
})();
