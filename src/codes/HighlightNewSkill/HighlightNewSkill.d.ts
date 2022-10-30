/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface Game_Actor {
  _newSkillIds: number[];

  newSkillIds(): number[];
  addNewSkill(skillId: number): void;
  isNewSkill(skill: MZ.Skill): boolean;
  touchSkill(skill: MZ.Skill): void;
}

declare interface Window_SkillList {
  isNewSkill(skill: DataManager.DrawableItem|null): skill is MZ.Skill;
  drawNewItemName(skill: MZ.Skill, x: number, y: number, width: number): void;
}
