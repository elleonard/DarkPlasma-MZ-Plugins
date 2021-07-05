// DarkPlasma_ConsumeItemImmediately 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/12/14 1.0.1 jsdocの型修正
 * 2020/09/11 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 戦闘でアイテムを選択した際、即座に消費する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.3
 * 戦闘でアイテムを選択した際、即座に消費しているように見せます。
 */

(() => {
  'use strict';

  const _BattleManager_initMembers = BattleManager.initMembers;
  BattleManager.initMembers = function () {
    _BattleManager_initMembers.call(this);
    this._reservedItems = [];
  };

  const _BattleManager_startTurn = BattleManager.startTurn;
  BattleManager.startTurn = function () {
    _BattleManager_startTurn.call(this);
    this._reservedItems = [];
  };

  BattleManager.reserveItem = function (item) {
    this._reservedItems.push(item);
  };

  BattleManager.cancelItem = function () {
    this._reservedItems.pop();
  };

  /**
   * このターンに既に入力済みの指定アイテムの数
   * @param {MZ.Item} item アイテムデータ
   * @return {number}
   */
  BattleManager.reservedItemCount = function (item) {
    return this._reservedItems.filter((reservedItem) => reservedItem.id === item.id).length;
  };

  const _Scene_Battle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
  Scene_Battle.prototype.selectNextCommand = function () {
    const action = BattleManager.inputtingAction();
    if (action && action.isItem()) {
      const item = action.item();
      BattleManager.reserveItem(item);
    }
    _Scene_Battle_selectNextCommand.call(this);
  };

  const _Scene_Battle_selectPreviousCommand = Scene_Battle.prototype.selectPreviousCommand;
  Scene_Battle.prototype.selectPreviousCommand = function () {
    _Scene_Battle_selectPreviousCommand.call(this);
    const action = BattleManager.inputtingAction();
    if (action && action.isItem()) {
      BattleManager.cancelItem();
    }
  };

  /**
   * アイテムの表示上の個数を返す
   * numItemsはgainItemの挙動に影響してしまうため、類似の別メソッドが必要
   * @param {MZ.Item} item アイテムデータ
   * @return {number}
   */
  Game_Party.prototype.numItemsForDisplay = function (item) {
    return this.inBattle() && BattleManager.isInputting()
      ? this.numItems(item) - BattleManager.reservedItemCount(item)
      : this.numItems(item);
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

  const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
  Window_BattleItem.prototype.includes = function (item) {
    return _Window_BattleItem_includes.call(this, item) && $gameParty.numItemsForDisplay(item) > 0;
  };
})();
