// DarkPlasma_SkillCostExtension 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc スキルコストを拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @help
 * スキルのメモ欄に以下のように記述するとコストを追加できます。
 *
 * <SkillCost:
 *   hp:（消費HP 固定値）
 *   hpRate:（消費HP 最大値に対する割合）
 *   mpRate:（消費MP 最大値に対する割合）
 *   item:（アイテムID）:（個数）
 *   gold:（お金）
 * >
 *
 * 指定する項目はどれか一つでもよく また、itemについては複数指定が可能です。
 *
 * 例1: アイテムID1とアイテムID2を一つずつ消費するスキル
 *
 * <SkillCost:
 *   item:1:1
 *   item:2:1
 * >
 */

(() => {
  'use strict';

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if (data.meta.SkillCost) {
      data.additionalCost = DataManager.extractAdditionalSkillCost(data);
    }
  };

  DataManager.extractAdditionalSkillCost = function (data) {
    var result = {};
    String(data.meta.SkillCost)
      .split('\n')
      .forEach((cost) => {
        const itemCost = DataManager.extractAdditionalSkillCostItem(cost);
        if (itemCost) {
          if (!result.item) {
            result.item = [];
          }
          result.item.push(itemCost);
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
        id: match[1],
        num: match[2],
      };
    }
    return null;
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    // 追加コスト初期化
    $dataSkills
      .filter((skill) => skill && !skill.additionalCost)
      .forEach((skill) => ($dataSkills[skill.id].additionalCost = {}));
  };

  Game_BattlerBase.prototype.skillHpCost = function (skill) {
    let cost = 0;
    if (skill.additionalCost.hp) {
      cost += skill.additionalCost.hp;
    }
    if (skill.additionalCost.hpRate) {
      cost += (skill.additionalCost.hpRate * this.mhp) / 100;
    }
    return Math.floor(cost);
  };

  Game_BattlerBase.prototype.skillMpCost = function (skill) {
    let cost = skill.mpCost;
    if (skill.additionalCost.mpRate) {
      cost += (skill.additionalCost.mpRate * this.mmp) / 100;
    }
    return Math.floor(cost);
  };

  Game_BattlerBase.prototype.skillGoldCost = function (skill) {
    return skill.additionalCost.gold ? skill.additionalCost.gold : 0;
  };

  Game_BattlerBase.prototype.skillItemCosts = function (skill) {
    if (this.isActor() && skill.additionalCost.item) {
      return skill.additionalCost.item;
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
    return !this.skillItemCosts(skill).some((item) => $gameParty.numItems($dataItems[item.id]) < item.num);
  };

  const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
  Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
    return (
      _Game_BattlerBase_canPaySkillCost.call(this, skill) &&
      this.canPaySkillHpCost(skill) &&
      this.canPaySkillGoldCost(skill) &&
      this.canPaySkillItemCost(skill)
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
    _Game_BattlerBase_paySkillCost.call(this, skill);
  };
})();
