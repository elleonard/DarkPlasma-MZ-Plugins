// DarkPlasma_AlwaysCritical 1.0.3
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 1.0.3 TypeScript移行
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/09/10 1.0.0 公開
 */

/*:
 * @plugindesc 常時クリティカルが出る行動
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.3
 * スキル/アイテムのメモ欄に<alwaysCritical>と書くと、
 * そのスキルが常にクリティカルヒットします。
 */

(() => {
  'use strict';

  function Game_Action_AlwaysCriticalMixIn(gameAction) {
    const _itemCri = gameAction.itemCri;
    gameAction.itemCri = function (target) {
      if (this.item()?.meta.alwaysCritical) {
        return 1;
      }
      return _itemCri.call(this, target);
    };
  }
  Game_Action_AlwaysCriticalMixIn(Game_Action.prototype);
})();
