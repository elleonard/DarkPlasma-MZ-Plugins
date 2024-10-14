/// <reference path="./PositionDamageRate.d.ts" />

import { settings } from './_build/DarkPlasma_PositionDamageRate_parameters';

const SPARAM_ID = {
  PHYSICAL_DAMAGE_RATE: 6,
  MAGICAL_DAMAGE_RATE: 7,
};

function Game_Actor_PositionDamageRateMixIn(gameActor: Game_Actor) {
  const _sparam = gameActor.sparam;
  gameActor.sparam = function (sparamId) {
    const value = _sparam.call(this, sparamId);
    if (sparamId === SPARAM_ID.PHYSICAL_DAMAGE_RATE) {
      return value * this.physicalDamageRateByPosition();
    }
    if (sparamId === SPARAM_ID.MAGICAL_DAMAGE_RATE) {
      return value * this.magicalDamageRateByPosition();
    }
    return value;
  };
  
  gameActor.physicalDamageRateByPosition = function () {
    const index = this.originalIndex();
    return (
      (settings.physicalDamageRates.length > index
        ? settings.physicalDamageRates[index]
        : settings.physicalDamageRates[settings.physicalDamageRates.length - 1]) / 100
    );
  };
  
  gameActor.magicalDamageRateByPosition = function () {
    const index = this.originalIndex();
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
