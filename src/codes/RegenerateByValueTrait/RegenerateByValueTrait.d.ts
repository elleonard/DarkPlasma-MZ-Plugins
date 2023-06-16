/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare namespace DataManager {
  function extractRegenerationValueTrait(data: MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy): void;
  function hpRegenerationValueTraitId(): number;
  function mpRegenerationValueTraitId(): number;
}

declare interface Game_Battler {
  totalHpRegenerationValue(): number;
  hpRegenerationValue(customId: number): number;
  totalMpRegenerationValue(): number;
  mpRegenerationValue(customId: number): number;
}
