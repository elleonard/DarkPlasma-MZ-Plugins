/// <reference path="./AllocateUniqueHitType.d.ts" />

import { settings } from '../config/_build/DarkPlasma_AllocateUniqueHitType_parameters';

let uniqueHitTypeId = settings.startId;

class UniqueHitTypeIdCache {
  _cache: {
    [key: string]: UniqueHitTypeId;
  };
  _cacheById: {
    [id: number]: UniqueHitTypeId;
  };

  constructor() {
    this._cache = {};
    this._cacheById = {};
  }

  allocate(pluginName: string, localId: number, name: string) {
    const key = this.key(pluginName, localId);
    if (!this._cache[key]) {
      this._cache[key] = new UniqueHitTypeId(uniqueHitTypeId, name);
      this._cacheById[uniqueHitTypeId] = this._cache[key];
      uniqueHitTypeId++;
    }
    return this._cache[key];
  }

  key(pluginName: string, localId: number): string {
    return `${pluginName}_${localId}`;
  }
}

const uniqueHitTypeIdCache = new UniqueHitTypeIdCache();
globalThis.uniqueHitTypeIdCache = uniqueHitTypeIdCache;

class UniqueHitTypeId {
  constructor(private _id: number, private _name: string) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}

function Game_Action_HitTypeMixIn(gameAction: Game_Action) {
  gameAction.isHitType = function (hitTypeId) {
    return this.item()?.hitType === hitTypeId;
  }
}

Game_Action_HitTypeMixIn(Game_Action.prototype);
