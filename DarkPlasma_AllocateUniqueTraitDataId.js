// DarkPlasma_AllocateUniqueTraitDataId 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/04 1.0.0 公開
 */

/*:
 * @plugindesc 独自の特徴データIDを確保する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param startId
 * @desc 各種特徴の独自ID始点を定義します。
 * @text 独自ID始点
 * @type struct<uniqueDataIds>
 * @default {"debuffRate":"8","param":"8","xparam":"10","sparam":"10","slotType":"2","specialFlag":"4","partyAbility":"6"}
 *
 * @help
 * version: 1.0.0
 * 独自の特徴データIDを確保し、利用できるようにします。
 */
/*~struct~uniqueDataIds:
 * @param debuffRate
 * @desc 弱体有効度特徴の独自データID始点を定義します。
 * @text 弱体有効度
 * @type number
 * @min 8
 * @default 8
 *
 * @param param
 * @desc 通常能力値特徴の独自データID始点を定義します。
 * @text 通常能力値
 * @type number
 * @min 8
 * @default 8
 *
 * @param xparam
 * @desc 追加能力値特徴の独自データID始点を定義します。
 * @text 追加能力値
 * @type number
 * @min 10
 * @default 10
 *
 * @param sparam
 * @desc 特殊能力値特徴の独自データID始点を定義します。
 * @text 特殊能力値
 * @type number
 * @min 10
 * @default 10
 *
 * @param slotType
 * @desc スロットタイプ特徴の独自データID始点を定義します。
 * @text スロットタイプ
 * @type number
 * @min 2
 * @default 2
 *
 * @param specialFlag
 * @desc 特殊フラグ特徴の独自データID始点を定義します。
 * @text 特殊フラグ
 * @type number
 * @min 4
 * @default 4
 *
 * @param partyAbility
 * @desc パーティ能力特徴の独自データID始点を定義します。
 * @text パーティ能力
 * @type number
 * @min 6
 * @default 6
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startId: pluginParameters.startId
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            debuffRate: Number(parsed.debuffRate || 8),
            param: Number(parsed.param || 8),
            xparam: Number(parsed.xparam || 10),
            sparam: Number(parsed.sparam || 10),
            slotType: Number(parsed.slotType || 2),
            specialFlag: Number(parsed.specialFlag || 4),
            partyAbility: Number(parsed.partyAbility || 6),
          };
        })(pluginParameters.startId)
      : { debuffRate: 8, param: 8, xparam: 10, sparam: 10, slotType: 2, specialFlag: 4, partyAbility: 6 },
  };

  const uniqueDataIds = {
    [Game_BattlerBase.TRAIT_DEBUFF_RATE]: settings.startId.debuffRate,
    [Game_BattlerBase.TRAIT_PARAM]: settings.startId.param,
    [Game_BattlerBase.TRAIT_XPARAM]: settings.startId.xparam,
    [Game_BattlerBase.TRAIT_SPARAM]: settings.startId.sparam,
    [Game_BattlerBase.TRAIT_SLOT_TYPE]: settings.startId.slotType,
    [Game_BattlerBase.TRAIT_SPECIAL_FLAG]: settings.startId.specialFlag,
    [Game_BattlerBase.TRAIT_PARTY_ABILITY]: settings.startId.partyAbility,
  };
  /**
   * データID拡張すべきでない特徴一覧
   * 元々データIDが設定されていなかったり、データベースのIDが設定されているもの
   */
  const traitIdsWithFixedDataIds = [
    Game_BattlerBase.TRAIT_ELEMENT_RATE /* 属性有効度 */,
    Game_BattlerBase.TRAIT_STATE_RATE /* ステート有効度 */,
    Game_BattlerBase.TRAIT_STATE_RESIST /* ステート無効 */,
    Game_BattlerBase.TRAIT_ATTACK_ELEMENT /* 攻撃時属性 */,
    Game_BattlerBase.TRAIT_ATTACK_STATE /* 攻撃時ステート */,
    Game_BattlerBase.TRAIT_ATTACK_SPEED /* 攻撃速度補正 */,
    Game_BattlerBase.TRAIT_ATTACK_TIMES /* 攻撃追加回数 */,
    Game_BattlerBase.TRAIT_ATTACK_SKILL /* 攻撃スキル */,
    Game_BattlerBase.TRAIT_STYPE_ADD /* スキルタイプ追加 */,
    Game_BattlerBase.TRAIT_STYPE_SEAL /* スキルタイプ封印 */,
    Game_BattlerBase.TRAIT_SKILL_ADD /* スキル追加 */,
    Game_BattlerBase.TRAIT_SKILL_SEAL /* スキル封印 */,
    Game_BattlerBase.TRAIT_EQUIP_WTYPE /* 武器タイプ装備 */,
    Game_BattlerBase.TRAIT_EQUIP_ATYPE /* 防具タイプ装備 */,
    Game_BattlerBase.TRAIT_EQUIP_LOCK /* 装備固定 */,
    Game_BattlerBase.TRAIT_EQUIP_SEAL /* 装備封印 */,
    Game_BattlerBase.TRAIT_ACTION_PLUS /* 行動回数追加 */,
  ];
  class UniqueTraitDataIdCache {
    constructor() {
      this._cache = {};
      this._cacheByIds = {};
    }
    allocate(pluginName, traitId, localId, name) {
      this.validateTraitId(traitId);
      const key = this.key(pluginName, traitId, localId);
      if (!this._cache[key]) {
        if (!uniqueDataIds[traitId]) {
          uniqueDataIds[traitId] = 0;
        }
        const dataId = uniqueDataIds[traitId];
        this._cache[key] = new UniqueTraitDataId(dataId, name);
        if (!this._cacheByIds[`${traitId}_${dataId}`]) {
          this._cacheByIds[`${traitId}_${dataId}`] = this._cache[key];
        }
        uniqueDataIds[traitId]++;
      }
      return this._cache[key];
    }
    validateTraitId(traitId) {
      if (traitIdsWithFixedDataIds.includes(traitId)) {
        throw new Error(`特徴ID: ${traitId} は拡張が許可されていません。`);
      }
    }
    key(pluginName, traitId, localId) {
      return `${pluginName}_${traitId}_${localId}`;
    }
    nameByIds(traitId, dataId) {
      const key = `${traitId}_${dataId}`;
      return this._cacheByIds[key] ? this._cacheByIds[key].name : undefined;
    }
  }
  class UniqueTraitDataId {
    constructor(id, name) {
      this._id = id;
      this._name = name;
    }
    get id() {
      return this._id;
    }
    get name() {
      return this._name;
    }
  }
  globalThis.uniqueTraitDataIdCache = new UniqueTraitDataIdCache();
  function Scene_Equip_AllocateUniqueTraitDataIdMixIn(sceneEquip) {
    if ('equipFilterBuilder' in sceneEquip) {
      const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
      sceneEquip.equipFilterBuilder = function (equips) {
        return _equipFilterBuilder.call(this, equips).withTraitToEffectNameRule((traitId, dataId) => {
          return uniqueTraitDataIdCache.nameByIds(traitId, dataId) || null;
        });
      };
    }
  }
  Scene_Equip_AllocateUniqueTraitDataIdMixIn(Scene_Equip.prototype);
})();
