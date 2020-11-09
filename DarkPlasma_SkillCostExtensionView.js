// DarkPlasma_SkillCostExtensionView 1.1.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/10/06 1.1.0 変数コストの色設定を追加
 * 2020/10/04 1.0.1 アイテムコストが正しく表示されない不具合を修正
 * 2020/10/03 1.0.0 公開
 */

/*:ja
 * @plugindesc スキルコスト表示を拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SkillCostExtension
 *
 * @param hpCostColor
 * @desc HPコストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text HPコスト色
 * @type string
 * @default 2
 *
 * @param itemCostColor
 * @desc アイテムコストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text アイテムコスト色
 * @type string
 * @default 0
 *
 * @param goldCostColor
 * @desc お金コストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text お金コスト色
 * @type string
 * @default 6
 *
 * @param variableCostColor
 * @desc 変数コストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text 変数コスト色
 * @type string
 * @default 5
 *
 * @help
 * version: 1.1.0
 * DarkPlasma_SkillCostExtensionで設定した拡張スキルコストを
 * スキルリスト上で表示します。
 *
 * 以下の優先度で対象スキルのコストを1つだけ表示します。
 * 変数 > お金 > アイテム > HP > TP > MP
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    hpCostColor: String(pluginParameters.hpCostColor || '2'),
    itemCostColor: String(pluginParameters.itemCostColor || ''),
    goldCostColor: String(pluginParameters.goldCostColor || '6'),
    variableCostColor: String(pluginParameters.variableCostColor || '5'),
  };

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
})();
