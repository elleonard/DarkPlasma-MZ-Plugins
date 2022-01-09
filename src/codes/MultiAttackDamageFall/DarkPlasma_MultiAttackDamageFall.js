import { settings } from './_build/DarkPlasma_MultiAttackDamageFall_parameters';

class MultiAttackTarget {
  constructor(target) {
    this._target = target;
    this._attacked = false;
  }

  /**
   * 複数攻撃のダメージ計算に用いる対象であるか
   * @param {Game_Battler} target
   * @return {boolean}
   */
  isMultiAttackTarget(target) {
    return this._target === target && !this._attacked;
  }

  /**
   * 攻撃済みフラグを立てる
   */
  attack() {
    this._attacked = true;
  }
}

/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_MultiAttackDamageFallMixIn(gameAction) {
  const _clear = gameAction.clear;
  gameAction.clear = function () {
    _clear.call(this);
    this._multiAttackTargets = [];
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
    this._multiAttackTargets = targets.map((target) => new MultiAttackTarget(target));
    return targets;
  };

  gameAction.multiAttackTargetIndex = function (target) {
    return this._multiAttackTargets.findIndex((cache) => cache.isMultiAttackTarget(target));
  };

  gameAction.multiAttackDamageFallRate = function (target) {
    if (!this.isMultiAttack()) {
      return 1;
    }
    const targetIndex = this.multiAttackTargetIndex(target);
    this._multiAttackTargets[targetIndex].attack();
    if (targetIndex > 0) {
      return Math.max((100 - settings.fallRate * targetIndex) / 100, settings.minimumRate / 100);
    }
    return 1;
  };
}

Game_Action_MultiAttackDamageFallMixIn(Game_Action.prototype);
