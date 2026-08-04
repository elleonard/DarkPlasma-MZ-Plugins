/// <reference path="./AttackInConfusedTurn.d.ts" />

function Game_Battler_AttackInConfusedTurn(gameBattler: Game_Battler) {
  const _onRestrict = gameBattler.onRestrict;
  gameBattler.onRestrict = function () {
    const numActions = this.numActions();
    _onRestrict.call(this);
    if (this.isConfused() && numActions > 0) {
      this.makeActions();
    }
  };
}

Game_Battler_AttackInConfusedTurn(Game_Battler.prototype);
