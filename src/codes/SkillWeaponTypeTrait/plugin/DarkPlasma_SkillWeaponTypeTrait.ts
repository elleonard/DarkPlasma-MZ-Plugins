/// <reference path="./SkillWeaponTypeTrait.d.ts" />

import { hasTraits } from '../../../common/data/hasTraits';
import { pluginName } from '../../../common/pluginName';

const skillWeaponTypeTrait = uniqueTraitIdCache.allocate(pluginName, 0, 'スキル武器タイプ');

function DataManager_SkillWeaponTypeTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.skillWeaponType) {
      this.pushLazyExtractData(data);
    }
  };

  const _lazyExtractMetadata = dataManager.lazyExtractMetadata;
  dataManager.lazyExtractMetadata = function (data) {
    _lazyExtractMetadata.call(this, data);
    if (hasTraits(data) && data.meta.skillWeaponType) {
      this.extractSkillWeaponTypeMeta(data);
    }
  };

  dataManager.extractSkillWeaponTypeMeta = function (data) {
    [...new Set(String(data.meta.skillWeaponType)
      .split(",")
      .map(weaponType => $dataSystem.weaponTypes.indexOf(weaponType.trim()))
      .filter(wtypeId => wtypeId > 0))]
      .forEach(wtypeId => {
        data.traits.push({
          code: skillWeaponTypeTrait.id,
          dataId: wtypeId,
          value: 0,
        });
      });
  };
}

DataManager_SkillWeaponTypeTraitMixIn(DataManager);

function Game_Actor_SkillWeaponTypeTraitMixIn(gameActor: Game_Actor) {
  gameActor.skillWeaponTypeIds = function () {
    return [...new Set(this.traitsSet(skillWeaponTypeTrait.id))];
  };

  const _isSkillWtypeOk = gameActor.isSkillWtypeOk;
  gameActor.isSkillWtypeOk = function (skill) {
    if (_isSkillWtypeOk.call(this, skill)) {
      return true;
    }
    const wtypeIds = this.skillWeaponTypeIds();
    return wtypeIds.includes(skill.requiredWtypeId1)
      || wtypeIds.includes(skill.requiredWtypeId2);
  };
}

Game_Actor_SkillWeaponTypeTraitMixIn(Game_Actor.prototype);
