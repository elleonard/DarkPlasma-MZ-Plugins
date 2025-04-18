/// <reference path="./DisableUpdateStateBuffTurnOnMap.d.ts" />

const AUTO_REMOVAL_TIMING_TURNEND = 2;

function Game_BattlerBase_DisableUpdateTurnOnMapMixIn(gameBattlerBase: Game_BattlerBase) {
  const _updateStateTurns = gameBattlerBase.updateStateTurns;
  gameBattlerBase.updateStateTurns = function () {
    if ($gameParty.inBattle()) {
      _updateStateTurns.call(this);
    }
  };

  const _updateBuffTurns = gameBattlerBase.updateBuffTurns;
  gameBattlerBase.updateBuffTurns = function () {
    if ($gameParty.inBattle()) {
      _updateBuffTurns.call(this);
    }
  };
}

Game_BattlerBase_DisableUpdateTurnOnMapMixIn(Game_BattlerBase.prototype);
