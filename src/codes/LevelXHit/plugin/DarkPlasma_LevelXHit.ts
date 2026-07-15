/// <reference path="./LevelXHit.d.ts" />

import { pluginName } from '../../../common/pluginName';

const levelXHitTypes: {[base: number]: UniqueHitTypeId} = {};

function DataManager_LevelXHitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("hitType" in data && data.meta.levelXHit) {
      const base = Number(data.meta.levelXHit || 0);
      if (base === 0) {
        throw Error(`レベル0の倍数指定はできません。 ${data.name}`);
      }
      const hitType = uniqueHitTypeIdCache.allocate(pluginName, base, `レベルが${base}の倍数に必中`);
      if (!levelXHitTypes[base]) {
        levelXHitTypes[base] = hitType;
      }
      data.hitType = hitType.id;
    }
  };
}

DataManager_LevelXHitMixIn(DataManager);

function Game_Action_LevelXHitMixIn(gameAction: Game_Action) {
  const _itemHit = gameAction.itemHit;
  gameAction.itemHit = function (target) {
    const base = Object.keys(levelXHitTypes).find(base => this.isLevelXHit(Number(base)));
    if (base && target.level !== undefined && target.level % Number(base) === 0) {
      return 1;
    }
    return _itemHit.call(this, target);
  };

  gameAction.isLevelXHit = function (base) {
    return this.isHitType(levelXHitTypes[base].id);
  };
}

Game_Action_LevelXHitMixIn(Game_Action.prototype);
