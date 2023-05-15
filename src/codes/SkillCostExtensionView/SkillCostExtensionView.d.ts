/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../SkillCostExtension/SkillCostExtension.d.ts" />

declare namespace ColorManager {
  function hpCostColor(): string;
  function itemCostColor(): string;
  function goldCostColor(): string;
  function variableCostColor(): string;
  function additionalCostColor(colorSetting: string|number): string;
}

declare interface Window_SkillList {
  drawItemCost(skill: MZ.Skill, x: number, y: number, width: number): void;
  drawVariableCost(skill: MZ.Skill, x: number, y: number, width: number): void;
}
