/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare interface BattleManager {
  _preemptiveSkillActions: Game_Action[];
  _isAllPreemptiveSkillFinished: boolean;

  prepareAllPreemptiveSkills(): void;
  preparePreemptiveSkills(battler: Game_Battler): void;
  updatePreemptiveSkill(): void;
  currentPreemptiveSkillAction(): Game_Action|undefined;
  processPreemptiveSkill(): void;
  endPreemptiveSkill(): void;

  startPreemptiveSkillAction(): void;
  updatePreemptiveSkillAction(): void;
  endPreemptiveSkillAction(): void;
}

declare namespace BattleManager {
  declare interface LogWindow<Battler, Action> {
    startPreemptiveAction(subject: Game_Battler): void;
  }
}

declare interface Game_BattlerBase {
  preemptiveSkills(): {
    skillId: number;
    rate: number;
  }[];
  performPreemptiveSkill(): void;
}

declare interface Window_BattleLog {
  startPreemptiveAction(subject: Game_Battler): void;
  performPreemptiveSkill(subject: Game_Battler): void;
}
