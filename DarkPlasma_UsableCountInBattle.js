// DarkPlasma_UsableCountInBattle 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/09/17 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 戦闘中一定回数のみ使えるスキル/アイテム
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 戦闘中に一定回数のみ使えるスキル/アイテムを実現します。
 *
 * <usableCountInBattle:1>
 * とメモ欄に記述すると、そのスキルやアイテムは
 * 戦闘中に1回までしか使えなくなります。
 *
 * <usableCountInBattle:v[1]>
 * のように、回数を変数で指定できます。
 */

(() => {
  'use strict';

  function BattleManager_UsableCountInBattleMixIn(battleManager) {
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
    };
    battleManager.isUsableCountOk = function (item) {
      if (!item.usableCountInBattle) {
        return true;
      }
      return item.usableCountInBattle.usableCount() > this.useCount(item);
    };
  }
  BattleManager_UsableCountInBattleMixIn(BattleManager);
  function DataManager_UsableCountInBattleMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ((($dataSkills && this.isSkill(data)) || ($dataItems && this.isItem(data))) && data.meta.usableCountInBattle) {
        data.usableCountInBattle = this.extractUsableCountInBattle(data);
      }
    };
    dataManager.extractUsableCountInBattle = function (data) {
      const matchValue = /v\[(0-9+)\]/g.exec(String(data.meta.usableCountInBattle));
      const value = matchValue ? Number(matchValue[1]) : Number(data.meta.usableCountInBattle);
      const type = matchValue ? 'variable' : 'number';
      return {
        type: type,
        value: value,
        usableCount: () => (type === 'number' ? value : $gameVariables.value(value)),
      };
    };
  }
  DataManager_UsableCountInBattleMixIn(DataManager);
  function Game_BattlerBase_UsableCountInBattleMixIn(gameBattlerBase) {
    const _meetsUsableItemConditions = gameBattlerBase.meetsUsableItemConditions;
    gameBattlerBase.meetsUsableItemConditions = function (item) {
      return (
        _meetsUsableItemConditions.call(this, item) && (!$gameParty.inBattle() || BattleManager.isUsableCountOk(item))
      );
    };
  }
  Game_BattlerBase_UsableCountInBattleMixIn(Game_BattlerBase.prototype);
  function Game_Battler_UsableCountInBattleMixIn(gameBattler) {
    const _useItem = gameBattler.useItem;
    gameBattler.useItem = function (item) {
      _useItem.call(this, item);
      if ($gameParty.inBattle()) {
        BattleManager.incrementUseCount(item);
      }
    };
  }
  Game_Battler_UsableCountInBattleMixIn(Game_Battler.prototype);
})();
