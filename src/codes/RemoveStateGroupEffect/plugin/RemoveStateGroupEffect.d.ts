/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../StateGroup2/plugin/StateGroup2.d.ts" />
/// <reference path="../../AllocateUniqueEffectCode/AllocateUniqueEffectCode.d.ts" />

declare interface Game_Action {
  itemEffectRemoveStateGroup(target: Game_Battler, effect: MZ.Effect): void;
}
