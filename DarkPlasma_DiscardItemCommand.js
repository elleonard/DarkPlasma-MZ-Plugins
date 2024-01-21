// DarkPlasma_DiscardItemCommand 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/ 1.0.0 公開
 */

/*:
 * @plugindesc アイテムシーン アイテムを捨てるコマンド
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_IndividualItemCommand
 * @orderAfter DarkPlasma_IndividualItemCommand
 *
 * @help
 * version: 1.0.0
 * アイテムシーンでアイテムにカーソルを合わせて決定を押した際、
 * 捨てるコマンドを表示します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_IndividualItemCommand version:1.1.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_IndividualItemCommand
 */

(() => {
  'use strict';

  function Game_Party_DiscardItemCommandMixIn(gameParty) {
    gameParty.canDiscard = function (item) {
      return !!item && (!DataManager.isItem(item) || item.itypeId !== 2);
    };
  }
  Game_Party_DiscardItemCommandMixIn(Game_Party.prototype);
  function Scene_Item_DiscardItemCommandMixIn(sceneItem) {
    const _createItemCommandWindow = sceneItem.createItemCommandWindow;
    sceneItem.createItemCommandWindow = function () {
      _createItemCommandWindow.call(this);
      this._itemCommandWindow.setHandler('discard', () => this.discardItem());
    };
    sceneItem.discardItem = function () {
      const item = this.item();
      $gameParty.loseItem(item, 1);
      this._itemCommandWindow.hide();
      this._itemWindow.refresh();
      this._itemWindow.activate();
      this._itemWindow.selectLast();
    };
  }
  Scene_Item_DiscardItemCommandMixIn(Scene_Item.prototype);
  function Window_ItemCommand_DiscardItemCommandMixIn(windowClass) {
    const _commnadsForItem = windowClass.commandsForItem;
    windowClass.commandsForItem = function (item) {
      const result = _commnadsForItem.call(this, item);
      if ($gameParty.canDiscard(item)) {
        result.push({
          name: '捨てる',
          symbol: 'discard',
          enabled: true,
          ext: null,
        });
      }
      return result;
    };
  }
  Window_ItemCommand_DiscardItemCommandMixIn(Window_ItemCommand.prototype);
})();
