// DarkPlasma_UnusableItemWithMapEvent 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/06/02 1.0.0 公開
 */

/*:ja
 * @plugindesc マップイベント実行中は使用できないアイテム
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * メモ欄に以下のように記述したアイテム・スキルは
 * マップイベントの実行中には使用できなくなります。
 *
 * <unusableWithMapEvent>
 */

(() => {
  'use strict';

  /**
   * @param {Game_BattlerBase.prototype} gameBattlerBase
   */
  function Game_BattlerBase_UnusableItemWithMapEvntMixIn(gameBattlerBase) {
    const _isOccasionOk = gameBattlerBase.isOccasionOk;
    gameBattlerBase.isOccasionOk = function (item) {
      return _isOccasionOk.call(this, item) && (!item.meta.unusableWithMapEvent || !$gameMap.isEventRunning());
    };
  }

  Game_BattlerBase_UnusableItemWithMapEvntMixIn(Game_BattlerBase.prototype);
})();
