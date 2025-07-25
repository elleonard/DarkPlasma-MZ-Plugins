/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />

declare namespace DataManager {
  function parseAddSParamTraits(meta: string): MZ.Trait[];
  function parseAddSParamTrait(line: string): MZ.Trait;
  function sparamKeyToSParamId(key: string): number;
  function sparamIdToAddSparamDataId(paramId: number): number;
}

declare interface Game_BattlerBase {
  sparamPlus(paramId: number): number;
}
