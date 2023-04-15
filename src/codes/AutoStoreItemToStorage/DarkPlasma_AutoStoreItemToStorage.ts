/// <reference path="./AutoStoreItemToStorage.d.ts" />

/**
 * 自動で溢れたアイテムを倉庫に送るフラグを立てる
 * アイテムの入手がatomicに行われる前提としている
 */
function enableAutoStoreItem<T>(func: (...arg: any[]) => T): (...arg: any[]) => T {
  return function (this: any, arg) {
    $gameTemp.enableAutoStoreItem();
    const result = func.call(this, arg);
    $gameTemp.disableAutoStoreItem();
    return result;
  };
};

function BattleManager_AutoStoreItemMixIn(battleManager: typeof BattleManager) {
  battleManager.gainDropItems = enableAutoStoreItem(battleManager.gainDropItems);
}

BattleManager_AutoStoreItemMixIn(BattleManager);

function Game_Temp_AutoStoreItemMixIn(gameTemp: Game_Temp) {
  gameTemp.isAutoStoreItemEnabled = function () {
    return this._isAutoStoreItemEnabled;
  };

  gameTemp.enableAutoStoreItem = function () {
    this._isAutoStoreItemEnabled = true;
  };

  gameTemp.disableAutoStoreItem = function () {
    this._isAutoStoreItemEnabled = false;
  };
}

Game_Temp_AutoStoreItemMixIn(Game_Temp.prototype);

function Game_Party_AutoStoreItemMixIn(gameParty: Game_Party) {
  const _gainItem = gameParty.gainItem;
  gameParty.gainItem = function (item, amount, includeEquip) {
    if ($gameTemp.isAutoStoreItemEnabled()) {
      const autoStoreAmount = this.autoStoreAmount(item, amount);
      if (autoStoreAmount > 0) {
        this.storageItems().storeItem(item, autoStoreAmount);
        amount -= autoStoreAmount;
      }
    }
    _gainItem.call(this, item, amount, includeEquip);
  };

  gameParty.autoStoreAmount = function (item, amount) {
    return Math.max(this.numItems(item) + amount - this.maxItems(item), 0);
  };
}

Game_Party_AutoStoreItemMixIn(Game_Party.prototype);

function Game_Interpreter_AutoStoreItemMixIn(gameInterpreter: Game_Interpreter) {
  gameInterpreter.command126 = enableAutoStoreItem(gameInterpreter.command126);

  gameInterpreter.command127 = enableAutoStoreItem(gameInterpreter.command127);

  gameInterpreter.command128 = enableAutoStoreItem(gameInterpreter.command128);
}

Game_Interpreter_AutoStoreItemMixIn(Game_Interpreter.prototype);
