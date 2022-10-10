/// <reference path="../../typings/rmmz/rmmz.d.ts" />

type StateGroupSetting = { name: string; states: number[] };

declare interface Game_Battler {
  lowerPriorityStateIds(stateId: number): number[];
  isHigherOrEqualPriorityStateAffected(stateId: number): boolean;
}
