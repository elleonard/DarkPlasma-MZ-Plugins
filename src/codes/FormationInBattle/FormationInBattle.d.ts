/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface Scene_Battle {
  _formationStatusWindow: Window_FormationStatus;

  createFormationStatusWindow(): void;
  waitingMemberWindowHeight(): number;
}
