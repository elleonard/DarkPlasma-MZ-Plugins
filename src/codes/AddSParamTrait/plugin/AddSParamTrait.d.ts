/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />

declare namespace DataManager {
  function parseAddSParamTrait(meta: string): MZ.Trait;
}

declare interface Game_BattlerBase {
  sparamPlus(paramId: number): number;
}
