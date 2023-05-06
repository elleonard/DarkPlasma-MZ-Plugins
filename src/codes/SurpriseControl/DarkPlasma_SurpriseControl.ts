/// <reference path="./SurpriseControl.d.ts" />

import { settings } from './_build/DarkPlasma_SurpriseControl_parameters';

function BattleManager_SurpriseControlMixIn(battleManager: typeof BattleManager) {
  const _ratePreemptive = battleManager.ratePreemptive;
  battleManager.ratePreemptive = function () {
    if (this.forcePreemptive()) {
      return 1;
    } else if (this.noPreemptive() || this.forceSurprise()) {
      return 0;
    }
    return _ratePreemptive.call(this);
  };
  
  const _rateSurprise = battleManager.rateSurprise;
  battleManager.rateSurprise = function () {
    if (this.forceSurprise()) {
      return 1;
    } else if (this.noSurprise()) {
      return 0;
    }
    return _rateSurprise.call(this);
  };
  
  battleManager.noPreemptive = function () {
    return (
      (settings.noPreemptiveSwitch > 0 && $gameSwitches.value(settings.noPreemptiveSwitch)) ||
      $gameTroop.hasNoPreemptiveFlag()
    );
  };
  
  battleManager.noSurprise = function () {
    return (
      (settings.noSurpriseSwitch > 0 && $gameSwitches.value(settings.noSurpriseSwitch)) || $gameTroop.hasNoSurpriseFlag()
    );
  };
  
  battleManager.forcePreemptive = function () {
    return (
      (settings.forcePreemptiveSwitch > 0 && $gameSwitches.value(settings.forcePreemptiveSwitch)) ||
      $gameTroop.hasForcePreemptiveFlag()
    );
  };
  
  battleManager.forceSurprise = function () {
    return (
      (settings.forceSurpriseSwitch > 0 && $gameSwitches.value(settings.forceSurpriseSwitch)) ||
      $gameTroop.hasForceSurpriseFlag()
    );
  };
}

BattleManager_SurpriseControlMixIn(BattleManager);

function Game_Troop_SurpriseControlMixIn(gameTroop: Game_Troop) {
  gameTroop.hasNoPreemptiveFlag = function () {
    return this.members().some(function (enemy) {
      return enemy.hasNoPreemptiveFlag();
    });
  };
  
  gameTroop.hasNoSurpriseFlag = function () {
    return this.members().some(function (enemy) {
      return enemy.hasNoSurpriseFlag();
    });
  };
  
  gameTroop.hasForcePreemptiveFlag = function () {
    return this.members().some(function (enemy) {
      return enemy.hasForcePreemptiveFlag();
    });
  };
  
  gameTroop.hasForceSurpriseFlag = function () {
    return this.members().some(function (enemy) {
      return enemy.hasForceSurpriseFlag();
    });
  };
}

Game_Troop_SurpriseControlMixIn(Game_Troop.prototype);

function Game_Enemy_SurpriseControlMixIn(gameEnemy: Game_Enemy) {
  gameEnemy.hasNoPreemptiveFlag = function () {
    return !!this.enemy().meta.NoPreemptive;
  };
  
  gameEnemy.hasNoSurpriseFlag = function () {
    return !!this.enemy().meta.NoSurprise;
  };
  
  gameEnemy.hasForcePreemptiveFlag = function () {
    return !!this.enemy().meta.ForcePreemptive;
  };
  
  gameEnemy.hasForceSurpriseFlag = function () {
    return !!this.enemy().meta.ForceSurprise;
  };
}

Game_Enemy_SurpriseControlMixIn(Game_Enemy.prototype);
