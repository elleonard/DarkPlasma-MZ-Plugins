/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueEffectCode/AllocateUniqueEffectCode.d.ts" />

declare interface Game_Action {
  calcTpDamage(target: Game_Battler, effect: MZ.Effect): number;
}
