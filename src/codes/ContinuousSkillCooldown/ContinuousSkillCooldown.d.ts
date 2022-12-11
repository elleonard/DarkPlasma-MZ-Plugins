/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../SkillCooldown/SkillCooldown.d.ts" />

declare class SkillCooldownManager {
}

declare interface Game_Battler {
  _skillCooldowns: Game_SkillCooldown[];
  updateSkillCooldown(): void;
}
