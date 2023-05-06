/// <reference path="./SurpriseControlWithEventBattle.d.ts" />

function BattleManager_SurpriseControlMixIn(battleManager: typeof BattleManager) {
  const _setup = battleManager.setup;
  battleManager.setup = function (troopId, canEscape, canLose) {
    _setup.call(this, troopId, canEscape, canLose);
    if (this.mustDoOnEncounter()) {
      this.onEncounter();
    }
  };

  battleManager.mustDoOnEncounter = function () {
    return this._isEventBattle;
  };

  battleManager.setIsEventBattle = function (isEventBattle) {
    this._isEventBattle = isEventBattle;
  };
}

BattleManager_SurpriseControlMixIn(BattleManager);

function Game_Interpreter_SurpriseControlMixIn(gameInterpreter: Game_Interpreter) {
  const _command301 = gameInterpreter.command301;
  gameInterpreter.command301 = function (params) {
    BattleManager.setIsEventBattle(true);
    const result = _command301.call(this, params);
    BattleManager.setIsEventBattle(false);
    return result;
  };
}

Game_Interpreter_SurpriseControlMixIn(Game_Interpreter.prototype);
