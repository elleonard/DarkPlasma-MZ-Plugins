/// <reference path="./HighlightNewSkill.d.ts" />

import { settings } from "./_build/DarkPlasma_HighlightNewSkill_parameters";

function Game_Actor_HighlightNewSkllMixIn(gameActor: Game_Actor) {
  const _initSkills = gameActor.initSkills;
  gameActor.initSkills = function () {
    _initSkills.call(this);
    if (!settings.highlightFirstSkills) {
      this._newSkillIds = [];
    }
  };

  gameActor.newSkillIds = function () {
    if (!this._newSkillIds) {
      this._newSkillIds = [];
    }
    return this._newSkillIds;
  };

  gameActor.addNewSkill = function (skillId) {
    this.newSkillIds().push(skillId);
  };

  gameActor.isNewSkill = function (skill) {
    return this.newSkillIds().includes(skill.id);
  };

  gameActor.touchSkill = function (skill) {
    this._newSkillIds = this.newSkillIds().filter(id => id !== skill.id);
  };

  const _learnSkill = gameActor.learnSkill;
  gameActor.learnSkill = function (skillId) {
    if (!this.isLearnedSkill(skillId)) {
      this.addNewSkill(skillId);
    }
    _learnSkill.call(this, skillId);
  };
}

Game_Actor_HighlightNewSkllMixIn(Game_Actor.prototype);

function Window_SkillList_HighlightNewSkillMixIn(windowClass: Window_SkillList) {
  const _drawItemName = windowClass.drawItemName;
  windowClass.drawItemName = function (item, x, y, width) {
    if (this.isNewSkill(item)) {
      this.drawNewItemName(item, x, y, width!);
    } else {
      _drawItemName.call(this, item, x, y, width);
    }
  };

  windowClass.isNewSkill = function (skill: MZ.Skill): skill is MZ.Skill {
    return !!skill && !!this._actor && DataManager.isSkill(skill) && this._actor.isNewSkill(skill);
  };

  windowClass.drawNewItemName = function (skill, x, y, width) {
    const resetTextColor = this.resetTextColor;
    this.resetTextColor = () => {};
    this.changeTextColor(ColorManager.textColor(settings.newSkillColor));
    _drawItemName.call(this, skill, x, y, width);
    this.resetTextColor = resetTextColor;
    this.resetTextColor();
  };

  const _select = windowClass.select;
  windowClass.select = function (index) {
    _select.call(this, index);
    const skill = this.item();
    if (this.isNewSkill(skill)) {
      this._actor?.touchSkill(skill);
      this.refresh();
    }
  };
}

Window_SkillList_HighlightNewSkillMixIn(Window_SkillList.prototype);
