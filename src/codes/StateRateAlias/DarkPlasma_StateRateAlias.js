const _Game_BattlerBase_stateRate = Game_BattlerBase.prototype.stateRate;
Game_BattlerBase.prototype.stateRate = function (stateId) {
  return _Game_BattlerBase_stateRate.call(this, rateAliasedStateId(stateId));
};

const _Game_BattlerBase_isStateResist = Game_BattlerBase.prototype.isStateResist;
Game_BattlerBase.prototype.isStateResist = function (stateId) {
  return _Game_BattlerBase_isStateResist.call(this, rateAliasedStateId(stateId));
};

/**
 * @param {number} stateId
 * @return {number}
 */
function rateAliasedStateId(stateId) {
  const state = $dataStates[stateId];
  return state.meta.stateRateAlias ? Number(state.meta.stateRateAlias) : stateId;
}
