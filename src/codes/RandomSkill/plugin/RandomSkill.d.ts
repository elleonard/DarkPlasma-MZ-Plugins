/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueEffectCode/plugin/AllocateUniqueEffectCode.d.ts" />

declare interface Game_Action {
  _triggerAction?: Game_Action;

  setTriggerAction(action: Game_Action): void;
  triggerAction(): Game_Action|undefined;
  hasRandomSkillEffect(): boolean;
}
