/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../FilterEquip/FilterEquip.d.ts" />

declare interface Game_Actor {
  _tempParty?: Game_Party;

  setTempParty(tempParty: Game_Party): void;
  paramPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
  partyAbilityTraitsSum(key: string): number;
  partyAbilityTraitsPi(key: string): number;
}

declare interface Game_Party {
  paramPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
}

declare class EquipFilterBuilder {
  /**
   * FilterEquipの役割とすべきかどうか怪しいので、利用元に暫定的に定義しておく
   */
  static allocateUniqueDataId(pluginName: string, traitId: number, id: number): number;
}
