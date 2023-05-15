/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../ConsumeItemImmediately/ConsumeItemImmediately.d.ts" />

type SkillCostIdAndCount = {
  id: number;
  num: number;
};

type SkillAdditionalCost = {
  items: SkillCostIdAndCount[];
  variables: SkillCostIdAndCount[];
  hp: number;
  hpRate: number;
  mpRate: number;
  gold: number;
};

declare namespace MZ {
  interface Skill {
    additionalCost: SkillAdditionalCost;
  }
}

declare interface ReservedSkills {
  _skills: MZ.Skill[];
  initialize(): void;
  reserve(skill: MZ.Skill): void;
  cancel(): void;
  costItemCount(item: MZ.Item): number;
  costGold(): number;
}

declare interface BattleManager {
  _reservedSkills: ReservedSkills;

  reserveSkill(skill: MZ.Skill): void;
  cancelSkill(): void;
  reservedSkillCostItemCount(item: MZ.Item): number;
  reservedSkillCostGold(): number;
}

declare namespace DataManager {
  function extractAdditionalSkillCost(data: MZ.Skill): SkillAdditionalCost;
  function extractAdditionalSkillCostItem(cost: string): {id: number, num: number}|null;
  function extractAdditionalSkillCostVariable(cost: string): {id: number, num: number}|null;
}

declare interface Game_BattlerBase {
  skillHpCost(skill: MZ.Skill): number;
  hpCostRate(): number;
  skillGoldCost(skill: MZ.Skill): number;
  skillItemCosts(skill: MZ.Skill): SkillCostIdAndCount[];
  skillVariableCosts(skill: MZ.Skill): SkillCostIdAndCount[];

  canPaySkillHpCost(skill: MZ.Skill): boolean;
  canPaySkillGoldCost(skill: MZ.Skill): boolean;
  canPaySkillItemCost(skill: MZ.Skill): boolean;
  canPaySkillVariableCost(skill: MZ.Skill): boolean;
}

declare interface Game_Party {
  numItemsForDisplay(item: MZ.Item|MZ.Weapon|MZ.Armor): number;
}
