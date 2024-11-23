// DarkPlasma_RemoveStateByMp 1.0.1
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/24 1.0.1 スキル使用によるMP消費時にステートが解除されない不具合を修正
 * 2023/06/22 1.0.0 公開
 */

/*:
 * @plugindesc MPが一定値以下になった際に解除するステート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.1
 * ステートのメモ欄に以下のように記述すると
 * 対象ステートはMPが一定値以下になった場合に解除されます。
 *
 * <removeByMpLTE:0>
 * MPが0以下になったら解除
 */

(() => {
  'use strict';

  function Game_Battler_RemoveStateByMpMixIn(gameBattler) {
    gameBattler.removeStatesByMp = function () {
      this.states()
        .filter((state) => state.meta.removeByMpLTE && Number(state.meta.removeByMpLTE) >= this.mp)
        .forEach((state) => this.removeState(state.id));
    };
    /**
     * gainMp, setMp経由の場合はrefreshを呼ぶ
     */
    const _refresh = gameBattler.refresh;
    gameBattler.refresh = function () {
      _refresh.call(this);
      this.removeStatesByMp();
    };
    const _paySkillCost = gameBattler.paySkillCost;
    gameBattler.paySkillCost = function (skill) {
      _paySkillCost.call(this, skill);
      this.removeStatesByMp();
    };
  }
  Game_Battler_RemoveStateByMpMixIn(Game_Battler.prototype);
})();
