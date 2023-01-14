/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../../common/sprite/toggleButton.d.ts" />
/// <reference path="../ExpandTargetScope/ExpandTargetScope.d.ts" />

declare interface Window_BattleActor {
  _expandScopeButton: Sprite_ExpandTargetScopeButton;

  expandScopeButton(): Sprite_ExpandTargetScopeButton;
  showExpandScopeButton(): void;
  hideExpandScopeButton(): void;
}

declare interface Window_BattleEnemy {
  _expandScopeButton: Sprite_ExpandTargetScopeButton;

  expandScopeButton(): Sprite_ExpandTargetScopeButton;
  showExpandScopeButton(): void;
  hideExpandScopeButton(): void;
}

declare interface Window_MenuActor {
  _expandScopeButton: Sprite_ExpandTargetScopeButton;

  expandScopeButton(): Sprite_ExpandTargetScopeButton;
  showExpandScopeButton(): void;
  hideExpandScopeButton(): void;
}
