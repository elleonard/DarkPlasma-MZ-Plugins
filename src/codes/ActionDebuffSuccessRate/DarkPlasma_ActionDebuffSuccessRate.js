/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_DebuffSuccessRateMixIn(gameAction) {
  gameAction.baseDebuffSuccessRate = function () {
    return Number(this.item().meta.debuffSuccessRate || 100) / 100;
  };

  /**
   * 弱体の付与。成功率計算を変更するため上書き
   * @param {Game_BattlerBase} target
   * @param {MZ.Effect} effect
   */
  gameAction.itemEffectAddDebuff = function (target, effect) {
    let chance = this.baseDebuffSuccessRate() * target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
      target.addDebuff(effect.dataId, effect.value1);
      this.makeSuccess(target);
    }
  };
}

Game_Action_DebuffSuccessRateMixIn(Game_Action.prototype);
