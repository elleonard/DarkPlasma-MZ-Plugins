/// <reference path="../../typings/rmmz/rmmz.d.ts" />

type SkillCooldownSetting = {
  triggerSkillId: number;
  targetSkills: {
    targetSkillId: number;
    cooldownTurnCount: number;
  }[];
};

declare var skillCooldownManager: SkillCooldownManager;

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
  setupCooldownTurn(skill: MZ.Skill): void;
  isDuringCooldown(skill: MZ.Skill): boolean;
  cooldownTurn(skill: MZ.Skill): number;
  skillCooldownId(): number;
  decreaseCooldownTurns(): void;

  initialSkillCooldowns(): Game_SkillCooldown[];
}
