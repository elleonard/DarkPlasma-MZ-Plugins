/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../../FilterEquip/FilterEquip.d.ts" />

declare interface Game_BattlerBase {
  criticalDamageRate(): number;
  defaultCriticalDamageRate(): number;
}

declare namespace Game_BattlerBase {
  var TRAIT_CRITICAL_DAMAGE_RATE: number;
}
