// DarkPlasma_ForbidWaitingMemberInput 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/01/10 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 待機メンバーの行動入力を禁止する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 待機メンバーの行動入力を禁止します。
 */

(() => {
  'use strict';

  function Game_Battler_ForbidWaitingMemberInputMixIn(gameBattler) {
    const _canInput = gameBattler.canInput;
    gameBattler.canInput = function () {
      /**
       * canInputで this が Game_Actor であることが確定している
       */
      return _canInput.call(this) && this.isBattleMember();
    };
  }
  Game_Battler_ForbidWaitingMemberInputMixIn(Game_Battler.prototype);
})();
