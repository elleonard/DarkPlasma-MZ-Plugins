/// <reference path="../../typings/rmmz/rmmz.d.ts" />

type SkillCooldownSetting = {
  triggerSkillId: number;
  targetSkills: {
    targetSkillId: number;
    cooldownTurnCount: number;
  }[];
};

declare interface Game_BattlerBase {
  setupCooldownTurn(skill: MZ.Skill): void;
  isDuringCooldown(skill: MZ.Skill): boolean;
  cooldownTurn(skill: MZ.Skill): number;
  skillCooldownId(): number;
  decreaseCooldownTurns(): void;
}
