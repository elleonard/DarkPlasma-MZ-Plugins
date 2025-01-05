/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../../MultiElementAction/MultiElementAction.d.ts" />

declare namespace DataManager {
  var _reservedExtractingElementDamageBonusTraitsNoteHolders: (MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy)[];
  function extractElementDamageBonusTraits(): void;
  function extractElementDamageBonusTraitsSub(meta: string): MZ.Trait[];
}

declare interface Game_Action {
  elementDamageBonus(elements: number[]): number;
}
