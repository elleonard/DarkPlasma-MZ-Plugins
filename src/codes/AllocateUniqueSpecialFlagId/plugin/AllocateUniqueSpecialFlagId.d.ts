/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../FilterEquip/FilterEquip.d.ts" />

declare let uniqueSpecialFlagId: number;
declare var uniqueSpecialFlagIdCache: UniqueSpecialFlagIdCache;

declare class UniqueSpecialFlagId {
  _id: number;
  _name: string;

  readonly id: number;
  readonly name: string;
}

declare class UniqueSpecialFlagIdCache {
  _cache: {
    [key: string]: UniqueSpecialFlagId;
  };
  _cacheById: {
    [id: number]: UniqueSpecialFlagId;
  };

  allocate(pluginName: string, localId: number, name: string): UniqueSpecialFlagId;
  key(pluginName: string, localId: number): string;
  nameById(id: number): string|undefined;
}
