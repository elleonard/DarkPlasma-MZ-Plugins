import { settings } from './_build/DarkPlasma_SkillCostExtensionView_parameters';

ColorManager.hpCostColor = function () {
  return settings.hpCostColor.startsWith('#') ? settings.hpCostColor : this.textColor(settings.hpCostColor);
};

ColorManager.itemCostColor = function () {
  return settings.itemCostColor.startsWith('#') ? settings.itemCostColor : this.textColor(settings.itemCostColor);
};

ColorManager.goldCostColor = function () {
  return settings.goldCostColor.startsWith('#') ? settings.goldCostColor : this.textColor(settings.goldCostColor);
};

const _Window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
  if (this._actor.skillGoldCost(skill) > 0) {
    this.changeTextColor(ColorManager.goldCostColor());
    this.drawText(this._actor.skillGoldCost(skill), x, y, width, 'right');
  } else if (this._actor.skillItemCosts(skill).length > 0) {
    this.changeTextColor(ColorManager.itemCostColor());
    this.drawItemCost(skill, x, y, width);
  } else if (this._actor.skillHpCost(skill) > 0) {
    this.changeTextColor(ColorManager.hpCostColor());
    this.drawText(this._actor.skillHpCost(skill), x, y, width, 'right');
  } else {
    _Window_SkillList_drawSkillCost.call(this, skill, x, y, width);
  }
};

Window_SkillList.prototype.drawItemCost = function (skill, x, y, width) {
  const firstItemCost = this._actor.skillItemCosts(skill)[0];
  this.drawText(
    `${firstItemCost.num}/${$gameParty.numItemsForDisplay($dataItems[firstItemCost.id])}`,
    x,
    y,
    width,
    'right'
  );
};
