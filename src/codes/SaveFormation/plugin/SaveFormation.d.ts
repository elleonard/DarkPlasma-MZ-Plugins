/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Party {
  _savedMemberFormations?: {[key: string]: number[]};

  initializeMemberFormations(): void;
  saveMemberFormation(key: string): void;
  loadMemberFormation(key: string): void;
}
