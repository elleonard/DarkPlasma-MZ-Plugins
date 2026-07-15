// DarkPlasma_AllocateUniqueHitType 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/07/15 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 独自の命中タイプのIDを確保する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param startId
 * @desc 命中タイプの独自ID始点を設定します。
 * @text 独自ID始点
 * @type number
 * @default 3
 *
 * @help
 * version: 1.0.0
 * 独自の命中タイプIDを確保し、利用できるようにします。
 *
 * 本プラグインは単体では機能しません。
 * 本プラグインを必要とする別のプラグインと一緒に利用してください。
 *
 * 以下、プラグインの開発者向けの情報です。
 * uniqueHitypeIdCache オブジェクトに対してリクエストを投げてください。
 *
 * uniqueHitTypeIdCache.allocate
 *   : (pluginName: string, traitId: number, localId: number, name: string) => UniqueHitTypeId
 *   プラグインで独自の命中タイプIDを確保します。
 *
 * UniqueHitTypeId.prototype.id: number
 *   確保した命中タイプID
 *
 * UniqueHitTypeId.prototype.name: string
 *   確保した命中タイプIDの名前
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startId: Number(pluginParameters.startId || 3),
  };

  let uniqueHitTypeId = settings.startId;
  class UniqueHitTypeIdCache {
    constructor() {
      this._cache = {};
      this._cacheById = {};
    }
    allocate(pluginName, localId, name) {
      const key = this.key(pluginName, localId);
      if (!this._cache[key]) {
        this._cache[key] = new UniqueHitTypeId(uniqueHitTypeId, name);
        this._cacheById[uniqueHitTypeId] = this._cache[key];
        uniqueHitTypeId++;
      }
      return this._cache[key];
    }
    key(pluginName, localId) {
      return `${pluginName}_${localId}`;
    }
  }
  const uniqueHitTypeIdCache = new UniqueHitTypeIdCache();
  globalThis.uniqueHitTypeIdCache = uniqueHitTypeIdCache;
  class UniqueHitTypeId {
    constructor(_id, _name) {
      this._id = _id;
      this._name = _name;
    }
    get id() {
      return this._id;
    }
    get name() {
      return this._name;
    }
  }
  function Game_Action_HitTypeMixIn(gameAction) {
    gameAction.isHitType = function (hitTypeId) {
      return this.item()?.hitType === hitTypeId;
    };
  }
  Game_Action_HitTypeMixIn(Game_Action.prototype);
})();
