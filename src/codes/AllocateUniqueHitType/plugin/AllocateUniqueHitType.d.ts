/// <reference path="../../../typings/rmmz.d.ts" />

declare let uniqueHitTypeId: number;
declare var uniqueHitTypeIdCache: UniqueHitTypeIdCache;

declare class UniqueHitTypeId {
  id: number;
  name: string;
}

declare class UniqueHitTypeIdCache {
  _cache: {
    [key: string]: UniqueHitTypeId;
  };
  _cacheById: {
    [id: number]: UniqueHitTypeId;
  };

  allocate(pluginName: string, localId: number, name: string): UniqueHitTypeId;
  key(pluginName: string, localId: number): string;
}

declare interface Game_Action {
  isHitType(hitTypeId: number): boolean;
}