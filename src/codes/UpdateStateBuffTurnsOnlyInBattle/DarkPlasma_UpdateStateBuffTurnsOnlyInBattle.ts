/// <reference path="./UpdateStateBuffTurnsOnlyInBattle.d.ts" />

function Game_Battler_UpdateStateBuffTurnsOnlyInBattleMixIn(gameBattler: Game_Battler) {
  const _updateStateTurns = gameBattler.updateStateTurns;
  gameBattler.updateStateTurns = function () {
    if ($gameParty.inBattle()) {
      _updateStateTurns.call(this);
    }
  };

  const _updateBuffTurns = gameBattler.updateBuffTurns;
  gameBattler.updateBuffTurns = function () {
    if ($gameParty.inBattle()) {
      _updateBuffTurns.call(this);
    }
  };
}

Game_Battler_UpdateStateBuffTurnsOnlyInBattleMixIn(Game_Battler.prototype);
