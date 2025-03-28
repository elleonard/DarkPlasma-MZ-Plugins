/// <reference path="../../typings/rmmz.d.ts" />

declare var skillCooldownManager: SkillCooldownManager;

declare namespace ColorManager {
  function cooldownTextColor(): string;
}

declare interface SkillCooldownManager {
  initialize(): void;

  actorsCooldowns(actorId: number): Game_SkillCooldown[];
  decreaseCooldownTurns(id: number, isActor: boolean): void;
  isDuringCooldown(id: number, skill: MZ.Skill, isActor: boolean): boolean;
  plusCooldownTurns(targetBattlers: Game_Battler[], plus: number, skills?: MZ.Skill[]): void;
  finishCooldowns(targetBattlers: Game_Battler[], skills?: MZ.Skill[]): void;
}

declare interface Game_SkillCooldown {
  _skillId: number;
  _turnCount: number;

  readonly skillId: number;
  readonly turnCount: number;
  isFinished(): boolean;
  finish(): void;
  decreaseTurn(): void;
  plusTurn(plus: number): void;
}

declare interface Game_BattlerBase {
  setupCooldownTurn(triggerSkill: MZ.Skill): void;
  setupCooldownTurnByTargetSkill(targetSkill: MZ.Skill, turn?: number): void;
  isDuringCooldown(skill: MZ.Skill): boolean;
  cooldownTurn(skill: MZ.Skill): number;
  skillCooldownId(): number;
  decreaseCooldownTurns(): void;

  initialSkillCooldowns(): Game_SkillCooldown[];
}

declare interface Window_SkillList {
  mustDisplayCooldownText(skill: MZ.Skill): boolean;
  cooldownText(skill: MZ.Skill): string;
  cooldownTurn(skill: MZ.Skill): number;
}
