/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_BattlerBase {
  isSwapParamStateAffected(paramId): boolean;
  paramAlias(paramId): number;
  swapParamState(paramId): MZ.State|undefined;
}
