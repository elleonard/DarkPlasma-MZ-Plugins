/// <reference path="./SkillWithTraits.d.ts" />

function Game_Actor_SkillWithTraitsMixin(gameActor: Game_Actor) {
  const _traitObjects = gameActor.traitObjects;
  gameActor.traitObjects = function () {
    return _traitObjects.call(this).concat(this.traitObjectsBySkill());
  };

  gameActor.traitObjectsBySkill = function () {
    return this._skills
      .map(skillId => {
        const skill = $dataSkills[skillId];
        if (!skill.meta.traits) {
          return undefined;
        }
        const t = String(skill.meta.traits).split('/');
        switch (t[0]) {
          case 'actor':
            return $dataActors[Number(t[1])];
          case 'class':
            return $dataClasses[Number(t[1])];
          case 'weapon':
            return $dataWeapons[Number(t[1])];
          case 'armor':
            return $dataArmors[Number(t[1])];
          case 'state':
            return $dataStates[Number(t[1])];
          default:
            return undefined;
        }
      })
      .filter((object): object is MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State => !!object && "traits" in object);
  };
}

Game_Actor_SkillWithTraitsMixin(Game_Actor.prototype);
