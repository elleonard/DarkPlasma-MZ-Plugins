/// <reference path="./ContinuousSkillCooldown.d.ts" />

import { settings } from "./_build/DarkPlasma_ContinuousSkillCooldown_parameters";

function SkillCooldownManager_ContinuousSkillCooldownMixIn(manager: SkillCooldownManager) {
  const _plusCoodldownTurns = manager.plusCooldownTurns;
  manager.plusCooldownTurns = function (targetBattlers: Game_Battler[], plus: number, skills?: MZ.Skill[]) {
    _plusCoodldownTurns.call(this, targetBattlers, plus, skills);
    targetBattlers.forEach(actor => actor.updateSkillCooldown());
  };

  const _finishCooldowns = manager.finishCooldowns;
  manager.finishCooldowns = function (targetBattlers: Game_Battler[], skills?: MZ.Skill[]) {
    _finishCooldowns.call(this, targetBattlers, skills);
    targetBattlers.forEach(actor => actor.updateSkillCooldown());
  };
}

SkillCooldownManager_ContinuousSkillCooldownMixIn(SkillCooldownManager.prototype);

function DataManager_ContinuousSkillCooldownMixIn(dataManager: typeof DataManager) {
  const _setupNewGame = dataManager.setupNewGame;
  dataManager.setupNewGame = function () {
    _setupNewGame.call(this);
    skillCooldownManager.initialize();
  };
}

DataManager_ContinuousSkillCooldownMixIn(DataManager);

function Game_BattlerBase_ContinuousSkillCooldownMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.isDuringCooldown = function (skill) {
    return skillCooldownManager.isDuringCooldown(this.skillCooldownId(), skill, this.isActor());
  };
}

Game_BattlerBase_ContinuousSkillCooldownMixIn(Game_BattlerBase.prototype);

function Game_Battler_ContinuousSkillCooldownMixIn(gameBattler: Game_Battler) {
  const _onBattleEnd = gameBattler.onBattleEnd;
  gameBattler.onBattleEnd = function () {
    _onBattleEnd.call(this);
    /**
     * CT開始ターンには、継続ターンは設定+1となっている(ターン終了時に1ターン経過するため)
     * 統一的に扱うため、戦闘終了時には1ターン経過した扱いとする
     */
    skillCooldownManager.decreaseCooldownTurns(this.skillCooldownId(), true);
    this.updateSkillCooldown();
  };

  gameBattler.updateSkillCooldown = function () {};

  const _onTurnEnd = gameBattler.onTurnEnd;
  gameBattler.onTurnEnd = function () {
    _onTurnEnd.call(this);
    if (this.isActor() && settings.decreaseCooldownTurnOnMap && !$gameParty.inBattle()) {
      skillCooldownManager.decreaseCooldownTurns(this.skillCooldownId(), true);
      this.updateSkillCooldown();
    }
  };
}

Game_Battler_ContinuousSkillCooldownMixIn(Game_Battler.prototype);

function Game_Actor_ContinuousSkillCooldownMixIn(gameActor: Game_Actor) {
  const _setup = gameActor.setup;
  gameActor.setup = function (actorId) {
    _setup.call(this, actorId);
    this._skillCooldowns = [];
    skillCooldownManager.initialize();
  };

  gameActor.initialSkillCooldowns = function () {
    const result: Game_SkillCooldown[] = [];
    (this._skillCooldowns || []).forEach(cooldown => result[cooldown.skillId] = cooldown);
    return result;
  };

  gameActor.updateSkillCooldown = function () {
    this._skillCooldowns = skillCooldownManager.actorsCooldowns(this.skillCooldownId()).filter(cooldown => cooldown);
  };
}

Game_Actor_ContinuousSkillCooldownMixIn(Game_Actor.prototype);

function Game_Party_ContinuousSkillCooldownMixIn(gameParty: Game_Party) {
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
};

Game_Party_ContinuousSkillCooldownMixIn(Game_Party.prototype);

function Game_System_ContinuousSkillCooldownMixIn(gameSystem: Game_System) {
  const _onAfterLoad = gameSystem.onAfterLoad;
  gameSystem.onAfterLoad = function () {
    _onAfterLoad.call(this);
    skillCooldownManager.initialize();
  };
}

Game_System_ContinuousSkillCooldownMixIn(Game_System.prototype);
