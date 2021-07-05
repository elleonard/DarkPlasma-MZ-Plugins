// DarkPlasma_AlwaysCritical 1.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/09/10 1.0.0 公開
 */

/*:ja
 * @plugindesc 常時クリティカルが出るスキル
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.2
 * スキルのメモ欄に<alwaysCritical>と書くと、
 * そのスキルが常にクリティカルヒットします。
 */

(() => {
  'use strict';

  const _Game_Action_itemCri = Game_Action.prototype.itemCri;
  Game_Action.prototype.itemCri = function (target) {
    if (this.item().meta.alwaysCritical) {
      return 1;
    }
    return _Game_Action_itemCri.call(this, target);
  };
})();
