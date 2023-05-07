/// <reference path="./StateAliasBySide.d.ts" />

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_StateAliasBySideMixIn(gameBattler: Game_Battler) {
  const _addState = gameBattler.addState;
  gameBattler.addState = function (stateId) {
    _addState.call(this, this.aliasedStateIdBySide(stateId));
  };

  gameBattler.aliasedStateIdBySide = function (stateId) {
    if (!this.isStateAddable(stateId)) {
      return stateId;
    }
    if (this.isActor()) {
      return Number($dataStates[stateId].meta.stateAliasActor || stateId);
    }
    return Number($dataStates[stateId].meta.stateAliasEnemy || stateId);
  };
}

Game_Battler_StateAliasBySideMixIn(Game_Battler.prototype);
