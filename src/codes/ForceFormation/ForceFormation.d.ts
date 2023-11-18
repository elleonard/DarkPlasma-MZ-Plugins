/// <reference path="../../typings/rmmz.d.ts" />

declare namespace BattleManager {
  declare interface LogWindow<Battler, Action> {
    displayForceChangedFormation(): void;
  }
}

declare interface BattleManager {
  forceFormation(): void;
}

declare interface Game_Party {
  _forceFormationChanged: boolean;

  forwardMembersAreAllDead(): boolean;
  isForceFormationEnabled(): boolean;
  forceFormation(): void;
  forceFormationChanged(): boolean;
  resetForceFormationChanged(): void;
}

declare interface Game_Map {
  isForceFormationEnabled(): boolean;
}

declare interface Window_BattleLog {
  displayForceChangedFormation(): void;
}
