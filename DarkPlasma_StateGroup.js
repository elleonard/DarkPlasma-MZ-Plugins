// DarkPlasma_StateGroup 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc ステートをグルーピングして優先度付する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.3
 * ステートをグルーピングして優先度付します。
 * 同じグループに属するステートは重ねがけできず、
 * 同じグループの優先度の高いステートで上書きされます。
 *
 * ステートのメモ欄に以下のように記述してください。
 *
 * <StateGroup:（グループ名）> グループ名は任意の文字列です。
 * 毒 や Poison など、グループに名前をつけてください。
 * <StatePriority:x> xは数値です。数値が大きいほど優先度が高くなります。
 */

(() => {
  'use strict';

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
})();
