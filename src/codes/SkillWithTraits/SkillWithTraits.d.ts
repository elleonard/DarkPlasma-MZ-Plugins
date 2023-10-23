/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Actor {
  skillsWithTrait(): MZ.Skill[];
  traitObjectsBySkill(): {traits: MZ.Trait[]}[];
}
