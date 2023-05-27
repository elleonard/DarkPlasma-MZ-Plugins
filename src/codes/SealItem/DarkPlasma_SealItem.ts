/// <reference path="./SealItem.d.ts" />

import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

const localTraitId = 1;
const sealAllItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, '全アイテム禁止');
const sealItemByIdTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, 'アイテム禁止');
const sealHealItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 2, '回復アイテム禁止');
const sealResurrectionItemTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 3, '蘇生アイテム禁止');

function DataManager_SealItemMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data)) {
      data.traits.push(...extractSealItemTraits(data));
    }
  };

  function extractSealItemTraits(data: MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy) {
    const result: MZ.Trait[] = [];
    if (data.meta.sealAllItem) {
      result.push({
        code: sealAllItemTraitId.id,
        dataId: 0,
        value: 0,
      });
    }
    if (data.meta.sealItems) {
      const itemIds = String(data.meta.sealItems).split(",").map(id => Number(id));
      result.push(...itemIds.map(itemId => {
        return {
          code: sealItemByIdTraitId.id,
          dataId: itemId,
          value: 0
        };
      }));
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
    return object.meta.sealItems ? String(object.meta.sealItems).split(',').map((itemId) => Number(itemId)) : [];
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

function Game_Map_SealItemMixIn(gameMap: Game_Map) {
  gameMap.isItemSealed = function (item) {
    if (!$dataMap) {
      return false;
    }
    if ($dataMap.meta.sealItems) {
      if (String($dataMap.meta.sealItems).split(",").map(id => Number(id)).includes(item.id)) {
        return true;
      }
    }
    return !!$dataMap.meta.sealAllItem
      || !!$dataMap.meta.sealHealItem && DataManager.isHealItem(item)
      || !!$dataMap.meta.sealResurrectionItem && DataManager.isResurrectionItem(item);
  };
}

Game_Map_SealItemMixIn(Game_Map.prototype);

function Game_Actor_SealItemMixIn(gameActor: Game_Actor) {
  const _meetsItemConditions = gameActor.meetsItemConditions;
  gameActor.meetsItemConditions = function (item) {
    return _meetsItemConditions.call(this, item) && !this.isItemSealed(item);
  };
  
  gameActor.isItemSealed = function (item) {
    return this.traits(sealAllItemTraitId.id).length > 0
      || this.traitsSet(sealItemByIdTraitId.id).includes(item.id)
      || this.traits(sealHealItemTraitId.id).length > 0 && DataManager.isHealItem(item)
      || this.traits(sealResurrectionItemTraitId.id).length > 0 && DataManager.isResurrectionItem(item)
      || !!$gameMap && $gameMap.isItemSealed(item)
  };  
}

Game_Actor_SealItemMixIn(Game_Actor.prototype);
