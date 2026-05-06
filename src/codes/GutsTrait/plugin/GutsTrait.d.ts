/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />
/// <reference path="../../StateWithValue/plugin/StateWithValue.d.ts" />

declare namespace MZ {
  interface State {
    removeByGutsZero?: boolean;
  }
}

declare namespace DataManager {
  function isGutsState(stateId: number): boolean;
}

declare interface Game_BattlerBase {
  _gutsCount?: number;

  initializeGuts(): void;
  gutsCount(): number;
  addGutsCount(count: number): void;
  decreaseGuts(): void;
  onGutsZero(stateId: number): void;

  minimumGutsCountState(): MZ.State|undefined;
}
