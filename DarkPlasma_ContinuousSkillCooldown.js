// DarkPlasma_ContinuousSkillCooldown 1.0.2
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/11/23 1.0.2 戦闘終了時に2ターン経過することがある不具合を修正
 * 2022/11/22 1.0.1 戦闘終了時に1ターン経過した扱いとする
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc スキルクールタイムを戦闘後も継続する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SkillCooldown
 * @orderAfter DarkPlasma_SkillCooldown
 *
 * @param decreaseCooldownTurnOnMap
 * @desc ONの場合、マップ上でターン経過した場合にクールタイムのターンカウントを進めます。
 * @text マップ上でクールダウン
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.0.2
 * DarkPlasma_SkillCooldownによるスキルのクールタイムを
 * 戦闘後も継続させます。
 *
 * セーブデータに以下の情報を追加します。
 * - 各アクターのスキルクールタイム情報
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_SkillCooldown version:2.3.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_SkillCooldown
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    decreaseCooldownTurnOnMap: String(pluginParameters.decreaseCooldownTurnOnMap || true) === 'true',
  };

  function SkillCooldownManager_ContinuousSkillCooldownMixIn(manager) {
    const _plusCoodldownTurns = manager.plusCooldownTurns;
    manager.plusCooldownTurns = function (targetBattlers, plus, skills) {
      _plusCoodldownTurns.call(this, targetBattlers, plus, skills);
      targetBattlers.forEach((actor) => actor.updateSkillCooldown());
    };
    const _finishCooldowns = manager.finishCooldowns;
    manager.finishCooldowns = function (targetBattlers, skills) {
      _finishCooldowns.call(this, targetBattlers, skills);
      targetBattlers.forEach((actor) => actor.updateSkillCooldown());
    };
  }
  SkillCooldownManager_ContinuousSkillCooldownMixIn(SkillCooldownManager.prototype);
  function DataManager_ContinuousSkillCooldownMixIn(dataManager) {
    const _setupNewGame = dataManager.setupNewGame;
    dataManager.setupNewGame = function () {
      _setupNewGame.call(this);
      skillCooldownManager.initialize();
    };
  }
  DataManager_ContinuousSkillCooldownMixIn(DataManager);
  function Game_BattlerBase_ContinuousSkillCooldownMixIn(gameBattlerBase) {
    gameBattlerBase.isDuringCooldown = function (skill) {
      return skillCooldownManager.isDuringCooldown(this.skillCooldownId(), skill, this.isActor());
    };
  }
  Game_BattlerBase_ContinuousSkillCooldownMixIn(Game_BattlerBase.prototype);
  function Game_Battler_ContinuousSkillCooldownMixIn(gameBattler) {
    const _onBattleEnd = gameBattler.onBattleEnd;
    gameBattler.onBattleEnd = function () {
      _onBattleEnd.call(this);
      /**
       * CT開始ターンには、継続ターンは設定+1となっている(ターン終了時に1ターン経過するため)
       * 統一的に扱うため、戦闘終了時には1ターン経過した扱いとする
       */
      skillCooldownManager.decreaseCooldownTurns(this.skillCooldownId(), this.isActor());
      this.updateSkillCooldown();
    };
    gameBattler.updateSkillCooldown = function () {};
    const _onTurnEnd = gameBattler.onTurnEnd;
    gameBattler.onTurnEnd = function () {
      _onTurnEnd.call(this);
      if (this.isActor() && settings.decreaseCooldownTurnOnMap && !$gameParty.inBattle()) {
        skillCooldownManager.decreaseCooldownTurns(this.skillCooldownId(), this.isActor());
        this.updateSkillCooldown();
      }
    };
  }
  Game_Battler_ContinuousSkillCooldownMixIn(Game_Battler.prototype);
  function Game_Actor_ContinuousSkillCooldownMixIn(gameActor) {
    const _setup = gameActor.setup;
    gameActor.setup = function (actorId) {
      _setup.call(this, actorId);
      this._skillCooldowns = [];
      skillCooldownManager.initialize();
    };
    gameActor.initialSkillCooldowns = function () {
      const result = [];
      (this._skillCooldowns || []).forEach((cooldown) => (result[cooldown.skillId] = cooldown));
      return result;
    };
    gameActor.updateSkillCooldown = function () {
      this._skillCooldowns = skillCooldownManager
        .actorsCooldowns(this.skillCooldownId())
        .filter((cooldown) => cooldown);
    };
  }
  Game_Actor_ContinuousSkillCooldownMixIn(Game_Actor.prototype);
  function Game_Party_ContinuousSkillCooldownMixIn(gameParty) {
    const _addActor = gameParty.addActor;
    gameParty.addActor = function (actorId) {
      _addActor.call(this, actorId);
      skillCooldownManager.initialize();
    };
    const _removeActor = gameParty.removeActor;
    gameParty.removeActor = function (actorId) {
      _removeActor.call(this, actorId);
      /**
       * 戦闘中にパーティを抜けた場合、その時点のクールタイムを反映しておく
       */
      $gameActors.actor(actorId)?.updateSkillCooldown();
    };
  }
  Game_Party_ContinuousSkillCooldownMixIn(Game_Party.prototype);
  function Game_System_ContinuousSkillCooldownMixIn(gameSystem) {
    const _onAfterLoad = gameSystem.onAfterLoad;
    gameSystem.onAfterLoad = function () {
      _onAfterLoad.call(this);
      skillCooldownManager.initialize();
    };
  }
  Game_System_ContinuousSkillCooldownMixIn(Game_System.prototype);
})();
