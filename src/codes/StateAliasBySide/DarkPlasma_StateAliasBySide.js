/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_StateAliasBySideMixIn(gameBattler) {
  const _addState = gameBattler.addState;
  gameBattler.addState = function (stateId) {
    _addState.call(this, this.aliasedStateIdBySide(stateId));
  };

  /**
   * @param {number} stateId
   * @return {number}
   */
  gameBattler.aliasedStateIdBySide = function (stateId) {
    if (this.isActor()) {
      return Number($dataStates[stateId].meta.stateAliasActor || stateId);
    }
    return Number($dataStates[stateId].meta.stateAliasEnemy || stateId);
  };
}

Game_Battler_StateAliasBySideMixIn(Game_Battler.prototype);
