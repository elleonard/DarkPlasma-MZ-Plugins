// DarkPlasma_AttackInConfusedTurn 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/08/05 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 混乱系ステートを付加されたターンにも攻撃する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * バトラーが混乱系のステート（敵を攻撃、誰かを攻撃、味方を攻撃）を
 * 付加されたターンにも攻撃するようになります。
 */

(() => {
  'use strict';

  function Game_Battler_AttackInConfusedTurn(gameBattler) {
    const _onRestrict = gameBattler.onRestrict;
    gameBattler.onRestrict = function () {
      const numActions = this.numActions();
      _onRestrict.call(this);
      if (this.isConfused() && numActions > 0) {
        this.makeActions();
      }
    };
  }
  Game_Battler_AttackInConfusedTurn(Game_Battler.prototype);
})();
