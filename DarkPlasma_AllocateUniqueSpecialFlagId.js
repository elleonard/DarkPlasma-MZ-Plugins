// DarkPlasma_AllocateUniqueSpecialFlagId 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/02 1.0.0 公開
 */

/*:
 * @plugindesc 独自の特殊フラグ特徴のIDを確保する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param startIdOfUniqueSpecialFlagId
 * @desc 独自に特殊フラグIDを確保する際の始点ID。わからない場合はそのままにしてください。
 * @text 独自特殊フラグID始点
 * @type number
 * @default 11
 *
 * @help
 * version: 1.0.0
 * 特殊フラグ特徴のIDを確保し、利用できるようにします。
 *
 * 本プラグインは単体では機能しません。
 * 本プラグインを必要とする別のプラグインと一緒に利用してください。
 *
 * 以下、プラグインの開発者向けの情報です。
 * uniqueSpecialFlagIdCache オブジェクトに対してリクエストを投げてください。
 *
 * uniqueSpecialFlagIdCache.allocate
 *   : (pluginName: string, localId: number, name: string) => UniqueSpecialFlagId
 *   プラグインで独自の特殊フラグIDを確保します。
 *
 * UniqueSpecialFlagId.prototype.id: number
 *   確保した特殊フラグID
 *
 * UniqueSpecialFlagId.prototype.name: string
 *   確保した特殊フラグIDの名前
 *
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startIdOfUniqueSpecialFlagId: Number(pluginParameters.startIdOfUniqueSpecialFlagId || 11),
  };

  let uniqueSpecialFlagId = settings.startIdOfUniqueSpecialFlagId;
  class UniqueSpecialFlagIdCache {
    constructor() {
      this._cache = {};
      this._cacheById = {};
    }
    allocate(pluginName, localId, name) {
      const key = this.key(pluginName, localId);
      if (!this._cache[key]) {
        this._cache[key] = new UniqueSpecialFlagId(uniqueSpecialFlagId, name);
        this._cacheById[uniqueSpecialFlagId] = this._cache[key];
        uniqueSpecialFlagId++;
      }
      return this._cache[key];
    }
    key(pluginName, localId) {
      return `${pluginName}_${localId}`;
    }
    nameById(id) {
      return this._cacheById[id] ? this._cacheById[id].name : undefined;
    }
  }
  globalThis.uniqueSpecialFlagIdCache = new UniqueSpecialFlagIdCache();
  class UniqueSpecialFlagId {
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
  function Scene_Equip_AllocateUniqueSpecialFlagIdMixIn(sceneEquip) {
    if ('equipFilterBuilder' in sceneEquip) {
      const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
      sceneEquip.equipFilterBuilder = function (equips) {
        return _equipFilterBuilder.call(this, equips).withTraitToEffectNameRule((traitId, dataId) => {
          if (traitId === Game_BattlerBase.TRAIT_SPECIAL_FLAG) {
            return uniqueSpecialFlagIdCache.nameById(dataId) || null;
          }
          return null;
        });
      };
    }
  }
  Scene_Equip_AllocateUniqueSpecialFlagIdMixIn(Scene_Equip.prototype);
})();
