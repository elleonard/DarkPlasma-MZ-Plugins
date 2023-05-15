// DarkPlasma_SkillCostExtensionView 1.1.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/15 1.1.3 プラグインパラメータの型を変更
 *                  typescript移行
 * 2021/07/05 1.1.2 MZ 1.3.2に対応
 * 2021/06/22 1.1.1 サブフォルダからの読み込みに対応
 * 2020/10/06 1.1.0 変数コストの色設定を追加
 * 2020/10/04 1.0.1 アイテムコストが正しく表示されない不具合を修正
 * 2020/10/03 1.0.0 公開
 */

/*:
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
 * @type color
 * @default 2
 *
 * @param itemCostColor
 * @desc アイテムコストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text アイテムコスト色
 * @type color
 * @default 0
 *
 * @param goldCostColor
 * @desc お金コストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text お金コスト色
 * @type color
 * @default 6
 *
 * @param variableCostColor
 * @desc 変数コストの色をツクールの色番号または#+6桁の16進数で指定します。
 * @text 変数コスト色
 * @type color
 * @default 5
 *
 * @help
 * version: 1.1.3
 * DarkPlasma_SkillCostExtensionで設定した拡張スキルコストを
 * スキルリスト上で表示します。
 *
 * 以下の優先度で対象スキルのコストを1つだけ表示します。
 * 変数 > お金 > アイテム > HP > TP > MP
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_SkillCostExtension version:1.3.4
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    hpCostColor: pluginParameters.hpCostColor?.startsWith('#')
      ? String(pluginParameters.hpCostColor)
      : Number(pluginParameters.hpCostColor || 2),
    itemCostColor: pluginParameters.itemCostColor?.startsWith('#')
      ? String(pluginParameters.itemCostColor)
      : Number(pluginParameters.itemCostColor || 0),
    goldCostColor: pluginParameters.goldCostColor?.startsWith('#')
      ? String(pluginParameters.goldCostColor)
      : Number(pluginParameters.goldCostColor || 6),
    variableCostColor: pluginParameters.variableCostColor?.startsWith('#')
      ? String(pluginParameters.variableCostColor)
      : Number(pluginParameters.variableCostColor || 5),
  };

  function ColorManager_SkillCostExtensionViewMixIn(colorManager) {
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
      return typeof colorSetting === 'string' ? colorSetting : this.textColor(colorSetting);
    };
  }
  ColorManager_SkillCostExtensionViewMixIn(ColorManager);
  function Window_SkillList_SkillCostExtensionViewMixIn(windowClass) {
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
})();
