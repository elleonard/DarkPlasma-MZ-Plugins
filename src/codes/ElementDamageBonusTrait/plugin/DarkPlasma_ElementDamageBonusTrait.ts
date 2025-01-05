/// <reference path="./ElementDamageBonusTrait.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { hasTraits } from '../../../common/data/hasTraits';

const elementDamageBonusTrait = uniqueTraitIdCache.allocate(pluginName, 1, "属性ダメージボーナス");

function DataManager_ElementDamageBonusTraitMixIn(dataManager: typeof DataManager) {
  const _loadDatabase = dataManager.loadDatabase;
  dataManager.loadDatabase = function () {
    this._reservedExtractingElementDamageBonusTraitsNoteHolders = [];
    _loadDatabase.call(this);
  };

  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.elementDamageBonus) {
      /**
       * 属性名のロードが完了していないため、予約だけして後で展開する
       */
      this._reservedExtractingElementDamageBonusTraitsNoteHolders.push(data);
    }
  };

  dataManager.extractElementDamageBonusTraits = function () {
    this._reservedExtractingElementDamageBonusTraitsNoteHolders.forEach(data => {
      const meta = String(data.meta.elementDamageBonus);
      data.traits.push(...this.extractElementDamageBonusTraitsSub(meta));
    });
  };

  dataManager.extractElementDamageBonusTraitsSub = function (meta) {
    return meta.split('\n')
      .filter(line => line.includes(":"))
      .map(line => {
        const tokens = line.split(":").map(t => t.trim());
        const dataId = $dataSystem.elements.indexOf(tokens[0]);
        if (dataId < 0) {
          throw Error(`不正な属性指定です ${tokens[0]}`);
        }
        return {
          code: elementDamageBonusTrait.id,
          dataId: dataId,
          value: Number(tokens[1] || 0),
        };
      })
  };
}

DataManager_ElementDamageBonusTraitMixIn(DataManager);

function Scene_Boot_ElementDamageBonusTraitMixIn(sceneBoot: Scene_Boot) {
  const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
  sceneBoot.onDatabaseLoaded = function () {
    _onDatabaseLoaded.call(this);
    DataManager.extractElementDamageBonusTraits();
  };
}

Scene_Boot_ElementDamageBonusTraitMixIn(Scene_Boot.prototype);

function Game_Action_ElementDamageBonusTraitMixIn(gameAction: Game_Action) {
  const _calcElementRate = gameAction.calcElementRate;
  gameAction.calcElementRate = function (target) {
    const result = _calcElementRate.call(this, target);
    return result + this.elementDamageBonus(this.actionAttackElements());
  };

  gameAction.elementDamageBonus = function (elements) {
    return elements
      .reduce((result, elementId) => this.subject().traitsSum(elementDamageBonusTrait.id, elementId) + result, 0)/100;
  };

  if (!gameAction.actionAttackElements) {
    gameAction.actionAttackElements = function () {
      const elementId = this.item()!.damage.elementId;
      if (elementId < 0) {
        return this.subject().attackElements();
      }
      return [elementId];
    };
  }
}

Game_Action_ElementDamageBonusTraitMixIn(Game_Action.prototype);
