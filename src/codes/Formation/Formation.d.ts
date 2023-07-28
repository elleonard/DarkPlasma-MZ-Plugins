/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../ForceFormation/ForceFormation.d.ts" />

declare interface GenericSceneManager<T extends Stage> {
  isPreviousSceneExtendsMenuBase(): boolean;
}

declare interface Game_Temp {
  _needsFormationBattleMemberWindowRefresh: boolean;
  _needsFormationWaitingMemberWindowRefresh: boolean;

  requestFormationMemberWindowsRefresh(): void;
  clearFormationBattleMemberWindowRefreshRequest(): void;
  clearFormationWaitingMemberWindowRefreshRequest(): void;
  isFormationBattleMemberWindowRefreshRequested(): boolean;
  isFormationWaitingMemberWindowRefreshRequested(): boolean;
}

declare interface Scene_Formation extends Scene_FormationMixInClass {
  _helpWindow: Window_Help;
  _statusWindow: Window_FormationStatus;
  _statusParamsWindow: Window_StatusParams;
  _equipWindow: Window_StatusEquip;
  _battleMemberWindow: Window_FormationBattleMember;
  _waitingMemberWindow: Window_FormationWaitingMember;
  _equipSkillWindow: Window_EquipSpecialSkill;
  _rateWindow: Window_ActorStatusRate;
  _backgroundOverlaySprite: Sprite;

  createBackground(): void;
  createEquipSpecialSkillWindow(): void;
  createStatusRateWindow(): void;
  equipSpecialSkillWindowRect(): Rectangle;
  rateWindowRect(): Rectangle;
  waitingMemberWindowHeight(): number;
  toggleParamWindow(): void;
}

declare interface Window_FormationMember extends Window_StatusBase {

}

declare interface Window_FormationBattleMember extends Window_FormationMember {

}

declare interface Window_FormationWaitingMember extends Window_FormationMember {

}

declare interface Window_FormationSelect {
  actor(): Game_Actor;
}

declare interface Window_FormationStatus {

}

declare class Scene_FormationMixInClass extends Scene_Base {
  _currentWindow: Window_FormationMember;
  _pendingWindow: Window_FormationMember|undefined;

  helpWindowRect(): Rectangle;
  statusWindowRect(): Rectangle;
  formationStatusWindowWidth(): number;
  formationStatusWindowHeight(): number;
  battleMemberWindowRect(): Rectangle;
  battleMemberWindowWidth(): number;
  waitingMemberWindowRect(): Rectangle;
  waitingMemberWindowHeight(): number;
  cancelButtonWidth(): number;

  formationHelpWindow(): Window_Help;
  formationBattleMemberWindow(): Window_FormationBattleMember;
  formationWaitingMemberWindow(): Window_FormationWaitingMember;
  currentActiveWindow(): Window_FormationMember;
  pendingWindow(): Window_FormationMember|undefined;

  formationStatusWindow(): Window_FormationStatus;
  formationStatusParamsWindow(): Window_StatusParams;
  formationEquipStatusWindow(): Window_StatusEquip;
  setupFormationWindows(): void;

  activateBattleMemberWindow(): void;
  activateWaitingMemberWindow(): void;
  targetIndexOfActivateBattleMember(): number;
  targetIndexOfActivateWaitingMember(): number;

  onFormationOk(): void;
  onFormationCancel(): void;
  quitFromFormation(): void;
}
