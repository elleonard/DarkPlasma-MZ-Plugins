/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Actor {
  _newSkillIds: number[];

  newSkillIds(): number[];
  addNewSkill(skillId: number): void;
  isNewSkill(skill: MZ.Skill): boolean;
  touchSkill(skill: MZ.Skill): void;
}

declare interface Window_SkillList {
  _touchRequestedSkill: {skill: MZ.Skill, actor: Game_Actor}|null;

  requestTouch(skill: MZ.Skill|null): void;
  processTouchRequest(): void;
  isNewSkill(skill: DataManager.DrawableItem|null): skill is MZ.Skill;
  drawNewItemName(skill: MZ.Skill, x: number, y: number, width: number): void;
}
