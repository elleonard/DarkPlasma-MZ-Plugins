// DarkPlasma_CertainHitAction 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/08/12 1.0.0 公開
 */

/*:
 * @plugindesc スキルやアイテムを必中・反撃無視・反射無視にする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * スキルやアイテムのメモ欄に指定のタグを記述することで
 * 対象に必中特性、反撃無視特性、反射無視特性を付与します。
 *
 * 必中特性: <certainHit>
 * 命中率による命中判定の成功率を100％にします。
 * 回避率・魔法回避率による回避判定の成功率を0％にします。
 * 命中タイプ:必中と異なり、物理ダメージ率や魔法ダメージ率の影響は残る他
 * ステートの付与の成功率も通常通りの計算となります。
 *
 * 反撃無視特性: <ignoreCounter>
 * そのスキルに対する反撃率による反撃判定の成功率を0％にします。
 *
 * 反射無視特性: <ignoreReflection>
 * そのスキルに対する魔法反射率による反射判定の成功率を0％にします。
 */

(() => {
  'use strict';

  function Game_Action_CertainHitMixIn(gameAction) {
    const _itemHit = gameAction.itemHit;
    gameAction.itemHit = function (target) {
      if (this.item()?.meta.certainHit) {
        return 1;
      }
      return _itemHit.call(this, target);
    };
    const _itemEva = gameAction.itemEva;
    gameAction.itemEva = function (target) {
      if (this.item()?.meta.certainHit) {
        return 0;
      }
      return _itemEva.call(this, target);
    };
    const _itemCnt = gameAction.itemCnt;
    gameAction.itemCnt = function (target) {
      if (this.item()?.meta.ignoreCounter) {
        return 0;
      }
      return _itemCnt.call(this, target);
    };
    const _itemMrf = gameAction.itemMrf;
    gameAction.itemMrf = function (target) {
      if (this.item()?.meta.ignoreReflection) {
        return 0;
      }
      return _itemMrf.call(this, target);
    };
  }
  Game_Action_CertainHitMixIn(Game_Action.prototype);
})();
