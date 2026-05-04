/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitDataId/plugin/AllocateUniqueTraitDataId.d.ts" />

declare interface Game_Action {
  isAntiReverse(): boolean;
}

declare interface Game_ActionResult {
  reverseDeathState: boolean;
}

declare interface Game_BattlerBase {
  _markedAntiReverse: boolean;

  markAntiReverse(): void;
  clearAntiReverse(): void;
  gainHpFull(): void;
}
