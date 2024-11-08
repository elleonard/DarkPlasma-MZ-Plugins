/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Temp {
  _actionSubTargets: Map<number, Game_Battler[]>;
  _actionId: number;

  allocateActionId(): number;
  markAsSubTarget(action: Game_Action, target: Game_Battler): void;
  isBattlerSubTargetOf(action: Game_Action, target: Game_Battler): boolean;
  clearSubTargetOf(action: Game_Action|null): void;
}

declare interface Game_Unit {
  smoothAliveNextTarget(baseTargetIndex: number, targetIndex: number): Game_Battler|undefined;
  smoothDeadNextTarget(baseTargetIndex: number, targetIndex: number): Game_Battler|undefined;
}

declare interface Game_Action {
  _actionId: number;

  actionId(): number;
  isBlastScope(): boolean;
  makeSubTargets(mainTarget: Game_Battler, findSubTargetFunction: (targetIndex: number) => Game_Battler|undefined): Game_Battler[];
  markAsSubTarget(target: Game_Battler): void;
  applySubTargetDamageRate(value: number): number;
}
