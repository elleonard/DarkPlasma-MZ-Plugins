// DarkPlasma_EquipTypeStatusBonusTrait 2.3.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/11/12 2.3.0 ステータスボーナスのための武器タイプID、防具タイプID取得用のインターフェース追加
 * 2022/10/29 2.2.0 特徴ID定数を追加
 * 2022/10/22 2.1.0 対象装備差し替え用のインターフェース追加
 *            2.0.0 プラグイン名を変更
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc 装備種別によるステータスボーナス特徴
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
 * version: 2.3.0
 * アクター/職業/武器/防具/ステートのメモ欄に、
 * 指定の形式でメモタグを記述することで
 * 特定の武器・防具タイプを装備していたときに
 * 有効になるステータスボーナス特徴を追加します。
 *
 * 特定武器タイプを装備していた場合に有効なステータスボーナス
 * <weaponTypeBonus:[weaponType]:[statusType]:[value]>
 * 特定防具タイプを装備していた場合に有効なステータスボーナス
 * <armorTypeBonus:[armorType]:[statusType]:[value]>
 *
 * [statusType]:
 *   mhp: 最大HP加算
 *   mmp: 最大MP加算
 *   atk: 攻撃力加算
 *   def: 防御力加算
 *   mat: 魔法攻撃力加算
 *   mdf: 魔法防御力加算
 *   agi: 敏捷性加算
 *   luk: 運加算
 *   hit: 命中率加算
 *   eva: 回避率加算
 *   cri: 会心率加算
 *   cev: 会心回避率加算
 *   mev: 魔法回避率加算
 *   mrf: 魔法反射率加算
 *   cnt: 反撃率加算
 *   hrg: HP再生率加算
 *   mrg: MP再生率加算
 *   trg: TP再生率加算
 *
 * 記述例: 武器タイプ斧装備時に命中率+5％
 * <weaponTypeBonus:斧:hit:5>
 *
 * 記述例: 防具タイプ盾装備時に防御力+10, 回避率+5％
 * <armorTypeBonus:
 *   盾:def:10
 *   盾:eva:5
 * >
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

  const localTraitIdStart = 1;
  const paramPlusWithWeaponTypeTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitIdStart, '武器タイプ能力値');
  const xparamPlusWithWeaponTypeTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitIdStart + 1,
    '武器タイプ追加能力値'
  );
  const paramPlusWithArmorTypeTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitIdStart + 2,
    '防具タイプ能力値'
  );
  const xparamPlusWithArmorTypeTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    localTraitIdStart + 3,
    '防具タイプ追加能力値'
  );
  Game_Battler.TRAIT_PARAM_PLUS_WITH_WEAPON_TYPE = paramPlusWithWeaponTypeTraitId.id;
  Game_Battler.TRAIT_XPARAM_PLUS_WITH_WEAPON_TYPE = xparamPlusWithWeaponTypeTraitId.id;
  Game_Battler.TRAIT_PARAM_PLUS_WITH_ARMOR_TYPE = paramPlusWithArmorTypeTraitId.id;
  Game_Battler.TRAIT_XPARAM_PLUS_WITH_ARMOR_TYPE = xparamPlusWithArmorTypeTraitId.id;
  const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
  const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
  function dataIdFromTypeIdAndParamId(typeId, paramId) {
    return typeId * 10 + paramId;
  }
  class ParamPlusWithEquipTypeTrait {
    constructor(typeName, statusType, value) {
      const typeId = this.types().findIndex((type) => type === typeName.trim());
      if (typeId < 0) {
        throw Error(`存在しない武器・防具タイプが設定されています :${typeName}`);
      }
      if (!PARAM_KEYS.includes(statusType) && !XPARAM_KEYS.includes(statusType)) {
        throw Error(`不正なステータスが設定されています :${statusType}`);
      }
      this._typeId = typeId;
      this._statusType = statusType;
      this._value = value;
    }
    static fromTag(tag) {
      const traitParams = tag.split(':');
      const clazz = this;
      return new clazz(traitParams[0], traitParams[1], Number(traitParams[2]));
    }
    types() {
      return [];
    }
    traitId() {
      return 0;
    }
    /**
     * タイプIDと能力値IDの両方の情報を強引に含める
     */
    dataId() {
      return dataIdFromTypeIdAndParamId(this._typeId, this.paramId());
    }
    paramId() {
      return this.isXParam() ? XPARAM_KEYS.indexOf(this._statusType) : PARAM_KEYS.indexOf(this._statusType);
    }
    trait() {
      return {
        code: this.traitId(),
        dataId: this.dataId(),
        value: this.isXParam() ? this._value / 100 : this._value,
      };
    }
    isXParam() {
      return XPARAM_KEYS.includes(this._statusType);
    }
  }
  class ParamPlusWithWeaponTypeTrait extends ParamPlusWithEquipTypeTrait {
    types() {
      return $dataSystem?.weaponTypes || [];
    }
    traitId() {
      return this.isXParam() ? xparamPlusWithWeaponTypeTraitId.id : paramPlusWithWeaponTypeTraitId.id;
    }
  }
  class ParamPlusWithArmorTypeTrait extends ParamPlusWithEquipTypeTrait {
    types() {
      return $dataSystem?.armorTypes || [];
    }
    traitId() {
      return this.isXParam() ? xparamPlusWithArmorTypeTraitId.id : paramPlusWithArmorTypeTraitId.id;
    }
  }
  function DataManager_EquipTypeStatusBonusTraitMixIn(dataManager) {
    dataManager.loadExtraTraits = function () {
      this._databaseFiles
        .map((database) => globalThis[database.name])
        .forEach((database) => {
          if (Array.isArray(database)) {
            database.forEach((data) => {
              if (data && 'note' in data) {
                this.extractExtraTraits(data);
              }
            });
          }
        });
    };
    dataManager.extractExtraTraits = function (data) {
      if (hasTraits(data)) {
        if (data.meta.weaponTypeBonus) {
          String(data.meta.weaponTypeBonus)
            .split('\n')
            .filter((bonus) => bonus)
            .map((bonus) => ParamPlusWithWeaponTypeTrait.fromTag(bonus).trait())
            .forEach((trait) => data.traits.push(trait));
        }
        if (data.meta.armorTypeBonus) {
          String(data.meta.armorTypeBonus)
            .split('\n')
            .filter((bonus) => bonus)
            .map((bonus) => ParamPlusWithArmorTypeTrait.fromTag(bonus).trait())
            .forEach((trait) => data.traits.push(trait));
        }
      }
    };
    dataManager.weaponTypeIdForStatusBonusTrait = function (weapon) {
      return weapon.wtypeId;
    };
    dataManager.armorTypeIdForStatusBonusTrait = function (armor) {
      return armor.atypeId;
    };
  }
  DataManager_EquipTypeStatusBonusTraitMixIn(DataManager);
  function Scene_Boot_EquipTypeStatusBonusTraitMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      this.loadExtraTraits();
    };
    /**
     * 装備種別によるボーナス特徴は、装備種別一覧を含む $dataSystem がロード済みであることがロードの前提
     * データベースのロードが完了した後に、metaを加工してtraitsを追加する
     */
    sceneBoot.loadExtraTraits = function () {
      DataManager.loadExtraTraits();
    };
  }
  Scene_Boot_EquipTypeStatusBonusTraitMixIn(Scene_Boot.prototype);
  function Game_Actor_EquipTypeStatusBonusTraitMixIn(gameActor) {
    const _paramPlus = gameActor.paramPlus;
    gameActor.paramPlus = function (paramId) {
      return _paramPlus.call(this, paramId) + this.paramPlusWithEquipTypeTraits(paramId);
    };
    gameActor.paramPlusWithEquipTypeTraits = function (paramId) {
      return this.validParamPlusWithEquipTypeTraits(paramId).reduce((result, trait) => result + trait.value, 0);
    };
    gameActor.equipsForEquipTypeStatusBonus = function () {
      return this.equips();
    };
    gameActor.validParamPlusWithEquipTypeTraits = function (paramId) {
      return this.equipsForEquipTypeStatusBonus()
        .filter((equip) => equip)
        .reduce((result, equip) => {
          const dataId = DataManager.isWeapon(equip)
            ? dataIdFromTypeIdAndParamId(DataManager.weaponTypeIdForStatusBonusTrait(equip), paramId)
            : dataIdFromTypeIdAndParamId(DataManager.armorTypeIdForStatusBonusTrait(equip), paramId);
          const traitId = DataManager.isWeapon(equip)
            ? paramPlusWithWeaponTypeTraitId.id
            : paramPlusWithArmorTypeTraitId.id;
          return result.concat(this.traitsWithId(traitId, dataId));
        }, []);
    };
    const _xparam = gameActor.xparam;
    gameActor.xparam = function (xparamId) {
      return _xparam.call(this, xparamId) + this.xparamPlusWithEquipTypeTraits(xparamId);
    };
    gameActor.xparamPlusWithEquipTypeTraits = function (xparamId) {
      return this.validXParamPlusWithEquipTypeTraits(xparamId).reduce((result, trait) => result + trait.value, 0);
    };
    gameActor.validXParamPlusWithEquipTypeTraits = function (xparamId) {
      return this.equipsForEquipTypeStatusBonus()
        .filter((equip) => equip)
        .reduce((result, equip) => {
          const dataId = DataManager.isWeapon(equip)
            ? dataIdFromTypeIdAndParamId(DataManager.weaponTypeIdForStatusBonusTrait(equip), xparamId)
            : dataIdFromTypeIdAndParamId(DataManager.armorTypeIdForStatusBonusTrait(equip), xparamId);
          const traitId = DataManager.isWeapon(equip)
            ? xparamPlusWithWeaponTypeTraitId.id
            : xparamPlusWithArmorTypeTraitId.id;
          return result.concat(this.traitsWithId(traitId, dataId));
        }, []);
    };
  }
  Game_Actor_EquipTypeStatusBonusTraitMixIn(Game_Actor.prototype);
})();
