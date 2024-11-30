/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../PartyAbilityTraitExtension/PartyAbilityTraitExtension.d.ts" />

type PartyAbilityTraitType = "paramPlus"|"paramRate"|"xparamPlus"|"xparamRate"|"sparamPlus"|"sparamRate";
type PartyAbilityTraitId = [PartyAbilityTraitType, number];

declare interface Game_Temp {
  _partyAbilityTraitsCache: Map<string, number>;

  partyAbilityTraitsCacheKey(type: PartyAbilityTraitType, paramId: number): string;
  cachePartyAbilityTraits(type: PartyAbilityTraitType, paramId: number, value: number): void;
  cachedPartyAbilityTrait(type: PartyAbilityTraitType, paramId: number): number|undefined;
  clearPartyAbilityTraitsCache(): void;
}

declare interface Game_Party {
  _ignorePartyAbilityCache: boolean|undefined;

  setIgnorePartyAbilityCache(): void;
}

declare interface Game_Actors {
  setEquipsClearCacheMixIn(): void;
}

declare interface Game_Actor {
  setEquipsClearCacheMixIn(): void;
}
