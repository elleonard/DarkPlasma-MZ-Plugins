const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  if (data.meta.StateGroup) {
    data.stateGroup = String(data.meta.StateGroup);
    data.statePriority = Number(data.meta.StatePriority || 0);
  }
};

const _Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function (stateId) {
  // 優先度の低い同グループステートにかかっている場合は上書きする
  if (this.isLowPriorityStateGroupAffected(stateId)) {
    this.eraseState(this.affectedSameGroupState(stateId).id);
  }
  _Game_Battler_addState.call(this, stateId);
};

const _Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
Game_Battler.prototype.isStateAddable = function (stateId) {
  // 優先度の高い同グループステートにかかっている場合はそのステートにかからない
  return _Game_Battler_isStateAddable.call(this, stateId) && !this.isHighPriorityStateGroupAffected(stateId);
};

/**
 * 同じグループに属する優先度の高いステートにかかっているかどうか
 */
Game_Battler.prototype.isHighPriorityStateGroupAffected = function (stateId) {
  const sameGroupState = this.affectedSameGroupState(stateId);
  return sameGroupState ? sameGroupState.statePriority > $dataStates[stateId].statePriority : false;
};

/**
 * 同じグループに属する優先度の低いステートにかかっているかどうか
 */
Game_Battler.prototype.isLowPriorityStateGroupAffected = function (stateId) {
  const sameGroupState = this.affectedSameGroupState(stateId);
  return sameGroupState ? sameGroupState.statePriority < $dataStates[stateId].statePriority : false;
};

/**
 * かかっているステートの中で、同じグループに属するステートを取得する
 * @param {number} stateId
 */
Game_Battler.prototype.affectedSameGroupState = function (stateId) {
  return this.states().find((activeState) => activeState.stateGroup === $dataStates[stateId].stateGroup);
};
