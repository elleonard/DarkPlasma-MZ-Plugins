/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Battler {
  lowerOrEqualPriorityStateIds(stateId: number): number[];
  isHigherOrEqualPriorityStateAffected(stateId: number): boolean;
}
