import { settings } from './_build/DarkPlasma_SurpriseControl_parameters';

let battleProcessByEvent = false;

const _extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _extractMetadata.call(this, data);
  if (data.meta.NoPreemptive !== undefined) {
    data.noPreemptive = true;
  }
  if (data.meta.NoSurprise !== undefined) {
    data.noSurprise = true;
  }
  if (data.meta.ForcePreemptive !== undefined) {
    data.forcePreemptive = true;
  }
  if (data.meta.ForceSurprise !== undefined) {
    data.forceSurprise = true;
  }
};

const _BattleManager_setup = BattleManager.setup;
BattleManager.setup = function (troopId, canEscape, canLose) {
  _BattleManager_setup.call(this, troopId, canEscape, canLose);
  if (settings.enableWithEventCommand && battleProcessByEvent) {
    this.onEncounter();
  }
};

const _BattleManager_ratePreemptive = BattleManager.ratePreemptive;
BattleManager.ratePreemptive = function () {
  if (this.forcePreemptive()) {
    return 1;
  } else if (this.noPreemptive() || this.forceSurprise()) {
    return 0;
  }
  return _BattleManager_ratePreemptive.call(this);
};

const _BattleManager_rateSurprise = BattleManager.rateSurprise;
BattleManager.rateSurprise = function () {
  if (this.forceSurprise()) {
    return 1;
  } else if (this.noSurprise()) {
    return 0;
  }
  return _BattleManager_rateSurprise.call(this);
};

BattleManager.noPreemptive = function () {
  return (
    (settings.noPreemptiveSwitch > 0 && $gameSwitches.value(settings.noPreemptiveSwitch)) ||
    $gameTroop.hasNoPreemptiveFlag()
  );
};

BattleManager.noSurprise = function () {
  return (
    (settings.noSurpriseSwitch > 0 && $gameSwitches.value(settings.noSurpriseSwitch)) || $gameTroop.hasNoSurpriseFlag()
  );
};

BattleManager.forcePreemptive = function () {
  return (
    (settings.forcePreemptiveSwitch > 0 && $gameSwitches.value(settings.forcePreemptiveSwitch)) ||
    $gameTroop.hasForcePreemptiveFlag()
  );
};

BattleManager.forceSurprise = function () {
  return (
    (settings.forceSurpriseSwitch > 0 && $gameSwitches.value(settings.forceSurpriseSwitch)) ||
    $gameTroop.hasForceSurpriseFlag()
  );
};

Game_Troop.prototype.hasNoPreemptiveFlag = function () {
  return this.members().some(function (enemy) {
    return enemy.hasNoPreemptiveFlag();
  });
};

Game_Troop.prototype.hasNoSurpriseFlag = function () {
  return this.members().some(function (enemy) {
    return enemy.hasNoSurpriseFlag();
  });
};

Game_Troop.prototype.hasForcePreemptiveFlag = function () {
  return this.members().some(function (enemy) {
    return enemy.hasForcePreemptiveFlag();
  });
};

Game_Troop.prototype.hasForceSurpriseFlag = function () {
  return this.members().some(function (enemy) {
    return enemy.hasForceSurpriseFlag();
  });
};

Game_Enemy.prototype.hasNoPreemptiveFlag = function () {
  return !!this.enemy().noPreemptive;
};

Game_Enemy.prototype.hasNoSurpriseFlag = function () {
  return !!this.enemy().noSurprise;
};

Game_Enemy.prototype.hasForcePreemptiveFlag = function () {
  return !!this.enemy().forcePreemptive;
};

Game_Enemy.prototype.hasForceSurpriseFlag = function () {
  return !!this.enemy().forceSurprise;
};

const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function (params) {
  battleProcessByEvent = true;
  const result = _Game_Interpreter_command301.call(this, params);
  battleProcessByEvent = false;
  return result;
};
