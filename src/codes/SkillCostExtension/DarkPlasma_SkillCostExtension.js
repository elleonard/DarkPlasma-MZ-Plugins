import { settings } from './_build/DarkPlasma_SkillCostExtension_parameters';

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
