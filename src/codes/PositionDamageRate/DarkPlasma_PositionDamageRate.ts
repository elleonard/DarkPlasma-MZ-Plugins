/// <reference path="./PositionDamageRate.d.ts" />

import { settings } from './_build/DarkPlasma_PositionDamageRate_parameters';

const SPARAM_ID = {
  PHYSICAL_DAMAGE_RATE: 6,
  MAGICAL_DAMAGE_RATE: 7,
};

function Game_BattlerBase_PositionDamageRateMixIn(gameBattlerBase: Game_BattlerBase) {
  const _sparam = gameBattlerBase.sparam;
  gameBattlerBase.sparam = function (sparamId) {
    const value = _sparam.call(this, sparamId);
    if (sparamId === SPARAM_ID.PHYSICAL_DAMAGE_RATE) {
      return value * this.physicalDamageRateByPosition();
    }
    if (sparamId === SPARAM_ID.MAGICAL_DAMAGE_RATE) {
      return value * this.magicalDamageRateByPosition();
    }
    return value;
  };

  gameBattlerBase.physicalDamageRateByPosition = function () {
    return 1;
  };

  gameBattlerBase.magicalDamageRateByPosition = function () {
    return 1;
  };
}

Game_BattlerBase_PositionDamageRateMixIn(Game_BattlerBase.prototype);

function Game_Actor_PositionDamageRateMixIn(gameActor: Game_Actor) {
  gameActor.physicalDamageRateByPosition = function () {
    const index = this.originalIndex();
    if ($gameParty.maxBattleMembers() <= index) {
      return 1;
    }
    return (
      (settings.physicalDamageRates.length > index
        ? settings.physicalDamageRates[index]
        : settings.physicalDamageRates[settings.physicalDamageRates.length - 1]) / 100
    );
  };
  
  gameActor.magicalDamageRateByPosition = function () {
    const index = this.originalIndex();
    /**
     * tempActorの場合は isBattleMember は使えない
     */
    if ($gameParty.maxBattleMembers() <= index) {
      return 1;
    }
    return (
      (settings.magicalDamageRates.length > index
        ? settings.magicalDamageRates[index]
        : settings.magicalDamageRates[settings.magicalDamageRates.length - 1]) / 100
    );
  };

  /**
   * 装備画面のtempActorから参照しようとすると index だけでは正しい値が取れない
   */
  gameActor.originalIndex = function () {
    const index = this.index();
    if (index >= 0) {
      return index;
    }
    const originalIndex = $gameParty.members().find(actor => actor.actorId() === this.actorId())?.index();
    return originalIndex === undefined ? -1 : originalIndex;
  };
}

Game_Actor_PositionDamageRateMixIn(Game_Actor.prototype);
