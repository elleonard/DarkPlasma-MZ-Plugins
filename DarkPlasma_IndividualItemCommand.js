// DarkPlasma_IndividualItemCommand 1.1.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/01/21 1.1.1 個別コマンドウィンドウの高さ調整
 *            1.1.0 個別コマンドウィンドウのインターフェース公開
 *            1.0.0 公開
 */

/*:
 * @plugindesc アイテムシーン アイテムに個別でコマンドを表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.1.1
 * アイテムシーンでアイテムにカーソルを合わせて決定を押した際、
 * 個別でコマンドを表示します。
 */

(() => {
  'use strict';

  function Scene_Item_IndividualItemCommandMixIn(sceneItem) {
    const _create = sceneItem.create;
    sceneItem.create = function () {
      _create.call(this);
      this.createItemCommandWindow();
    };
    const _createItemWindow = sceneItem.createItemWindow;
    sceneItem.createItemWindow = function () {
      _createItemWindow.call(this);
      Window_ItemList_IndividualItemCommandMixIn(this._itemWindow);
    };
    sceneItem.createItemCommandWindow = function () {
      this._itemCommandWindowLayer = new WindowLayer();
      this._itemCommandWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._itemCommandWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._itemCommandWindowLayer);
      this._itemCommandWindow = new Window_ItemCommand(this.itemCommandWindowRect());
      this._itemCommandWindow.setHandler('use', () => this.determineItem());
      this._itemCommandWindow.setHandler('cancel', () => this.onItemCommandCancel());
      this._itemCommandWindow.deactivate();
      this._itemCommandWindow.hide();
      this._itemCommandWindowLayer.addChild(this._itemCommandWindow);
      this._itemWindow.setItemCommandWindow(this._itemCommandWindow);
    };
    sceneItem.onItemOk = function () {
      $gameParty.setLastItem(this.item());
      this._itemWindow.updateHelp();
      this.adjustItemCommandWindowPosition();
      this._itemCommandWindow.activate();
      this._itemCommandWindow.select(0);
      this._itemCommandWindow.show();
    };
    sceneItem.onActorCancel = function () {
      this.hideActorWindow();
      this._itemCommandWindow.activate();
      this._itemCommandWindow.show();
    };
    sceneItem.onItemCommandCancel = function () {
      this._itemCommandWindow.deactivate();
      this._itemCommandWindow.hide();
      this._itemWindow.activate();
      this._itemWindow.selectLast();
    };
    sceneItem.adjustItemCommandWindowPosition = function () {
      this._itemCommandWindow.refresh();
      this._itemCommandWindow.x = this.itemCommandWindowX();
      this._itemCommandWindow.y = this.itemCommandWindowY();
      this._itemCommandWindow.width = this.itemCommandWindowWidth();
      this._itemCommandWindow.height = this.itemCommandWindowHeight();
      this._itemCommandWindow.createContents();
      this._itemCommandWindow.refresh();
    };
    sceneItem.itemCommandWindowX = function () {
      if (this._itemWindow.index() < 0 || !this._itemCommandWindow) {
        return 0;
      }
      const itemRect = this._itemWindow.itemRect(this._itemWindow.index());
      return itemRect.x + itemRect.width - this._itemCommandWindow.width - 12;
    };
    sceneItem.itemCommandWindowY = function () {
      if (this._itemWindow.index() < 0 || !this._itemCommandWindow) {
        return 0;
      }
      const itemRect = this._itemWindow.itemRect(this._itemWindow.index());
      if (itemRect.y + itemRect.height + this._itemCommandWindow.height + 12 > Graphics.boxHeight) {
        return this._itemWindow.y + itemRect.y - this._itemCommandWindow.height - 12;
      }
      return this._itemWindow.y + itemRect.y + itemRect.height;
    };
    sceneItem.itemCommandWindowWidth = function () {
      if (!this._itemCommandWindow) {
        return 100;
      }
      return this._itemCommandWindow.maxWidth();
    };
    sceneItem.itemCommandWindowHeight = function () {
      if (!this._itemCommandWindow) {
        return 100;
      }
      return this._itemCommandWindow.commandsHeight();
    };
    sceneItem.itemCommandWindowRect = function () {
      return new Rectangle(
        this.itemCommandWindowX(),
        this.itemCommandWindowY(),
        this.itemCommandWindowWidth(),
        this.itemCommandWindowHeight(),
      );
    };
  }
  Scene_Item_IndividualItemCommandMixIn(Scene_Item.prototype);
  function Window_ItemList_IndividualItemCommandMixIn(windowClass) {
    windowClass.setItemCommandWindow = function (itemCommandWindow) {
      this._itemCommandWindow = itemCommandWindow;
    };
    /**
     * 有効なコマンドがひとつでもあれば選択可能とする
     */
    windowClass.isEnabled = function (item) {
      return this._itemCommandWindow.commandsForItem(item).some((command) => command.enabled);
    };
    const _updateHelp = windowClass.updateHelp;
    windowClass.updateHelp = function () {
      _updateHelp.call(this);
      this._itemCommandWindow?.setItem(this.item());
    };
  }
  class Window_ItemCommand extends Window_Command {
    setItem(item) {
      this._item = item;
      this.refresh();
    }
    commandsForItem(item) {
      const result = [];
      if (DataManager.isItem(item)) {
        result.push({
          name: 'つかう',
          symbol: 'use',
          enabled: $gameParty.canUse(item),
          ext: null,
        });
      }
      return result;
    }
    makeCommandList() {
      this.commandsForItem(this._item).forEach((command) => {
        this.addCommand(command.name, command.symbol, command.enabled, command.ext);
      });
    }
    maxWidth() {
      return (
        this._list.reduce((result, command) => {
          return this.textSizeEx(command.name).width + this.itemPadding() * 2 > result
            ? this.textSizeEx(command.name).width + this.itemPadding() * 2
            : result;
        }, 96) +
        this.colSpacing() +
        this.padding * 2
      );
    }
    commandsHeight() {
      return this.fittingHeight(this._list.length);
    }
  }
  globalThis.Window_ItemCommand = Window_ItemCommand;
})();
