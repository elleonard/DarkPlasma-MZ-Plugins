/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Party {
  _savedMemberFormations?: Map<string, number[]>;

  initializeMemberFormations(): void;
  saveMemberFormation(key: string): void;
  loadMemberFormation(key: string): void;
}
