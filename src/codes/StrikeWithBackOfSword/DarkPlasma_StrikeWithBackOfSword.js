/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_StrikeWithBackOfSwordMixIn(gameAction) {
  gameAction.isStrikeWithBackOfSword = function () {
    return this.item().meta.strikeWithBackOfSword;
  };

  const _executeHpDamage = gameAction.executeHpDamage;
  gameAction.executeHpDamage = function (target, value) {
    if (this.isStrikeWithBackOfSword()) {
      value = Math.min(target.hp - 1, value);
    }
    _executeHpDamage.call(this, target, value);
  };
}

Game_Action_StrikeWithBackOfSwordMixIn(Game_Action.prototype);
