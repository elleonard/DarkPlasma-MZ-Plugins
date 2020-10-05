import { settings } from './_build/DarkPlasma_SkillCostExtensionView_parameters';

ColorManager.hpCostColor = function () {
  return this.additionalCostColor(settings.hpCostColor);
};

ColorManager.itemCostColor = function () {
  return this.additionalCostColor(settings.itemCostColor);
};

ColorManager.goldCostColor = function () {
  return this.additionalCostColor(settings.goldCostColor);
};

ColorManager.variableCostColor = function () {
  return this.additionalCostColor(settings.variableCostColor);
};

ColorManager.additionalCostColor = function (colorSetting) {
  return colorSetting.startsWith('#') ? colorSetting : this.textColor(colorSetting);
};

const _Window_SkillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
  if (this._actor.skillVariableCosts(skill).length > 0) {
    this.changeTextColor(ColorManager.variableCostColor());
    this.drawVariableCost(skill, x, y, width);
  } else if (this._actor.skillGoldCost(skill) > 0) {
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

Window_SkillList.prototype.drawVariableCost = function (skill, x, y, width) {
  const firstVariableCost = this._actor.skillVariableCosts(skill)[0];
  this.drawText(`${firstVariableCost.num}/${$gameVariables.value(firstVariableCost.id)}`, x, y, width, 'right');
};
