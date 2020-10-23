import { settings } from './_build/DarkPlasma_PositionDamageRate_parameters';

const SPARAM_ID = {
  PHYSICAL_DAMAGE_RATE: 6,
  MAGICAL_DAMAGE_RATE: 7,
};

const _Game_Actor_sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function (sparamId) {
  const value = _Game_Actor_sparam.call(this, sparam);
  if (sparamId === SPARAM_ID.PHYSICAL_DAMAGE_RATE) {
    return value * this.physicalDamageRateByPosition();
  }
  if (sparamId === SPARAM_ID.MAGICAL_DAMAGE_RATE) {
    return value * this.magicalDamageRateByPosition();
  }
  return value;
};

Game_Actor.prototype.physicalDamageRateByPosition = function () {
  const index = this.index();
  return (
    (settings.physicalDamageRates.length > index
      ? settings.physicalDamageRates[index]
      : settings.physicalDamageRates[settings.physicalDamageRates.length - 1]) / 100
  );
};

Game_Actor.prototype.magicalDamageRateByPosition = function () {
  const index = this.index();
  return (
    (settings.magicalDamageRates.length > index
      ? settings.magicalDamageRates[index]
      : settings.magicalDamageRates[settings.magicalDamageRates - 1]) / 100
  );
};
