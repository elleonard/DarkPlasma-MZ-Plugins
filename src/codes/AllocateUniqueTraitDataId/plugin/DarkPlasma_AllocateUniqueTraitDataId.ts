/// <reference path="./AllocateUniqueTraitDataId.d.ts" />

import { settings } from '../config/_build/DarkPlasma_AllocateUniqueTraitDataId_parameters';

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
  Game_BattlerBase.TRAIT_ELEMENT_RATE,  /* 属性有効度 */
  Game_BattlerBase.TRAIT_STATE_RATE,    /* ステート有効度 */
  Game_BattlerBase.TRAIT_STATE_RESIST,  /* ステート無効 */
  Game_BattlerBase.TRAIT_ATTACK_ELEMENT,/* 攻撃時属性 */
  Game_BattlerBase.TRAIT_ATTACK_STATE,  /* 攻撃時ステート */
  Game_BattlerBase.TRAIT_ATTACK_SPEED,  /* 攻撃速度補正 */
  Game_BattlerBase.TRAIT_ATTACK_TIMES,  /* 攻撃追加回数 */
  Game_BattlerBase.TRAIT_ATTACK_SKILL,  /* 攻撃スキル */
  Game_BattlerBase.TRAIT_STYPE_ADD,     /* スキルタイプ追加 */
  Game_BattlerBase.TRAIT_STYPE_SEAL,    /* スキルタイプ封印 */
  Game_BattlerBase.TRAIT_SKILL_ADD,     /* スキル追加 */
  Game_BattlerBase.TRAIT_SKILL_SEAL,    /* スキル封印 */
  Game_BattlerBase.TRAIT_EQUIP_WTYPE,   /* 武器タイプ装備 */
  Game_BattlerBase.TRAIT_EQUIP_ATYPE,   /* 防具タイプ装備 */
  Game_BattlerBase.TRAIT_EQUIP_LOCK,    /* 装備固定 */
  Game_BattlerBase.TRAIT_EQUIP_SEAL,    /* 装備封印 */
  Game_BattlerBase.TRAIT_ACTION_PLUS,   /* 行動回数追加 */
];

class UniqueTraitDataIdCache {
  _cache: {
    [key: string]: UniqueTraitDataId;
  };
  _cacheByIds: {
    [ids: string]: UniqueTraitDataId;
  };

  constructor() {
    this._cache = {};
    this._cacheByIds = {};
  }

  allocate(pluginName: string, traitId: number, localId: number, name: string|(() => string)): UniqueTraitDataId {
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

  validateTraitId(traitId: number): void {
    if (traitIdsWithFixedDataIds.includes(traitId)) {
      throw new Error(`特徴ID: ${traitId} は拡張が許可されていません。`);
    }
  }

  key(pluginName: string, traitId: number, localId: number): string {
    return `${pluginName}_${traitId}_${localId}`;
  }

  nameByIds(traitId: number, dataId: number): string | undefined {
    const key = `${traitId}_${dataId}`;
    return this._cacheByIds[key] ? this._cacheByIds[key].name : undefined;
  }
}

class UniqueTraitDataId {
  _id: number;
  _name: string;
  _lazyName: () => string;

  constructor(id: number, name: string | (() => string)) {
    this._id = id;
    if (typeof name === "function") {
      this._name = "";
      this._lazyName = name;
      lazyEvaluationTargets.push(this);
    } else {
      this._name = name;
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  evaluateName() {
    this._name = this._lazyName();
  }
}

globalThis.uniqueTraitDataIdCache = new UniqueTraitDataIdCache();

const lazyEvaluationTargets: UniqueTraitDataId[] = [];

function Scene_Boot_AllocateUniqueTraitDataIdMixIn(sceneBoot: Scene_Boot) {
  const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
  sceneBoot.onDatabaseLoaded = function () {
    _onDatabaseLoaded.call(this);
    this.evaluateUniqueTraitDataNames();
  };

  sceneBoot.evaluateUniqueTraitDataNames = function () {
    lazyEvaluationTargets.forEach(dataId => dataId.evaluateName());
  };
}

Scene_Boot_AllocateUniqueTraitDataIdMixIn(Scene_Boot.prototype);

function Scene_Equip_AllocateUniqueTraitDataIdMixIn(sceneEquip: Scene_Equip) {
  if ("equipFilterBuilder" in sceneEquip) {
    const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
    sceneEquip.equipFilterBuilder = function (equips) {
      return _equipFilterBuilder.call(this, equips)
        .withTraitToEffectNameRule((traitId, dataId) => {
          return uniqueTraitDataIdCache.nameByIds(traitId, dataId) || null;
        });
    };
  }
}

Scene_Equip_AllocateUniqueTraitDataIdMixIn(Scene_Equip.prototype);

