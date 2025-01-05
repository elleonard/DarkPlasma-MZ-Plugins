// DarkPlasma_ElementDamageBonusTrait 1.1.1
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/01/05 1.1.1 依存プラグインのバージョン更新
 * 2025/01/05 1.1.0 異なる属性のダメージ倍率を加算するか乗算するかの設定を追加
 * 2025/01/05 1.0.1 単一属性の行動の属性を正常に反映できない不具合を修正
 * 2025/01/05 1.0.0 公開
 */

/*:
 * @plugindesc 属性ダメージボーナス特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_MultiElementAction
 *
 * @param addition
 * @desc ONにすると、異なる属性のダメージ倍率同士を加算します。OFFの場合は乗算します。
 * @text 加算するか
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.1.1
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に
 * elementDamageBonusメモタグを設定することで
 * 指定した属性のダメージ倍率を増減する特徴を設定できます。
 *
 * 設定例:
 * 火属性の与える属性ダメージ倍率+50％
 * <elementDamageBonus:
 *   火:50
 * >
 *
 * 氷属性の与える属性ダメージ倍率+20％
 * 雷属性の与える属性ダメージ倍率+30％
 * <elementDamangeBonus:
 *   氷:20
 *   雷:30
 * >
 *
 * その属性の特徴の値をすべて加算した値を元に、与える属性ダメージ倍率を決定します。
 * 与える属性ダメージ倍率を敵の有効度に乗算して実際の属性ダメージを計算します。
 * 与える属性ダメージ倍率のデフォルト値は100％です。
 *
 * DarkPlasma_MultiElementActionで実現される複合属性については
 * すべての属性について与える属性ダメージ倍率を計算し、それぞれを
 * プラグインの設定に従って加算または乗算します。
 *
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.2
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_MultiElementAction
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    addition: String(pluginParameters.addition || true) === 'true',
  };

  const elementDamageBonusTrait = uniqueTraitIdCache.allocate(pluginName, 1, '属性ダメージボーナス');
  function DataManager_ElementDamageBonusTraitMixIn(dataManager) {
    const _loadDatabase = dataManager.loadDatabase;
    dataManager.loadDatabase = function () {
      this._reservedExtractingElementDamageBonusTraitsNoteHolders = [];
      _loadDatabase.call(this);
    };
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data) && data.meta.elementDamageBonus) {
        /**
         * 属性名のロードが完了していないため、予約だけして後で展開する
         */
        this._reservedExtractingElementDamageBonusTraitsNoteHolders.push(data);
      }
    };
    dataManager.extractElementDamageBonusTraits = function () {
      this._reservedExtractingElementDamageBonusTraitsNoteHolders.forEach((data) => {
        const meta = String(data.meta.elementDamageBonus);
        data.traits.push(...this.extractElementDamageBonusTraitsSub(meta));
      });
    };
    dataManager.extractElementDamageBonusTraitsSub = function (meta) {
      return meta
        .split('\n')
        .filter((line) => line.includes(':'))
        .map((line) => {
          const tokens = line.split(':').map((t) => t.trim());
          const dataId = $dataSystem.elements.indexOf(tokens[0]);
          if (dataId < 0) {
            throw Error(`不正な属性指定です ${tokens[0]}`);
          }
          return {
            code: elementDamageBonusTrait.id,
            dataId: dataId,
            value: Number(tokens[1] || 0),
          };
        });
    };
  }
  DataManager_ElementDamageBonusTraitMixIn(DataManager);
  function Scene_Boot_ElementDamageBonusTraitMixIn(sceneBoot) {
    const _onDatabaseLoaded = sceneBoot.onDatabaseLoaded;
    sceneBoot.onDatabaseLoaded = function () {
      _onDatabaseLoaded.call(this);
      DataManager.extractElementDamageBonusTraits();
    };
  }
  Scene_Boot_ElementDamageBonusTraitMixIn(Scene_Boot.prototype);
  function Game_BattlerBase_ElementDamageBonusTraitMixIn(gameBattlerBase) {
    gameBattlerBase.elementAttackDamageBonus = function (elementId) {
      return this.traitsSum(elementDamageBonusTrait.id, elementId);
    };
    gameBattlerBase.elementAttackDamageRate = function (elementId) {
      return 1 + this.elementAttackDamageBonus(elementId) / 100;
    };
  }
  Game_BattlerBase_ElementDamageBonusTraitMixIn(Game_BattlerBase.prototype);
  function Game_Action_ElementDamageBonusTraitMixIn(gameAction) {
    const _calcElementRate = gameAction.calcElementRate;
    gameAction.calcElementRate = function (target) {
      const result = _calcElementRate.call(this, target);
      return result * this.elementDamageBonus(this.actionAttackElements());
    };
    gameAction.elementDamageBonus = function (elements) {
      return settings.addition
        ? elements.reduce((result, elementId) => this.subject().elementAttackDamageBonus(elementId) + result, 100) / 100
        : elements.reduce((result, elementId) => this.subject().elementAttackDamageRate(elementId) * result, 1);
    };
    if (!gameAction.actionAttackElements) {
      gameAction.actionAttackElements = function () {
        const elementId = this.item().damage.elementId;
        if (elementId < 0) {
          return this.subject().attackElements();
        }
        return [elementId];
      };
    }
  }
  Game_Action_ElementDamageBonusTraitMixIn(Game_Action.prototype);
})();
