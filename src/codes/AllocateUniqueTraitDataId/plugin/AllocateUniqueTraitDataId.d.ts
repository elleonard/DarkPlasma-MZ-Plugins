/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../FilterEquip/FilterEquip.d.ts" />

declare var uniqueTraitDataIdCache: UniqueTraitDataIdCache;

declare interface UniqueTraitDataIdCache {
  _cache: {
    [key: string]: UniqueTraitDataId;
  };

  allocate(pluginName: string, traitId: number, localId: number, name: string | (() => string)): UniqueTraitDataId;
  key(pluginName: string, traitId: number, localId: number): string;
  nameByIds(traitId: number, dataId: number): string|undefined;
}

declare interface UniqueTraitDataId {
  _id: number;
  _name: string;

  readonly id: number;
  readonly name: string;
}

declare interface Scene_Boot {
  evaluateUniqueTraitDataNames(): void;
}
