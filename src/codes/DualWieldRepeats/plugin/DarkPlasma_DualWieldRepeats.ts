/// <reference path="./DualWieldRepeats.d.ts" />

function Game_Action_DualWieldAttackTimesMixIn(gameAction: Game_Action) {
  gameAction.isDualWieldRepeats = function () {
    return !!this.item()?.meta.dualWieldRepeats;
  };

  const _numRepeats = gameAction.numRepeats;
  gameAction.numRepeats = function () {
    const repeats = _numRepeats.call(this);
    if (this.subject().isDualWield() && this.isDualWieldRepeats()) {
      return repeats + 1;
    }
    return repeats;
  };
}

Game_Action_DualWieldAttackTimesMixIn(Game_Action.prototype);
