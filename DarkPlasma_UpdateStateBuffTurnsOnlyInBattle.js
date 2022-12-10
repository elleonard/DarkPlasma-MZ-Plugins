// DarkPlasma_UpdateStateBuffTurnsOnlyInBattle 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/12/10 1.0.0 公開
 */

/*:ja
 * @plugindesc ステート・強化・弱体のターン経過を戦闘中のみ行う
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * RPGツクールのデフォルトでは、戦闘におけるターン終了時以外に
 * マップ上で20歩歩いた場合にも
 * ステート・強化・弱体のターン経過処理が行われます。
 * 本プラグインではそのターン経過処理を戦闘中以外スキップします。
 */

(() => {
  'use strict';

  function Game_Battler_UpdateStateBuffTurnsOnlyInBattleMixIn(gameBattler) {
    const _updateStateTurns = gameBattler.updateStateTurns;
    gameBattler.updateStateTurns = function () {
      if ($gameParty.inBattle()) {
        _updateStateTurns.call(this);
      }
    };
    const _updateBuffTurns = gameBattler.updateBuffTurns;
    gameBattler.updateBuffTurns = function () {
      if ($gameParty.inBattle()) {
        _updateBuffTurns.call(this);
      }
    };
  }
  Game_Battler_UpdateStateBuffTurnsOnlyInBattleMixIn(Game_Battler.prototype);
})();
