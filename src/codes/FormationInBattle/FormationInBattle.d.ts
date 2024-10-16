/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../Formation/Formation.d.ts" />
/// <reference path="../Formation/FormationExport.d.ts" />

declare interface Game_Map {
  isFormationInBattleEnabled(): boolean;
}

declare interface Scene_Battle {
  _formationHelpWindow: Window_Help;
  _formationStatusWindow: Window_FormationStatus;
  _formationBattleMemberWindow: Window_FormationBattleMember;
  _formationWaitingMemberWindow: Window_FormationWaitingMember;

  _currentWindow: Window_FormationMember;
  _pendingWindow: Window_FormationMember|undefined

  _cancelButton: Sprite_Button;

  createFormationWindows(): void;
  createFormationHelpWindow(): void;
  createFormationBattleMemberWindow(): void;
  createFormationWaitingMemberWindow(): void;
  createFormationStatusWindow(): void;
  hideFormationWindows(): void;
  setupFormationWindows(): void;

  formationHelpWindow(): Window_Help;
  formationStatusWindow(): Window_FormationStatus;
  formationBattleMemberWindow(): Window_FormationBattleMember;
  formationWaitingMemberWindow(): Window_FormationWaitingMember;
  formationStatusParamsWindow(): null;
  formationEquipStatusWindow(): null;
  pendingWindow(): Window_FormationMember|undefined;
  currentActiveWindow(): Window_FormationMember;

  formationHelpWindowRect(): Rectangle;
  formationStatusWindowRect(): Rectangle;
  formationBattleMemberWindowRect(): Rectangle;
  formationWaitingMemberWindowRect(): Rectangle;

  formationStatusWindowWidth(): number;
  formationStatusWindowHeight(): number;
  formationStatusParamsWindowHeight(): number;
  battleMemberWindowWidth(): number;
  waitingMemberWindowHeight(): number;
  cancelButtonWidth(): number;

  showFormationWindows(): void;
  commandFormation(): void;
  onFormationOk(): void;
  onFormationCancel(): void;
  quitFromFormation(): void;

  activateBattleMemberWindow(): void;
  activateWaitingMemberWindow(): void;
  targetIndexOfActivateBattleMember(): number;
  targetIndexOfActivateWaitingMember(): number;
  
  activateBattleMemberWindowByHover(): void;
  activateWaitingMemberWindowByHover(): void;

  moveCancelButtonToEdge(): void;
  returnCancelButton(): void;
}

declare interface Window_FormationMember extends Window_StatusBase {
  public constructor(rect: Rectangle, ...args: any[]);
}

declare class Window_FormationStatus extends Window_StatusBase {
}

declare class Window_FormationWaitingMember extends Window_FormationMember {
  public constructor(rect: Rectangle, ...args: any[]);
}

declare class Window_FormationBattleMember extends Window_FormationMember {
  public constructor(rect: Rectangle, ...args: any[]);
}

declare interface Window_PartyCommand {
  addCommandAt(index: number, name: string, symbol: string, enabled?: boolean, ext?: any|null): void;
  isFormationEnabled(): boolean;
}
