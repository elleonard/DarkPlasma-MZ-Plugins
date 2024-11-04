/// <reference path="./AllocateUniqueSpecialFlagId.d.ts" />

class UniqueSpecialFlagIdCache {

  constructor() {
  }

  allocate(pluginName: string, localId: number, name: string): UniqueTraitDataId {
    return uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_SPECIAL_FLAG, localId, name);
  }

  key(pluginName: string, localId: number): string {
    return `${pluginName}_${localId}`;
  }

  nameById(id: number): string|undefined {
    return uniqueTraitDataIdCache.nameByIds(Game_BattlerBase.TRAIT_SPECIAL_FLAG, id);
  }
}

globalThis.uniqueSpecialFlagIdCache = new UniqueSpecialFlagIdCache();
