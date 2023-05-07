// DarkPlasma_StateAliasBySide 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/07 1.0.1 typescript移行
 *                  エイリアス元ステートの無効フラグを貫通する不具合を修正
 * 2022/03/11 1.0.0 公開
 */

/*:
 * @plugindesc 敵味方に応じてステートを変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.1
 * 敵・味方に応じて別のステートを付与することができます。
 *
 * <stateAliasEnemy:X>
 * ステートのメモ欄にこう記述した場合、
 * 敵にそのステートを付与する場合、
 * 代わりにステートID:Xのステートが付与されます。
 * ステート有効度はXではなく元のステートのものが使用されます。
 * ステート無効フラグは両方のステートのものが使用されます。
 *
 * <stateAliasActor:X>
 * ステートのメモ欄にこう記述した場合、
 * 味方にそのステートを付与する場合、
 * 代わりにステートID:Xのステートが付与されます。
 * ステート有効度はXではなく元のステートのものが使用されます。
 * ステート無効フラグは両方のステートのものが使用されます。
 *
 * 例:
 * <stateAliasEnemy:14>
 * ステートID4を敵に付与する場合、
 * ステートID4ではなく14が付与されます。
 * 味方用の毒と敵用の毒を分けたい場合に有効です。
 *
 * この場合、ステート有効度はID4のものが使用されます。
 * ステート無効フラグはID4, ID14どちらかがついていれば無効となります。
 */

(() => {
  'use strict';

  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_StateAliasBySideMixIn(gameBattler) {
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
})();
