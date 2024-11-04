/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />

declare namespace DataManager {
  function parseMultiplyXParamTrait(meta: string): MZ.Trait;
}

declare interface Game_BattlerBase {
  xparamRate(paramId: number): number;
}
