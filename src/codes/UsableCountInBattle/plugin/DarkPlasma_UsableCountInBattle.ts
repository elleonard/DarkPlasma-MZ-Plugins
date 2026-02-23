/// <reference path="./UsableCountInBattle.d.ts" />

function BattleManager_UsableCountInBattleMixIn(battleManager: typeof BattleManager) {
  const _initMembers = battleManager.initMembers;
  battleManager.initMembers = function () {
    _initMembers.call(this);
    this._itemUseCountTable = {};
  };

  battleManager.useCountKey = function (item) {
    return DataManager.isItem(item) ? `item_${item.id}` : `skill_${item.id}`;
  };

  battleManager.incrementUseCount = function (item) {
    const key = this.useCountKey(item);
    if (!this._itemUseCountTable[key]) {
      this._itemUseCountTable[key] = 0;
    }
    this._itemUseCountTable[key]++;
  };

  battleManager.useCount = function (item) {
    return this._itemUseCountTable[this.useCountKey(item)] || 0;
  }

  battleManager.isUsableCountOk = function (item) {
    if (!item.usableCountInBattle) {
      return true;
    }
    return item.usableCountInBattle.usableCount() > this.useCount(item);
  };
}

BattleManager_UsableCountInBattleMixIn(BattleManager);

function DataManager_UsableCountInBattleMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (
      ($dataSkills && this.isSkill(data) || $dataItems && this.isItem(data))
      && data.meta.usableCountInBattle
    ) {
      data.usableCountInBattle = this.extractUsableCountInBattle(data);
    }
  };

  dataManager.extractUsableCountInBattle = function (data) {
    const matchValue = /v\[(0-9+)\]/g.exec(String(data.meta.usableCountInBattle));
    const value = matchValue ? Number(matchValue[1]) : Number(data.meta.usableCountInBattle);
    const type = matchValue ? "variable" : "number";
    return {
      type: type,
      value: value,
      usableCount: () => type === "number" ? value : $gameVariables.value(value),
    };
  };
}

DataManager_UsableCountInBattleMixIn(DataManager);

function Game_BattlerBase_UsableCountInBattleMixIn(gameBattlerBase: Game_BattlerBase) {
  const _meetsUsableItemConditions = gameBattlerBase.meetsUsableItemConditions;
  gameBattlerBase.meetsUsableItemConditions = function (item) {
    return _meetsUsableItemConditions.call(this, item)
      && (!$gameParty.inBattle() || BattleManager.isUsableCountOk(item));
  };
}

Game_BattlerBase_UsableCountInBattleMixIn(Game_BattlerBase.prototype);

function Game_Battler_UsableCountInBattleMixIn(gameBattler: Game_Battler) {
  const _useItem = gameBattler.useItem;
  gameBattler.useItem = function (item) {
    _useItem.call(this, item);
    if ($gameParty.inBattle()) {
      BattleManager.incrementUseCount(item);
    }
  };
}

Game_Battler_UsableCountInBattleMixIn(Game_Battler.prototype);
