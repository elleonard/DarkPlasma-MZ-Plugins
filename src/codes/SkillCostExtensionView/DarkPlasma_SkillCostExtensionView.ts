/// <reference path="./SkillCostExtensionView.d.ts" />

import { settings } from './_build/DarkPlasma_SkillCostExtensionView_parameters';

function ColorManager_SkillCostExtensionViewMixIn(colorManager: typeof ColorManager) {
  colorManager.hpCostColor = function () {
    return this.additionalCostColor(settings.hpCostColor);
  };

  colorManager.itemCostColor = function () {
    return this.additionalCostColor(settings.itemCostColor);
  };

  colorManager.goldCostColor = function () {
    return this.additionalCostColor(settings.goldCostColor);
  };

  colorManager.variableCostColor = function () {
    return this.additionalCostColor(settings.variableCostColor);
  };

  colorManager.additionalCostColor = function (colorSetting) {
    return typeof colorSetting === "string"
      ? colorSetting
      : this.textColor(colorSetting);
  };
}

ColorManager_SkillCostExtensionViewMixIn(ColorManager);

function Window_SkillList_SkillCostExtensionViewMixIn(windowClass: Window_SkillList) {
  const _drawSkillCost = windowClass.drawSkillCost;
  windowClass.drawSkillCost = function (skill, x, y, width) {
    if (!this._actor) {
      _drawSkillCost.call(this, skill, x, y, width);
      return;
    }
    if ((this._actor.skillVariableCosts(skill).length || 0) > 0) {
      this.changeTextColor(ColorManager.variableCostColor());
      this.drawVariableCost(skill, x, y, width);
    } else if (this._actor.skillGoldCost(skill) > 0) {
      this.changeTextColor(ColorManager.goldCostColor());
      this.drawText(`${this._actor.skillGoldCost(skill)}`, x, y, width, 'right');
    } else if (this._actor.skillItemCosts(skill).length > 0) {
      this.changeTextColor(ColorManager.itemCostColor());
      this.drawItemCost(skill, x, y, width);
    } else if (this._actor.skillHpCost(skill) > 0) {
      this.changeTextColor(ColorManager.hpCostColor());
      this.drawText(`${this._actor.skillHpCost(skill)}`, x, y, width, 'right');
    } else {
      _drawSkillCost.call(this, skill, x, y, width);
    }
  };
  
  windowClass.drawItemCost = function (skill, x, y, width) {
    const firstItemCost = this._actor?.skillItemCosts(skill)[0];
    if (!firstItemCost) {
      return;
    }
    this.drawText(
      `${firstItemCost.num}/${$gameParty.numItemsForDisplay($dataItems[firstItemCost.id])}`,
      x,
      y,
      width,
      'right'
    );
  };
  
  windowClass.drawVariableCost = function (skill, x, y, width) {
    const firstVariableCost = this._actor?.skillVariableCosts(skill)[0];
    if (!firstVariableCost) {
      return;
    }
    this.drawText(`${firstVariableCost.num}/${$gameVariables.value(firstVariableCost.id)}`, x, y, width, 'right');
  };
}

Window_SkillList_SkillCostExtensionViewMixIn(Window_SkillList.prototype);
