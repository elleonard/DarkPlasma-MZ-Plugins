/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />
/// <reference path="../FilterEquip/FilterEquip.d.ts" />
/// <reference path="../MultiplyXParamTrait/plugin/MultiplyXParamTrait.d.ts" />
/// <reference path="../AddSParamTrait/plugin/AddSParamTrait.d.ts" />

declare namespace DataManager {
  function parsePartyAbility(meta: string): MZ.Trait[];
  function parsePartyAbilityLine(line: string): [MZ.Trait, MZ.Trait];
}

declare interface Game_Actor {
  _tempParty?: Game_Party;

  setTempParty(tempParty: Game_Party): void;
  paramPlusByPartyAbility(paramId: number): number;
  paramRateByPartyAbility(paramId: number): number;
  xparamPlusByPartyAbility(paramId: number): number;
  xparamRateByPartyAbility(paramId: number): number;
  sparamPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
}

declare interface Game_Party {
  paramPlusByPartyAbility(paramId: number): number;
  paramRateByPartyAbility(paramId: number): number;
  xparamPlusByPartyAbility(paramId: number): number;
  xparamRateByPartyAbility(paramId: number): number;
  sparamPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
}
