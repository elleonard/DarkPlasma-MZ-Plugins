/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/plugin/AllocateUniqueTraitId.d.ts" />
/// <reference path="../../FilterEquip/plugin/FilterEquip.d.ts" />
/// <reference path="../../MultiplyXParamTrait/plugin/MultiplyXParamTrait.d.ts" />
/// <reference path="../../AddSParamTrait/plugin/AddSParamTrait.d.ts" />
/// <reference path="../../LazyExtractData/plugin/LazyExtractData.d.ts" />

declare namespace DataManager {
  function parsePartyAbility(meta: string): MZ.Trait[];
  function parsePartyAbilityLine(line: string): MZ.Trait[];
}

declare interface Game_BattlerBase {
  paramPlusByPartyAbility(paramId: number): number;
  paramRateByPartyAbility(paramId: number): number;
  xparamPlusByPartyAbility(paramId: number): number;
  xparamRateByPartyAbility(paramId: number): number;
  sparamPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
  elementRateByPartyAbility(elementId: number): number;
  elementRatePlusByPartyAbility(elementId: number): number;
  stateRateByPartyAbility(stateId: number): number;
  stateRatePlusByPartyAbility(stateId: number): number;
}

declare interface Game_Actor {
  _tempParty?: Game_Party;

  setTempParty(tempParty: Game_Party): void;
}

declare interface Game_Party {
  paramPlusByPartyAbility(paramId: number): number;
  paramRateByPartyAbility(paramId: number): number;
  xparamPlusByPartyAbility(paramId: number): number;
  xparamRateByPartyAbility(paramId: number): number;
  sparamPlusByPartyAbility(paramId: number): number;
  sparamRateByPartyAbility(paramId: number): number;
  elementRateByPartyAbility(elementId: number): number;
  elementRatePlusByPartyAbility(elementId: number): number;
  stateRateByPartyAbility(stateId: number): number;
  stateRatePlusByPartyAbility(stateId: number): number;
}
