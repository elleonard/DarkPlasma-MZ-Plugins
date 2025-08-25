// DarkPlasma_SkillWeaponTypeTrait 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/25 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc スキル必要武器タイプを満たす特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @base DarkPlasma_LazyExtractData
 * @orderAfter DarkPlasma_LazyExtractData
 *
 * @help
 * version: 1.0.0
 * アクター等、特徴を設定できるデータのメモ欄に以下のように記述します。
 * <skillWeaponType:剣>
 * スキルの必要武器を判定する際に
 * 武器タイプ剣を装備していると扱われる特徴を設定します。
 *
 * <skillWeaponType:剣,槍>
 * 複数指定したい場合はカンマで区切ります。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.2
 * DarkPlasma_LazyExtractData version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_LazyExtractData
 */

(() => {
  'use strict';

  function hasTraits(data) {
    return 'traits' in data;
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const skillWeaponTypeTrait = uniqueTraitIdCache.allocate(pluginName, 0, 'スキル武器タイプ');
  function DataManager_SkillWeaponTypeTraitMixIn(dataManager) {
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
      [
        ...new Set(
          String(data.meta.skillWeaponType)
            .split(',')
            .map((weaponType) => $dataSystem.weaponTypes.indexOf(weaponType.trim()))
            .filter((wtypeId) => wtypeId > 0),
        ),
      ].forEach((wtypeId) => {
        data.traits.push({
          code: skillWeaponTypeTrait.id,
          dataId: wtypeId,
          value: 0,
        });
      });
    };
  }
  DataManager_SkillWeaponTypeTraitMixIn(DataManager);
  function Game_Actor_SkillWeaponTypeTraitMixIn(gameActor) {
    gameActor.skillWeaponTypeIds = function () {
      return [...new Set(this.traitsSet(skillWeaponTypeTrait.id))];
    };
    const _isSkillWtypeOk = gameActor.isSkillWtypeOk;
    gameActor.isSkillWtypeOk = function (skill) {
      if (_isSkillWtypeOk.call(this, skill)) {
        return true;
      }
      const wtypeIds = this.skillWeaponTypeIds();
      return wtypeIds.includes(skill.requiredWtypeId1) || wtypeIds.includes(skill.requiredWtypeId2);
    };
  }
  Game_Actor_SkillWeaponTypeTraitMixIn(Game_Actor.prototype);
})();
