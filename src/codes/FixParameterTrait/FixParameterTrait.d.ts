/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare interface Game_BattlerBase {
  isParamFixed(paramId: number): boolean;
  fixedParameter(paramId: number): number;

  isXParamFixed(paramId: number): boolean;
  fixedXParameter(paramId: number): number;
}
