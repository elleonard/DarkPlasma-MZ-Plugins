/// <reference path="../../typings/rmmz/rmmz.d.ts" />
declare let uniqueTraitId: number;
declare var uniqueTraitIdCache: UniqueTraitIdCache;

declare class UniqueTraitId {
  _id: number;
  _name: string;

  id: number;
  name: string;
}

declare class UniqueTraitIdCache {
  _cache: {
    [key: string]: UniqueTraitId
  };
  _cacheById: {
    [id: number]: UniqueTraitId
  };

  allocate(pluginName: string, localId: number, name: string): UniqueTraitId;
  key(pluginName: string, localId: number): string;
  traitIdOf(pluginName: string, localId: number): number|undefined;
  nameOf(pluginName: string, localId: number): string|undefined;
  nameByTraitId(id: number): string|undefined;
}
