/// <reference path="./SkillCostExtension.d.ts" />

import { settings } from './_build/DarkPlasma_SkillCostExtension_parameters';

/**
 * ターン中に選択したスキル
 */
class ReservedSkills {
  _skills: MZ.Skill[];

  constructor() {
    this.initialize();
  }

  initialize() {
    this._skills = [];
  }

  reserve(skill: MZ.Skill) {
    this._skills.push(skill);
  }

  cancel() {
    this._skills.pop();
  }

  costItemCount(item: MZ.Item): number {
    return this._skills
      .filter((skill) => skill.additionalCost && skill.additionalCost.items)
      .map((skill) => skill.additionalCost.items)
      .flat()
      .filter((costItem) => costItem.id === item.id)
      .reduce((previous, current) => previous + current.num, 0);
  }

  costGold(): number {
    return this._skills
      .filter((skill) => skill.additionalCost && skill.additionalCost.gold)
      .reduce((previous, current) => previous + current.additionalCost.gold, 0);
  }
}

function BattleManager_SkillCostExtensionMixIn(battleManager: typeof BattleManager) {
  const _initMembers = battleManager.initMembers;
  battleManager.initMembers = function () {
    _initMembers.call(this);
    this._reservedSkills = new ReservedSkills();
  };

  const _startTurn = battleManager.startTurn;
  battleManager.startTurn = function () {
    _startTurn.call(this);
    this._reservedSkills.initialize();
  };

  battleManager.reserveSkill = function (skill) {
    this._reservedSkills.reserve(skill);
  };

  battleManager.cancelSkill = function () {
    this._reservedSkills.cancel();
  };

  const _reservedItemCount = battleManager.reservedItemCount;
  battleManager.reservedItemCount = function (item) {
    return _reservedItemCount
      ? _reservedItemCount.call(this, item) + this.reservedSkillCostItemCount(item)
      : this.reservedSkillCostItemCount(item);
  };

  /**
   * 既に入力済みのスキルコストアイテム数
   */
  battleManager.reservedSkillCostItemCount = function (item) {
    return this._reservedSkills.costItemCount(item);
  };

  /**
   * 既に入力済みのスキルコストゴールド
   */
  battleManager.reservedSkillCostGold = function () {
    return this._reservedSkills.costGold();
  };
}

BattleManager_SkillCostExtensionMixIn(BattleManager);

function DataManager_SkillCostExtensionMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ($dataSkills && this.isSkill(data)) {
      data.additionalCost = this.extractAdditionalSkillCost(data);
    }
  };

  dataManager.extractAdditionalSkillCost = function (data) {
    const result: SkillAdditionalCost = {
      items: [],
      variables: [],
      hp: 0,
      hpRate: 0,
      mpRate: 0,
      gold: 0,
    };
    if (!data.meta.SkillCost) {
      return result;
    }
    String(data.meta.SkillCost)
      .split('\n')
      .forEach((cost) => {
        const itemCost = this.extractAdditionalSkillCostItem(cost);
        const variableCost = this.extractAdditionalSkillCostVariable(cost);
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
                throw new Error(`undefined cost type:${match[1]}`);
            }
          }
        }
      });
    return result;
  };

  dataManager.extractAdditionalSkillCostItem = function (cost) {
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

  dataManager.extractAdditionalSkillCostVariable = function (cost) {
    const match = /variable:([1-9][0-9]*):([1-9][0-9]*)/g.exec(cost);
    if (match) {
      return {
        id: Number(match[1]),
        num: Number(match[2]),
      };
    }
    return null;
  };
}

DataManager_SkillCostExtensionMixIn(DataManager);

function Scene_Battle_SkillCostExtensionMixIn(sceneBattle: Scene_Battle) {
  const _selectNextCommand = sceneBattle.selectNextCommand;
  sceneBattle.selectNextCommand = function () {
    const action = BattleManager.inputtingAction();
    if (action && action.isSkill()) {
      const skill = action.item() as MZ.Skill;
      BattleManager.reserveSkill(skill);
    }
    _selectNextCommand.call(this);
  };

  const _selectPreviousCommand = sceneBattle.selectPreviousCommand;
  sceneBattle.selectPreviousCommand = function () {
    _selectPreviousCommand.call(this);
    const action = BattleManager.inputtingAction();
    if (action && action.isSkill()) {
      BattleManager.cancelSkill();
    }
  };
}

Scene_Battle_SkillCostExtensionMixIn(Scene_Battle.prototype);

function Game_BattlerBase_SkillCostExtensionMixIn(gameBattlerBase: Game_BattlerBase) {
  /**
   * スキル使用時の消費HP量を返す
   */
  gameBattlerBase.skillHpCost = function (skill) {
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
   */
  gameBattlerBase.hpCostRate = function () {
    return 1;
  };

  const _skillMpCost = gameBattlerBase.skillMpCost;
  gameBattlerBase.skillMpCost = function (skill) {
    let cost = _skillMpCost.call(this, skill);
    if (skill.additionalCost.mpRate) {
      cost += Math.floor(((skill.additionalCost.mpRate * this.mmp) / 100) * this.mcr);
    }
    return cost;
  };

  gameBattlerBase.skillGoldCost = function (skill) {
    return skill.additionalCost.gold ? skill.additionalCost.gold : 0;
  };

  gameBattlerBase.skillItemCosts = function (skill) {
    if (this.isActor() && skill.additionalCost.items) {
      return skill.additionalCost.items;
    }
    return [];
  };

  gameBattlerBase.skillVariableCosts = function (skill) {
    if (this.isActor() && skill.additionalCost.variables) {
      return skill.additionalCost.variables;
    }
    return [];
  };

  gameBattlerBase.canPaySkillHpCost = function (skill) {
    return this._hp > this.skillHpCost(skill);
  };

  gameBattlerBase.canPaySkillGoldCost = function (skill) {
    return $gameParty.gold() >= this.skillGoldCost(skill);
  };

  gameBattlerBase.canPaySkillItemCost = function (skill) {
    return !this.skillItemCosts(skill).some((item) => $gameParty.numItemsForDisplay($dataItems[item.id]) < item.num);
  };

  gameBattlerBase.canPaySkillVariableCost = function (skill) {
    return !this.skillVariableCosts(skill).some((variable) => {
      return $gameVariables.value(variable.id) < variable.num;
    });
  };

  const _canPaySkillCost = gameBattlerBase.canPaySkillCost;
  gameBattlerBase.canPaySkillCost = function (skill) {
    return (
      _canPaySkillCost.call(this, skill) &&
      this.canPaySkillHpCost(skill) &&
      this.canPaySkillGoldCost(skill) &&
      this.canPaySkillItemCost(skill) &&
      this.canPaySkillVariableCost(skill)
    );
  };

  const _paySkillCost = gameBattlerBase.paySkillCost;
  gameBattlerBase.paySkillCost = function (skill) {
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
    _paySkillCost.call(this, skill);
  };
}

Game_BattlerBase_SkillCostExtensionMixIn(Game_BattlerBase.prototype);

function Game_Party_SkillCostExtensionMixIn(gameParty: Game_Party) {
  /**
   * アイテムの表示上の個数を返す
   * numItemsはgainItemの挙動に影響してしまうため、類似の別メソッドが必要
   */
  gameParty.numItemsForDisplay = function (item) {
    return this.inBattle() && BattleManager.isInputting() && settings.consumeImmediately && DataManager.isItem(item)
      ? this.numItems(item) - BattleManager.reservedItemCount(item)
      : this.numItems(item);
  };

  const _gold = gameParty.gold;
  gameParty.gold = function () {
    return this.inBattle() && BattleManager.isInputting()
      ? _gold.call(this) - BattleManager.reservedSkillCostGold()
      : _gold.call(this);
  };
}

Game_Party_SkillCostExtensionMixIn(Game_Party.prototype);

function Window_BattleItem_SkillCostExtensionMixIn(windowClass: Window_BattleItem) {
  /**
   * 戦闘中のアイテムの個数表示
   * 表示上の個数と実際の個数がズレる上、numItemsはgainItemの挙動に影響してしまうため、
   * まるごと上書きしてしまう。
   */
  windowClass.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
      this.drawText(':', x, y, width - this.textWidth('00'), 'right');
      this.drawText(`${$gameParty.numItemsForDisplay(item)}`, x, y, width, 'right');
    }
  };
}

Window_BattleItem_SkillCostExtensionMixIn(Window_BattleItem.prototype);


