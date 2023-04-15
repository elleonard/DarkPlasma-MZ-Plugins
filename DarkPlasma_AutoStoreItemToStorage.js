// DarkPlasma_AutoStoreItemToStorage 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/04/16 1.0.0 公開
 */

/*:
 * @plugindesc 溢れたアイテムを自動で倉庫に送る
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_ItemStorage
 *
 * @help
 * version: 1.0.0
 * 入手するアイテムのうち、
 * 所持限界を超える数を自動で倉庫に送ります。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_ItemStorage version:1.3.1
 */

(() => {
  'use strict';

  /**
   * 自動で溢れたアイテムを倉庫に送るフラグを立てる
   * アイテムの入手がatomicに行われる前提としている
   */
  function enableAutoStoreItem(func) {
    return function (arg) {
      $gameTemp.enableAutoStoreItem();
      const result = func.call(this, arg);
      $gameTemp.disableAutoStoreItem();
      return result;
    };
  }
  function BattleManager_AutoStoreItemMixIn(battleManager) {
    battleManager.gainDropItems = enableAutoStoreItem(battleManager.gainDropItems);
  }
  BattleManager_AutoStoreItemMixIn(BattleManager);
  function Game_Temp_AutoStoreItemMixIn(gameTemp) {
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
  function Game_Party_AutoStoreItemMixIn(gameParty) {
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
  function Game_Interpreter_AutoStoreItemMixIn(gameInterpreter) {
    gameInterpreter.command126 = enableAutoStoreItem(gameInterpreter.command126);
    gameInterpreter.command127 = enableAutoStoreItem(gameInterpreter.command127);
    gameInterpreter.command128 = enableAutoStoreItem(gameInterpreter.command128);
  }
  Game_Interpreter_AutoStoreItemMixIn(Game_Interpreter.prototype);
})();
