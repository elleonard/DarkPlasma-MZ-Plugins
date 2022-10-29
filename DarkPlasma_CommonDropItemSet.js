// DarkPlasma_CommonDropItemSet 1.2.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/10/29 1.2.1 敵ごとにドロップする設定が効かない不具合を修正
 *            1.2.0 敵ごとにドロップする設定を追加
 *            1.1.0 共通ドロップアイテム有効判定の拡張用インターフェース追加
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc 全戦闘共通でドロップするアイテム・武器・防具
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param dropItemSetList
 * @text ドロップセット一覧
 * @type struct<DropItemSet>[]
 * @default []
 *
 * @param dropOneByOneEnemy
 * @desc ONにするとドロップ判定を戦闘ごとではなく、敵ごとに行います。
 * @text 敵ごとにドロップするか
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.2.1
 * 全ての戦闘において共通でドロップするアイテム・武器・防具のセットを設定します。
 * ドロップセットはそれぞれ独立してドロップ確率判定を行います。
 * 例えば、ドロップセット1に確率10％、セット2に確率20％を設定した場合、
 * セット1のアイテム・武器・防具のうちいずれか1つが10％
 * セット2のアイテム・武器・防具のうちいずれか1つが20％でドロップします。
 * （両方ドロップするケースもあります）
 */
/*~struct~DropItemSet:
 * @param dropRate
 * @text ドロップ確率（％）
 * @type number
 * @default 10
 *
 * @param items
 * @text アイテム
 * @type item[]
 * @default []
 *
 * @param weapons
 * @text 武器
 * @type weapon[]
 * @default []
 *
 * @param armors
 * @text 防具
 * @type armor[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    dropItemSetList: JSON.parse(pluginParameters.dropItemSetList || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          dropRate: Number(parsed.dropRate || 10),
          items: JSON.parse(parsed.items || '[]').map((e) => {
            return Number(e || 0);
          }),
          weapons: JSON.parse(parsed.weapons || '[]').map((e) => {
            return Number(e || 0);
          }),
          armors: JSON.parse(parsed.armors || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
    dropOneByOneEnemy: String(pluginParameters.dropOneByOneEnemy || false) === 'true',
  };

  function makeDropItems() {
    return settings.dropItemSetList
      .filter((dropItemSet) => dropItemSet.dropRate > Math.randomInt(100))
      .map((dropItemSet) => {
        const dropItems = dropItemSet.items
          .map((id) => $dataItems[id])
          .concat(dropItemSet.weapons.map((id) => $dataWeapons[id]))
          .concat(dropItemSet.armors.map((id) => $dataArmors[id]));
        return dropItems[Math.randomInt(dropItems.length)];
      });
  }
  function Game_Troop_CommonDropItemSetMixIn(gameTroop) {
    const _makeDropItems = gameTroop.makeDropItems;
    gameTroop.makeDropItems = function () {
      return _makeDropItems.call(this).concat(this.makeCommonDropItems());
    };
    gameTroop.isCommonItemDropSetEnabled = function () {
      return !settings.dropOneByOneEnemy;
    };
    gameTroop.makeCommonDropItems = function () {
      return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
    };
  }
  Game_Troop_CommonDropItemSetMixIn(Game_Troop.prototype);
  function Game_Enemy_CommonDropItemSetMixIn(gameEnemy) {
    const _makeDropItems = gameEnemy.makeDropItems;
    gameEnemy.makeDropItems = function () {
      return _makeDropItems.call(this).concat(this.makeCommonDropItems());
    };
    gameEnemy.isCommonItemDropSetEnabled = function () {
      return settings.dropOneByOneEnemy;
    };
    gameEnemy.makeCommonDropItems = function () {
      return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
    };
  }
  Game_Enemy_CommonDropItemSetMixIn(Game_Enemy.prototype);
})();
