import { settings } from './_build/DarkPlasma_MultiAttackDamageFall_parameters';

/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_MultiAttackDamageFallMixIn(gameAction) {
  const _clear = gameAction.clear;
  gameAction.clear = function () {
    _clear.call(this);
    this._cachedTargets = [];
  };

  const _makeDamageValue = gameAction.makeDamageValue;
  gameAction.makeDamageValue = function (target, critical) {
    const value = _makeDamageValue.call(this, target, critical);
    return Math.floor(value * this.multiAttackDamageFallRate(target));
  };

  gameAction.isMultiAttack = function () {
    return this.item().meta.multiAttack;
  };

  const _makeTargets = gameAction.makeTargets;
  gameAction.makeTargets = function () {
    /**
     * ダメージ計算で使うため、ターゲット情報はキャッシュしておく
     */
    const targets = _makeTargets.call(this);
    this._cachedTargets = [...targets];
    return targets;
  };

  gameAction.cachedTargetIndex = function (target) {
    return this._cachedTargets.indexOf(target);
  };

  gameAction.multiAttackDamageFallRate = function (target) {
    if (!this.isMultiAttack()) {
      return 1;
    }
    const targetIndex = this.cachedTargetIndex(target);
    if (targetIndex > 0) {
      return Math.max((100 - settings.fallRate * targetIndex) / 100, settings.minimumRate / 100);
    }
    return 1;
  };
}

Game_Action_MultiAttackDamageFallMixIn(Game_Action.prototype);
