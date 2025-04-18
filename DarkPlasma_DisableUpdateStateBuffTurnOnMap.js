// DarkPlasma_DisableUpdateStateBuffTurnOnMap 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/04/18 1.0.0 公開
 */

/*:
 * @plugindesc マップ上でのステート・強化・弱体のターン数経過を無効にする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * マップ上でステート・強化・弱体のターンが経過しないようにします。
 */

(() => {
  'use strict';

  function Game_BattlerBase_DisableUpdateTurnOnMapMixIn(gameBattlerBase) {
    const _updateStateTurns = gameBattlerBase.updateStateTurns;
    gameBattlerBase.updateStateTurns = function () {
      if ($gameParty.inBattle()) {
        _updateStateTurns.call(this);
      }
    };
    const _updateBuffTurns = gameBattlerBase.updateBuffTurns;
    gameBattlerBase.updateBuffTurns = function () {
      if ($gameParty.inBattle()) {
        _updateBuffTurns.call(this);
      }
    };
  }
  Game_BattlerBase_DisableUpdateTurnOnMapMixIn(Game_BattlerBase.prototype);
})();
