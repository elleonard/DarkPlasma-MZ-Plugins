/// <reference path="./DiscardItemCommand.d.ts" />

import { settings } from '../config/_build/DarkPlasma_DiscardItemCommand_parameters';

function Game_Party_DiscardItemCommandMixIn(gameParty: Game_Party) {
  gameParty.canDiscard = function (item) {
    return !!item 
      && (!DataManager.isItem(item) || item.itypeId !== 2)
      && (item.price > 0 || settings.canDiscardZeroPrice);
  };
}

Game_Party_DiscardItemCommandMixIn(Game_Party.prototype);

function Scene_Item_DiscardItemCommandMixIn(sceneItem: Scene_Item) {
  const _createItemCommandWindow = sceneItem.createItemCommandWindow;
  sceneItem.createItemCommandWindow = function () {
    _createItemCommandWindow.call(this);
    this._itemCommandWindow.setHandler('discard', () => this.discardItem());
  };

  sceneItem.discardItem = function () {
    const item = this.item() as MZ.Item|MZ.Weapon|MZ.Armor;
    $gameParty.loseItem(item, 1);
    this._itemCommandWindow.hide();
    this._itemWindow.refresh();
    this._itemWindow.activate();
    this._itemWindow.selectLast();
  };
}

Scene_Item_DiscardItemCommandMixIn(Scene_Item.prototype);

function Window_ItemCommand_DiscardItemCommandMixIn(windowClass: Window_ItemCommand) {
  const _commnadsForItem = windowClass.commandsForItem;
  windowClass.commandsForItem = function (item) {
    const result = _commnadsForItem.call(this, item);
    if ($gameParty.canDiscard(item)) {
      result.push({
        name: "捨てる",
        symbol: "discard",
        enabled: true,
        ext: null,
      });
    }
    return result;
  };
}

Window_ItemCommand_DiscardItemCommandMixIn(Window_ItemCommand.prototype);

function Window_ItemList_DiscardItemCommandMixIn(windowClass: Window_ItemList) {
  const _isEnabled = windowClass.isEnabled;
  windowClass.isEnabled = function (item) {
    return _isEnabled.call(this, item) || $gameParty.canDiscard(item);
  };
}

Window_ItemList_DiscardItemCommandMixIn(Window_ItemList.prototype);
