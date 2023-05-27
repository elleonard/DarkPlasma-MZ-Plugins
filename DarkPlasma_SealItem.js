// DarkPlasma_SealItem 2.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/27 2.0.0 TypeScript移行
 *                  特徴の制御をAllocateUniqueTraitIdに任せる
 *                  マップのメモ欄に対応
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/03/13 1.0.0 公開
 */

/*:
 * @plugindesc アイテムを封印する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_AllocateUniqueTraitId
 *
 * @help
 * version: 2.0.0
 * メモ欄に特定の書式で記述することにより、
 * 特定のアイテムが使用不能になる特徴を追加します。
 * <sealAllItem>
 *   全てのアイテムが使用できなくなります。
 * <sealItems:1,2>
 *   アイテムID1及び2のアイテムが使用できなくなります。
 * <sealHealItem>
 *   HPまたはMP回復アイテムが使用できなくなります。
 * <sealResurrectionItem>
 *   戦闘不能解除の効果を持つアイテムが使用できなくなります。
 *
 * 同様のタグをマップのメモ欄に記述することにより、
 * 対象マップ内では特定のアイテムが使用不能になります。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitId
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const localTraitId = 1;
  const sealAllItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, '全アイテム禁止');
  const sealItemByIdTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, 'アイテム禁止');
  const sealHealItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 2, '回復アイテム禁止');
  const sealResurrectionItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 3, '蘇生アイテム禁止');
  function DataManager_SealItemMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        data.traits.push(...extractSealItemTraits(data));
      }
    };
    function extractSealItemTraits(data) {
      const result = [];
      if (data.meta.sealAllItem) {
        result.push({
          code: sealAllItemTraitId.id,
          dataId: 0,
          value: 0,
        });
      }
      if (data.meta.sealItems) {
        const itemIds = String(data.meta.sealItems)
          .split(',')
          .map((id) => Number(id));
        result.push(
          ...itemIds.map((itemId) => {
            return {
              code: sealItemByIdTraitId.id,
              dataId: itemId,
              value: 0,
            };
          })
        );
      }
      if (data.meta.sealHealItem) {
        result.push({
          code: sealHealItemTraitId.id,
          dataId: 0,
          value: 0,
        });
      }
      if (data.meta.sealResurrectionItem) {
        result.push({
          code: sealResurrectionItemTraitId.id,
          dataId: 0,
          value: 0,
        });
      }
      return result;
    }
    /**
     * 特徴を持つオブジェクトから、封印アイテムID一覧を取得する
     */
    dataManager.sealItems = function (object) {
      return object.meta.sealItems
        ? String(object.meta.sealItems)
            .split(',')
            .map((itemId) => Number(itemId))
        : [];
    };
    /**
     * ダメージタイプが回復であるようなアイテムか
     */
    dataManager.isHealItem = function (item) {
      return [3, 4].includes(item.damage.type);
    };
    /**
     * 戦闘不能を解除する効果を持つアイテムか
     */
    dataManager.isResurrectionItem = function (item) {
      return item.effects.some(
        (effect) =>
          effect.code === Game_Action.EFFECT_REMOVE_STATE && effect.dataId === Game_BattlerBase.prototype.deathStateId()
      );
    };
  }
  DataManager_SealItemMixIn(DataManager);
  function Game_Map_SealItemMixIn(gameMap) {
    gameMap.isItemSealed = function (item) {
      if (!$dataMap) {
        return false;
      }
      if ($dataMap.meta.sealItems) {
        if (
          String($dataMap.meta.sealItems)
            .split(',')
            .map((id) => Number(id))
            .includes(item.id)
        ) {
          return true;
        }
      }
      return (
        !!$dataMap.meta.sealAllItem ||
        (!!$dataMap.meta.sealHealItem && DataManager.isHealItem(item)) ||
        (!!$dataMap.meta.sealResurrectionItem && DataManager.isResurrectionItem(item))
      );
    };
  }
  Game_Map_SealItemMixIn(Game_Map.prototype);
  function Game_Actor_SealItemMixIn(gameActor) {
    const _meetsItemConditions = gameActor.meetsItemConditions;
    gameActor.meetsItemConditions = function (item) {
      return _meetsItemConditions.call(this, item) && !this.isItemSealed(item);
    };
    gameActor.isItemSealed = function (item) {
      return (
        this.traits(sealAllItemTraitId.id).length > 0 ||
        this.traitsSet(sealItemByIdTraitId.id).includes(item.id) ||
        (this.traits(sealHealItemTraitId.id).length > 0 && DataManager.isHealItem(item)) ||
        (this.traits(sealResurrectionItemTraitId.id).length > 0 && DataManager.isResurrectionItem(item)) ||
        (!!$gameMap && $gameMap.isItemSealed(item))
      );
    };
  }
  Game_Actor_SealItemMixIn(Game_Actor.prototype);
})();
