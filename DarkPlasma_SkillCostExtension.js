// DarkPlasma_SkillCostExtension 1.3.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/01/11 1.3.0 HP消費率設定に対応
 * 2020/10/26 1.2.1 特徴のMP消費率が正しく反映されない不具合を修正
 * 2020/10/06 1.2.0 変数をコストに設定する機能を追加
 * 2020/10/03 1.1.1 コメント修正, ヘルプにコスト表示を追記
 * 2020/09/11 1.1.0 アイテム/ゴールド消費数を選択時に反映するオプション追加
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc スキルコストを拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_ConsumeItemImmediately
 *
 * @param consumeImmediately
 * @desc アイテムやゴールドを消費するスキルを選択した際、後続のメンバーが参照するアイテム数/ゴールドを消費後のものにする
 * @text 入力時に消費反映
 * @type boolean
 * @default true
 *
 * @help
 * version: 1.3.0
 * スキルのメモ欄に以下のように記述するとコストを追加できます。
 *
 * <SkillCost:
 *   hp:（消費HP 固定値）
 *   hpRate:（消費HP 最大値に対する割合）
 *   mpRate:（消費MP 最大値に対する割合）
 *   item:（アイテムID）:（個数）
 *   gold:（お金）
 *   variable:（変数ID）:（数値）
 * >
 *
 * 指定する項目はどれか一つでもよく
 * また、item, variableについては複数指定が可能です。
 *
 * 例1: アイテムID1とアイテムID2を一つずつ消費するスキル
 *
 * <SkillCost:
 *   item:1:1
 *   item:2:1
 * >
 *
 * 例2: 変数ID1の値を5, 変数ID3の値を1消費するスキル
 * <SkillCost:
 *   variable:1:5
 *   variable:3:1
 * >
 *
 * スキルリスト上でのコスト表示について
 * 本プラグインではアイテムやお金の拡張コスト表示を行っていません。
 * 拡張コストを表示したい場合、
 * DarkPlasma_SkillCostExtensionView等の追加プラグインをご利用ください。
 *
 * アイテム選択時に消費をアイテム数へ反映する機能について
 * 本プラグインではスキルによる消費数の反映のみ行っています。
 * アイテムを直接使用した場合の消費数の反映については、
 * DarkPlasma_ConsumeItemImmediately をご利用ください。
 * 本プラグインと併用する場合、DarkPlasma_ConsumeItemImmediatelyよりも
 * 本プラグインを下に配置してください。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    consumeImmediately: String(pluginParameters.consumeImmediately || true) === 'true',
  };

  /**
   * ターン中に選択したスキル
   */
  class ReservedSkills {
    constructor() {
      this.initialize();
    }

    initialize() {
      /**
       * @type {MZ.Skill[]}
       */
      this._skills = [];
    }

    /**
     * @param {MZ.Skill} skill スキルデータ
     */
    reserve(skill) {
      this._skills.push(skill);
    }

    /**
     * 入力キャンセル
     */
    cancel() {
      this._skills.pop();
    }

    /**
     * アイテムの消費数
     * @param {MZ.item} item アイテムデータ
     * @return {number}
     */
    costItemCount(item) {
      return this._skills
        .filter((skill) => skill.additionalCost && skill.additionalCost.items)
        .map((skill) => skill.additionalCost.items)
        .flat()
        .filter((costItem) => costItem.id === item.id)
        .reduce((previous, current) => previous + current.num, 0);
    }

    /**
     * ゴールドの消費数
     * @return {number}
     */
    costGold() {
      return this._skills
        .filter((skill) => skill.additionalCost && skill.additionalCost.gold)
        .reduce((previous, current) => previous + current.additionalCost.gold, 0);
    }
  }

  const _BattleManager_initMembers = BattleManager.initMembers;
  BattleManager.initMembers = function () {
    _BattleManager_initMembers.call(this);
    this._reservedSkills = new ReservedSkills();
  };

  const _BattleManager_startTurn = BattleManager.startTurn;
  BattleManager.startTurn = function () {
    _BattleManager_startTurn.call(this);
    this._reservedSkills.initialize();
  };

  BattleManager.reserveSkill = function (skill) {
    this._reservedSkills.reserve(skill);
  };

  BattleManager.cancelSkill = function () {
    this._reservedSkills.cancel();
  };

  const _BattleManager_reservedItemCount = BattleManager.reservedItemCount;
  BattleManager.reservedItemCount = function (item) {
    return _BattleManager_reservedItemCount
      ? _BattleManager_reservedItemCount.call(this, item) + this.reservedSkillCostItemCount(item)
      : this.reservedSkillCostItemCount(item);
  };

  /**
   * 既に入力済みのスキルコストアイテム数
   * @param {MZ.item} item アイテムデータ
   * @return {number}
   */
  BattleManager.reservedSkillCostItemCount = function (item) {
    return this._reservedSkills.costItemCount(item);
  };

  /**
   * 既に入力済みのスキルコストゴールド
   * @return {number}
   */
  BattleManager.reservedSkillCostGold = function () {
    return this._reservedSkills.costGold();
  };

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if (data.meta.SkillCost) {
      data.additionalCost = DataManager.extractAdditionalSkillCost(data);
    }
  };

  DataManager.extractAdditionalSkillCost = function (data) {
    const result = {};
    String(data.meta.SkillCost)
      .split('\n')
      .forEach((cost) => {
        const itemCost = DataManager.extractAdditionalSkillCostItem(cost);
        const variableCost = DataManager.extractAdditionalSkillCostVariable(cost);
        if (itemCost) {
          if (!result.items) {
            result.items = [];
          }
          result.items.push(itemCost);
        } else if (variableCost) {
          if (!result.variables) {
            result.variables = [];
          }
          result.variables.push(variableCost);
        } else {
          const re = /(.+):([1-9][0-9]*)/g;
          const match = re.exec(cost);
          if (match) {
            const key = match[1].trim();
            switch (key) {
              case 'hp':
              case 'hpRate':
              case 'mpRate':
              case 'gold':
                result[key] = Number(match[2]);
                break;
              default:
                console.log(`undefined cost type:${match[1]}`);
                break;
            }
          }
        }
      });
    return result;
  };

  DataManager.extractAdditionalSkillCostItem = function (cost) {
    const re = /item:([1-9][0-9]*):([1-9][0-9]*)/g;
    const match = re.exec(cost);
    if (match) {
      return {
        id: Number(match[1]),
        num: Number(match[2]),
      };
    }
    return null;
  };

  DataManager.extractAdditionalSkillCostVariable = function (cost) {
    const match = /variable:([1-9][0-9]*):([1-9][0-9]*)/g.exec(cost);
    if (match) {
      return {
        id: Number(match[1]),
        num: Number(match[2]),
      };
    }
    return null;
  };

  const _Scene_Battle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
  Scene_Battle.prototype.selectNextCommand = function () {
    const action = BattleManager.inputtingAction();
    if (action && action.isSkill()) {
      const skill = action.item();
      BattleManager.reserveSkill(skill);
    }
    _Scene_Battle_selectNextCommand.call(this);
  };

  const _Scene_Battle_selectPreviousCommand = Scene_Battle.prototype.selectPreviousCommand;
  Scene_Battle.prototype.selectPreviousCommand = function () {
    _Scene_Battle_selectPreviousCommand.call(this);
    const action = BattleManager.inputtingAction();
    if (action && action.isSkill()) {
      BattleManager.cancelSkill();
    }
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    // 追加コスト初期化
    $dataSkills
      .filter((skill) => skill && !skill.additionalCost)
      .forEach((skill) => ($dataSkills[skill.id].additionalCost = {}));
  };

  /**
   * スキル使用時の消費HP量を返す
   * @param {MZ.Skill} skill スキルデータ
   * @return {number}
   */
  Game_BattlerBase.prototype.skillHpCost = function (skill) {
    let cost = 0;
    if (skill.additionalCost.hp) {
      cost += skill.additionalCost.hp;
    }
    if (skill.additionalCost.hpRate) {
      cost += (skill.additionalCost.hpRate * this.mhp) / 100;
    }
    return Math.floor(cost * this.hpCostRate());
  };

  /**
   * HP消費率を返す
   * @return {number}
   */
  Game_BattlerBase.prototype.hpCostRate = function () {
    return 1;
  };

  const _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
  Game_BattlerBase.prototype.skillMpCost = function (skill) {
    let cost = _Game_BattlerBase_skillMpCost.call(this, skill);
    if (skill.additionalCost.mpRate) {
      cost += Math.floor(((skill.additionalCost.mpRate * this.mmp) / 100) * this.mcr);
    }
    return cost;
  };

  Game_BattlerBase.prototype.skillGoldCost = function (skill) {
    return skill.additionalCost.gold ? skill.additionalCost.gold : 0;
  };

  Game_BattlerBase.prototype.skillItemCosts = function (skill) {
    if (this.isActor() && skill.additionalCost.items) {
      return skill.additionalCost.items;
    }
    return [];
  };

  Game_BattlerBase.prototype.skillVariableCosts = function (skill) {
    if (this.isActor() && skill.additionalCost.variables) {
      return skill.additionalCost.variables;
    }
    return [];
  };

  Game_BattlerBase.prototype.canPaySkillHpCost = function (skill) {
    return this._hp > this.skillHpCost(skill);
  };

  Game_BattlerBase.prototype.canPaySkillGoldCost = function (skill) {
    return $gameParty.gold() >= this.skillGoldCost(skill);
  };

  Game_BattlerBase.prototype.canPaySkillItemCost = function (skill) {
    return !this.skillItemCosts(skill).some((item) => $gameParty.numItemsForDisplay($dataItems[item.id]) < item.num);
  };

  Game_BattlerBase.prototype.canPaySkillVariableCost = function (skill) {
    return !this.skillVariableCosts(skill).some((variable) => {
      return $gameVariables.value(variable.id) < variable.num;
    });
  };

  const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
  Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
    return (
      _Game_BattlerBase_canPaySkillCost.call(this, skill) &&
      this.canPaySkillHpCost(skill) &&
      this.canPaySkillGoldCost(skill) &&
      this.canPaySkillItemCost(skill) &&
      this.canPaySkillVariableCost(skill)
    );
  };

  const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
  Game_BattlerBase.prototype.paySkillCost = function (skill) {
    // HPコスト
    this._hp -= Math.min(this.skillHpCost(skill), this._hp);
    // goldコスト
    $gameParty.loseGold(this.skillGoldCost(skill));
    // アイテムコスト
    this.skillItemCosts(skill)
      .filter((itemCost) => $dataItems[itemCost.id].consumable)
      .forEach((itemCost) => $gameParty.loseItem($dataItems[itemCost.id], itemCost.num, false));
    // 変数コスト
    this.skillVariableCosts(skill).forEach((variableCost) => {
      $gameVariables.setValue(variableCost.id, $gameVariables.value(variableCost.id) - variableCost.num);
    });
    _Game_BattlerBase_paySkillCost.call(this, skill);
  };

  /**
   * アイテムの表示上の個数を返す
   * numItemsはgainItemの挙動に影響してしまうため、類似の別メソッドが必要
   * @param {MZ.item} item アイテムデータ
   * @return {number}
   */
  Game_Party.prototype.numItemsForDisplay = function (item) {
    return this.inBattle() && BattleManager.isInputting() && settings.consumeImmediately
      ? this.numItems(item) - BattleManager.reservedItemCount(item)
      : this.numItems(item);
  };

  const _Game_Party_gold = Game_Party.prototype.gold;
  Game_Party.prototype.gold = function () {
    return this.inBattle() && BattleManager.isInputting()
      ? _Game_Party_gold.call(this) - BattleManager.reservedSkillCostGold()
      : _Game_Party_gold.call(this);
  };

  /**
   * 戦闘中のアイテムの個数表示
   * 表示上の個数と実際の個数がズレる上、numItemsはgainItemの挙動に影響してしまうため、
   * まるごと上書きしてしまう。
   * @param {MZ.item} item アイテムデータ
   */
  Window_BattleItem.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
      this.drawText(':', x, y, width - this.textWidth('00'), 'right');
      this.drawText($gameParty.numItemsForDisplay(item), x, y, width, 'right');
    }
  };
})();
