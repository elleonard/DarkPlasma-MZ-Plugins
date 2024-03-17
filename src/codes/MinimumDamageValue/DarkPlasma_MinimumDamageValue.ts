import { settings } from './_build/DarkPlasma_MinimumDamageValue_parameters';

const _GameAction_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function (target, critical) {
  return _GameAction_makeDamageValue.call(this, target, critical) + this.minimumDamageValue(target);
};

Game_Action.prototype.minimumDamageValue = function (target) {
  let value = 0;
  if (settings.ignoreIfRateLEZero && this.calcElementRate(target) <= 0) {
    return 0;
  }
  if (this.isPhysical()) {
    value = settings.minimumPhysicalDamage;
  }
  if (this.isMagical()) {
    value = settings.minimumMagicalDamage;
  }
  return settings.randomMinimumDamage ? Math.floor(Math.random() * (value + 1)) : value;
};
