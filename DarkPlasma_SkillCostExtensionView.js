// DarkPlasma_SkillCostExtensionView 1.0.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/10/04 1.0.1 アイテムコストが正しく表示されない不具合を修正
 * 2020/10/03 1.0.0 公開
 */

/*:ja
 * @plugindesc スキルコスト表示を拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
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
 * @help
 * DarkPlasma_SkillCostExtensionで設定した拡張スキルコストを
 * スキルリスト上で表示します。
 *
 * 以下の優先度で対象スキルのコストを1つだけ表示します。
 * お金 > アイテム > HP > TP > MP
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
  };

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
})();
