/// <reference path="../../typings/rmmz.d.ts" />

declare interface BattleManager {
  _isEventBattle: boolean;

  setIsEventBattle(isEventBattle: boolean): void;
  mustDoOnEncounter(): boolean;
}
