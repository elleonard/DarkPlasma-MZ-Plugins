/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare interface Game_Temp {
  _syncSelectionEffectRequestedBattlers: Game_Battler[];

  requestSyncSelectionEffect(battler: Game_Battler): void;
  isSyncSelectionEffectRequested(battler: Game_Battler): boolean;
  processSyncSelectionEffect(battler: Game_Battler): void;
}

declare interface Game_Unit {
  selectAll(): void;
}

declare interface Game_Battler {
  resetAllActionsExpandedScope(): void;
}

declare interface Game_Action {
  _isExpandedScope: boolean;
  _enableForAllRate: boolean;

  expandScope(): void;
  resetExpandScope(): void;
  canExpandScope(): boolean;
  isExpandedScope(): boolean;
  isForAllByDefault(): boolean;
  expandedScopeDamageRate(): number;
}

declare interface Scene_ItemBase {
  toggleTargetScope(): void;
}

declare interface Scene_Battle {
  toggleTargetScopeActor(): void;
  toggleTargetScopeEnemy(): void;
}

declare interface Window_MenuActor {
  _currentAction: Game_Action;

  toggleCursorAll(): void;
  canToggleScope(): boolean;
}

declare interface Window_BattleActor {
  unit(): Game_Party;
  currentTarget(): Game_Actor;
  toggleCursorAll(): void;
}

declare interface Window_BattleEnemy {
  unit(): Game_Troop;
  currentTarget(): Game_Enemy;
  toggleCursorAll(): void;
}
