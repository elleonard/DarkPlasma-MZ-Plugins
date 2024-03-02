/// <reference path="./AllocateUniqueSpecialFlagId.d.ts" />

import { settings } from '../config/_build/DarkPlasma_AllocateUniqueSpecialFlagId_parameters';

let uniqueSpecialFlagId = settings.startIdOfUniqueSpecialFlagId;

class UniqueSpecialFlagIdCache {
  _cache: {
    [key: string]: UniqueSpecialFlagId;
  };
  _cacheById: {
    [key: number]: UniqueSpecialFlagId;
  };

  constructor() {
    this._cache = {};
    this._cacheById = {};
  }

  allocate(pluginName: string, localId: number, name: string): UniqueSpecialFlagId {
    const key = this.key(pluginName, localId);
    if (!this._cache[key]) {
      this._cache[key] = new UniqueSpecialFlagId(uniqueSpecialFlagId, name);
      this._cacheById[uniqueSpecialFlagId] = this._cache[key];
      uniqueSpecialFlagId++;
    }
    return this._cache[key];
  }

  key(pluginName: string, localId: number): string {
    return `${pluginName}_${localId}`;
  }

  nameById(id: number): string|undefined {
    return this._cacheById[id] ? this._cacheById[id].name : undefined;
  }
}

globalThis.uniqueSpecialFlagIdCache = new UniqueSpecialFlagIdCache();

class UniqueSpecialFlagId {
  _id: number;
  _name: string;

  constructor(id: number, name: string) {
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

function Scene_Equip_AllocateUniqueSpecialFlagIdMixIn(sceneEquip: Scene_Equip) {
  if ("equipFilterBuilder" in sceneEquip) {
    const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
    sceneEquip.equipFilterBuilder = function (equips) {
      return _equipFilterBuilder.call(this, equips)
        .withTraitToEffectNameRule((traitId, dataId) => {
          if (traitId === Game_BattlerBase.TRAIT_SPECIAL_FLAG) {
            return uniqueSpecialFlagIdCache.nameById(dataId) || null;
          }
          return null;
        });
    };
  }
}

Scene_Equip_AllocateUniqueSpecialFlagIdMixIn(Scene_Equip.prototype);
