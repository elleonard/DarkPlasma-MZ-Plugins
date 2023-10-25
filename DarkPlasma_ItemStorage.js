// DarkPlasma_ItemStorage 1.6.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/10/25 1.6.0 倉庫に預けるまたは引き出す数ウィンドウのインターフェースを公開
 * 2023/07/25 1.5.0 Window_StorageItemsのインターフェースを公開
 *                  倉庫に預ける際の処理順変更
 * 2023/06/24 1.4.0 所持している数、倉庫に入っている数のテキスト設定を追加
 * 2023/04/02 1.3.1 typescript移行
 * 2022/05/22 1.3.0 DarkPlasma_OrderEquipに対応
 * 2022/05/14 1.2.0 アイテム出し入れ時に説明文が更新されない不具合を修正
 *                  DarkPlasma_OrderIdAliasに対応
 * 2022/01/22 1.1.0 Scene_ItemStorageのインターフェースを公開
 * 2022/01/11 1.0.1 倉庫内にアイテムがあるかどうか判定できない不具合を修正
 *                  最大数所持しているアイテムをそれ以上引き出せないように修正
 *                  最大数預けているアイテムをそれ以上預けられないように修正
 * 2022/01/10 1.0.0 公開
 */

/*:
 * @plugindesc アイテム倉庫
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param maxItems
 * @desc 倉庫内に格納できるアイテム1種類の最大数を設定します。
 * @text アイテム別最大数
 * @type number
 * @default 99
 *
 * @param partyItemCountText
 * @text 所持している数テキスト
 * @type string
 * @default 所持している数
 *
 * @param storageItemCountText
 * @text 倉庫に入っている数テキスト
 * @type string
 * @default 倉庫に入っている数
 *
 * @command openStorage
 * @text 倉庫を開く
 * @arg item
 * @text アイテム表示
 * @desc カテゴリにアイテムを表示するか
 * @type boolean
 * @default true
 * @arg weapon
 * @text 武器表示
 * @desc カテゴリに武器を表示するか
 * @type boolean
 * @default true
 * @arg armor
 * @text 防具表示
 * @desc カテゴリに防具を表示するか
 * @type boolean
 * @default true
 * @arg keyItem
 * @text 大事なもの表示
 * @desc カテゴリに大事なものを表示するか
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.6.0
 * アイテム倉庫シーンを提供します。
 * プラグインコマンドで倉庫を開くことができます。
 */

(() => {
  'use strict';

  function orderIdSort(a, b) {
    if (a === null && b === null) {
      // 両方nullなら順不同
      return 0;
    } else if (a === null) {
      return 1;
    } else if (b === null) {
      return -1;
    }
    return (a.orderId || a.id) - (b.orderId || b.id);
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_openStorage(args) {
    return {
      item: String(args.item || true) === 'true',
      weapon: String(args.weapon || true) === 'true',
      armor: String(args.armor || true) === 'true',
      keyItem: String(args.keyItem || false) === 'true',
    };
  }

  const command_openStorage = 'openStorage';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    maxItems: Number(pluginParameters.maxItems || 99),
    partyItemCountText: String(pluginParameters.partyItemCountText || `所持している数`),
    storageItemCountText: String(pluginParameters.storageItemCountText || `倉庫に入っている数`),
  };

  PluginManager.registerCommand(pluginName, command_openStorage, function (args) {
    const parsedArgs = parseArgs_openStorage(args);
    $gameTemp.createStorageCategories(parsedArgs.item, parsedArgs.weapon, parsedArgs.armor, parsedArgs.keyItem);
    SceneManager.push(Scene_ItemStorage);
  });
  class StorageCategories {
    constructor(item, weapon, armor, keyItem) {
      this._item = item;
      this._weapon = weapon;
      this._armor = armor;
      this._keyItem = keyItem;
    }
    get item() {
      return this._item;
    }
    get weapon() {
      return this._weapon;
    }
    get armor() {
      return this._armor;
    }
    get keyItem() {
      return this._keyItem;
    }
    categories() {
      const result = [];
      if (this.item) {
        result.push('item');
      }
      if (this.weapon) {
        result.push('weapon');
      }
      if (this.armor) {
        result.push('armor');
      }
      if (this.keyItem) {
        result.push('keyItem');
      }
      return result;
    }
    count() {
      return [this.item, this.weapon, this.armor, this.keyItem].filter((category) => category).length;
    }
  }
  /**
   * @param {Game_Temp.prototype} gameTemp
   */
  function Game_Temp_ItemStorageMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._storageCategories = null;
    };
    gameTemp.createStorageCategories = function (item, weapon, armor, keyItem) {
      this._storageCategories = new StorageCategories(item, weapon, armor, keyItem);
    };
    gameTemp.storageCategories = function () {
      return this._storageCategories;
    };
  }
  Game_Temp_ItemStorageMixIn(Game_Temp.prototype);
  class Game_StorageItems {
    constructor() {
      this._items = {};
      this._weapons = {};
      this._armors = {};
    }
    items() {
      return Object.keys(this._items).map((id) => $dataItems[Number(id)]);
    }
    weapons() {
      return Object.keys(this._weapons).map((id) => $dataWeapons[Number(id)]);
    }
    armors() {
      return Object.keys(this._armors).map((id) => $dataArmors[Number(id)]);
    }
    allItems() {
      return [...this.items(), ...this.weapons(), ...this.armors()];
    }
    itemContainer(item) {
      if (!item) {
        return null;
      } else if (DataManager.isItem(item)) {
        return this._items;
      } else if (DataManager.isWeapon(item)) {
        return this._weapons;
      } else if (DataManager.isArmor(item)) {
        return this._armors;
      } else {
        return null;
      }
    }
    numItems(item) {
      const container = this.itemContainer(item);
      return container ? container[item.id] || 0 : 0;
    }
    maxItems() {
      return settings.maxItems;
    }
    hasItem(item) {
      return this.numItems(item) > 0;
    }
    storeItem(item, amount) {
      const container = this.itemContainer(item);
      if (container) {
        const newNumber = this.numItems(item) + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems());
        if (container[item.id] === 0) {
          delete container[item.id];
        }
      }
    }
    fetchItem(item, amount) {
      this.storeItem(item, -amount);
    }
  }
  /**
   * @param {Game_Party.prototype} gameParty
   */
  function Game_Party_ItemStorageMixIn(gameParty) {
    const _initialize = gameParty.initialize;
    gameParty.initialize = function () {
      _initialize.call(this);
      this.initStorageItems();
    };
    gameParty.initStorageItems = function () {
      this._storageItems = new Game_StorageItems();
    };
    gameParty.storageItems = function () {
      if (!this._storageItems) {
        this.initStorageItems();
      }
      return this._storageItems;
    };
    /**
     * 倉庫にアイテムを預ける
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
     * @param {number} amount
     */
    gameParty.storeItemToStorage = function (item, amount) {
      this.storageItems().storeItem(item, amount);
      this.loseItem(item, amount, false);
    };
    /**
     * 倉庫からアイテムを引き出す
     * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
     * @param {number} amount
     */
    gameParty.fetchItemFromStorage = function (item, amount) {
      this.gainItem(item, amount, false);
      this.storageItems().fetchItem(item, amount);
    };
  }
  Game_Party_ItemStorageMixIn(Game_Party.prototype);
  class Scene_ItemStorage extends Scene_MenuBase {
    create() {
      super.create();
      this.createHelpWindow();
      this.createCategoryWindow();
      this.createInventoryWindow();
      this.createStorageWindow();
      this.createNumberWindow();
      if (!this._categoryWindow.needsSelection()) {
        this._categoryWindow.update();
        this.onCategoryOk();
      }
    }
    createCategoryWindow() {
      this._categoryWindow = new Window_StorageItemCategory(this.categoryWindowRect());
      this._categoryWindow.setHelpWindow(this._helpWindow);
      this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
      this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._categoryWindow);
      if (!this._categoryWindow.needsSelection()) {
        this._categoryWindow.height = 0;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
      }
    }
    categoryWindowRect() {
      return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, true));
    }
    createInventoryWindow() {
      this._inventoryWindow = new Window_StorageItemsParty(this.inventoryWindowRect());
      this._inventoryWindow.setHelpWindow(this._helpWindow);
      this._inventoryWindow.setHandler('ok', this.onInventoryOk.bind(this));
      this._inventoryWindow.setHandler('cancel', this.onItemCancel.bind(this));
      this.addWindow(this._inventoryWindow);
      this._categoryWindow.setItemWindow(this._inventoryWindow);
    }
    inventoryWindowRect() {
      const y = this._categoryWindow.y + this._categoryWindow.height;
      return new Rectangle(0, y, Graphics.boxWidth / 2, this.mainAreaBottom() - y);
    }
    createStorageWindow() {
      this._storageWindow = new Window_StorageItems(this.storageWindowRect());
      this._storageWindow.setHelpWindow(this._helpWindow);
      this._storageWindow.setHandler('ok', this.onStorageOk.bind(this));
      this._storageWindow.setHandler('cancel', this.onItemCancel.bind(this));
      this.addWindow(this._storageWindow);
      this._categoryWindow.setStorageWindow(this._storageWindow);
      this._storageWindow.setAnotherWindow(this._inventoryWindow);
      this._inventoryWindow.setAnotherWindow(this._storageWindow);
    }
    storageWindowRect() {
      return new Rectangle(
        Graphics.boxWidth / 2,
        this._inventoryWindow.y,
        Graphics.boxWidth / 2,
        this._inventoryWindow.height
      );
    }
    createNumberWindow() {
      this._numberWindow = new Window_StorageNumber(this.numberWindowRect());
      this._numberWindow.hide();
      this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
      this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
      this.addWindow(this._numberWindow);
    }
    numberWindowRect() {
      return this.inventoryWindowRect();
    }
    onCategoryOk() {
      this._inventoryWindow.activate();
      this._inventoryWindow.selectLast();
    }
    onInventoryOk() {
      this._inventoryWindow.deactivate();
      this._numberWindow.setup(this._inventoryWindow.item(), true);
      this._numberWindow.show();
      this._numberWindow.activate();
      this._storeMode = true;
    }
    onStorageOk() {
      this._storageWindow.deactivate();
      this._numberWindow.setup(this._storageWindow.item(), false);
      this._numberWindow.show();
      this._numberWindow.activate();
      this._storeMode = false;
    }
    onItemCancel() {
      this._inventoryWindow.deactivate();
      this._storageWindow.deactivate();
      if (this._categoryWindow.needsSelection()) {
        this._categoryWindow.activate();
      } else {
        this.popScene();
      }
    }
    onNumberOk() {
      if (this._storeMode) {
        $gameParty.storeItemToStorage(this._inventoryWindow.item(), this._numberWindow.number());
      } else {
        $gameParty.fetchItemFromStorage(this._storageWindow.item(), this._numberWindow.number());
      }
      this.endNumberInput();
      this._inventoryWindow.refresh();
      this._storageWindow.refresh();
      if (this._inventoryWindow.active) {
        this._inventoryWindow.updateHelp();
      } else {
        this._storageWindow.updateHelp();
      }
    }
    onNumberCancel() {
      SoundManager.playCancel();
      this.endNumberInput();
    }
    endNumberInput() {
      this._numberWindow.hide();
      if (this._storeMode) {
        this._inventoryWindow.activate();
      } else {
        this._storageWindow.activate();
      }
    }
  }
  class Window_StorageItemCategory extends Window_ItemCategory {
    maxCols() {
      return $gameTemp.storageCategories().count();
    }
    setStorageWindow(storageWindow) {
      this._storageWindow = storageWindow;
    }
    update() {
      super.update();
      if (this._storageWindow) {
        this._storageWindow.setCategory(this.currentSymbol());
      }
    }
    needsCommand(name) {
      return super.needsCommand(name) && !!$gameTemp.storageCategories()?.categories().includes(name);
    }
  }
  class Window_StorageItems extends Window_ItemList {
    maxCols() {
      return 1;
    }
    /**
     * @param {Window_StorageItems} anotherWindow
     */
    setAnotherWindow(anotherWindow) {
      this._anotherWindow = anotherWindow;
    }
    cursorDown(wrap) {
      if (this.maxItems() === 0) {
        return;
      }
      super.cursorDown(wrap);
    }
    cursorUp(wrap) {
      if (this.maxItems() === 0) {
        return;
      }
      super.cursorUp(wrap);
    }
    cursorRight() {
      this.toggleWindow();
    }
    cursorLeft() {
      this.toggleWindow();
    }
    processTouch() {
      if (!this.active && this._anotherWindow.active && TouchInput.isHovered() && this.isHovered()) {
        this._anotherWindow.toggleWindow();
      }
      super.processTouch();
    }
    isHovered() {
      const touchPos = new Point(TouchInput.x, TouchInput.y);
      const localPos = this.worldTransform.applyInverse(touchPos);
      return this.innerRect.contains(localPos.x, localPos.y);
    }
    isPartyItem() {
      return false;
    }
    isEnabled(item) {
      return (
        !!item &&
        (this.isPartyItem()
          ? $gameParty.storageItems().numItems(item) < settings.maxItems
          : $gameParty.numItems(item) < $gameParty.maxItems(item))
      );
    }
    isCursorMovable() {
      return this.isOpenAndActive();
    }
    makeItemList() {
      const allItems = this.isPartyItem() ? $gameParty.allItems() : $gameParty.storageItems().allItems();
      this._data = allItems.filter((item) => this.includes(item)).sort(orderIdSort);
      if (this.index() >= this.maxItems()) {
        this.select(this.maxItems() - 1);
      }
      if (this.sortEquips) {
        this.sortEquips();
      }
    }
    select(index) {
      super.select(index);
      this._lastSelected = this.index();
    }
    selectLast() {
      this.select(this._lastSelected > 0 ? this._lastSelected : 0);
    }
    toggleWindow() {
      if (this._wait > 0) {
        return;
      }
      this.playCursorSound();
      this.deactivate();
      this._anotherWindow.activate();
      this._anotherWindow.selectLast();
      this._anotherWindow.inputWait();
    }
    drawItemNumber(item, x, y, width) {
      if (this.isPartyItem()) {
        super.drawItemNumber(item, x, y, width);
      } else {
        this.drawText(':', x, y, width - this.textWidth(`${settings.maxItems}`), 'right');
        this.drawText(`${$gameParty.storageItems().numItems(item)}`, x, y, width, 'right');
      }
    }
    inputWait() {
      this._wait = 5;
    }
    update() {
      super.update();
      if (this._wait > 0) {
        this._wait--;
      }
    }
  }
  class Window_StorageItemsParty extends Window_StorageItems {
    isPartyItem() {
      return true;
    }
  }
  /**
   * Window_ShopNumberから数値入力ボタン系のメソッドを抜き出す
   * @param {Window_MenuNumber.prototype} windowClass
   */
  function Window_MenuNumberButtonMixIn(windowClass) {
    windowClass.createButtons = function () {
      Window_ShopNumber.prototype.createButtons.call(this);
    };
    windowClass.placeButtons = function () {
      Window_ShopNumber.prototype.placeButtons.call(this);
    };
    windowClass.totalButtonWidth = function () {
      return Window_ShopNumber.prototype.totalButtonWidth.call(this);
    };
    windowClass.buttonSpacing = function () {
      return Window_ShopNumber.prototype.buttonSpacing.call(this);
    };
    windowClass.buttonY = function () {
      /**
       * totalPriceYに依存するのは微妙なため上書き
       */
      return Math.floor(this.itemNameY() + this.lineHeight() * 2);
    };
    windowClass.isTouchOkEnabled = function () {
      return false;
    };
    windowClass.onButtonUp = function () {
      Window_ShopNumber.prototype.onButtonUp.call(this);
    };
    windowClass.onButtonUp2 = function () {
      Window_ShopNumber.prototype.onButtonUp2.call(this);
    };
    windowClass.onButtonDown = function () {
      Window_ShopNumber.prototype.onButtonDown.call(this);
    };
    windowClass.onButtonDown2 = function () {
      Window_ShopNumber.prototype.onButtonDown2.call(this);
    };
    windowClass.onButtonOk = function () {
      Window_ShopNumber.prototype.onButtonOk.call(this);
    };
  }
  class Window_MenuNumber extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._item = null;
      this._number = 1;
      this.createButtons();
      this.select(0);
      this._canRepeat = false;
    }
    isScrollEnabled() {
      return false;
    }
    number() {
      return this._number;
    }
    drawMultiplicationSign(x, y) {
      const sign = this.multiplicationSign();
      const width = this.textWidth(sign);
      this.resetTextColor();
      this.drawText(sign, x, y, width);
    }
    drawNumber(x, y) {
      const width = this.cursorWidth() - this.itemPadding();
      this.resetTextColor();
      this.drawText(`${this._number}`, x, y, width, 'right');
    }
    drawHorzLine(x, y, width) {
      this.drawRect(x, y, width, 5);
    }
    multiplicationSign() {
      return '\u00d7';
    }
    multiplicationSignX() {
      const sign = this.multiplicationSign();
      const width = this.textWidth(sign);
      return this.cursorX() - width * 2;
    }
    cursorWidth() {
      const padding = this.itemPadding();
      const digitWidth = this.textWidth('0');
      return this.maxDigits() * digitWidth + padding * 2;
    }
    cursorX() {
      const padding = this.itemPadding();
      return this.innerWidth - this.cursorWidth() - padding * 2;
    }
    maxDigits() {
      return 2;
    }
    processNumberChange() {
      if (Input.isRepeated('right')) {
        this.changeNumber(1);
      }
      if (Input.isRepeated('left')) {
        this.changeNumber(-1);
      }
      if (Input.isRepeated('up')) {
        this.changeNumber(10);
      }
      if (Input.isRepeated('down')) {
        this.changeNumber(-10);
      }
    }
    changeNumber(amount) {
      const lastNumber = this._number;
      this._number = (this._number + amount).clamp(1, this.max());
      if (this._number !== lastNumber) {
        this.playCursorSound();
        this.refresh();
      }
    }
    createButtons() {}
    placeButtons() {}
    totalButtonWidth() {
      return 0;
    }
    buttonSpacing() {
      return 0;
    }
    buttonY() {
      return 0;
    }
    onButtonUp() {}
    onButtonUp2() {}
    onButtonDown() {}
    onButtonDown2() {}
    onButtonOk() {}
    itemNameY() {
      return 0;
    }
    max() {
      return 1;
    }
  }
  Window_MenuNumberButtonMixIn(Window_MenuNumber.prototype);
  class Window_StorageNumber extends Window_MenuNumber {
    setup(item, toStorage) {
      this._item = item;
      this._number = 1;
      this._toStorage = toStorage;
      this.x = toStorage ? 0 : Graphics.boxWidth / 2;
      this.placeButtons();
      this.refresh();
    }
    /**
     * 指定可能な最大数
     * 倉庫に預ける場合は、現在の所持数と倉庫の空き数のうち小さい方
     * 倉庫から引き出す場合は、倉庫に預けている数と所持枠の空き数のうち小さい方
     */
    max() {
      if (!this._item) {
        return 1;
      }
      if (this._toStorage) {
        return Math.min(
          $gameParty.numItems(this._item),
          $gameParty.storageItems().maxItems() - $gameParty.storageItems().numItems(this._item)
        );
      }
      return Math.min(
        $gameParty.storageItems().numItems(this._item),
        $gameParty.maxItems(this._item) - $gameParty.numItems(this._item)
      );
    }
    refresh() {
      super.refresh();
      this.drawItemBackground(0);
      this.drawCurrentItemName();
      this.drawMultiplicationSign(this.multiplicationSignX(), this.itemNameY());
      this.drawNumber(this.cursorX(), this.itemNameY());
      this.drawHorzLine();
      this.drawNumberChange();
    }
    drawCurrentItemName() {
      const padding = this.itemPadding();
      const x = padding * 2;
      const y = this.itemNameY();
      const width = this.multiplicationSignX() - padding * 3;
      this.drawItemName(this._item, x, y, width);
    }
    drawHorzLine() {
      const padding = this.itemPadding();
      const lineHeight = this.lineHeight();
      const itemY = this.itemNameY();
      const x = padding;
      const y = itemY + Math.floor((lineHeight * 3) / 2);
      const width = this.innerWidth - padding * 2;
      super.drawHorzLine(x, y, width);
    }
    drawNumberChange() {
      if (!this._item) {
        return;
      }
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${settings.partyItemCountText}:`, 0, 0);
      this.drawText(`${settings.storageItemCountText}:`, 0, this.lineHeight());
      const changePartyItemNumber = this._toStorage ? -this._number : this._number;
      this.changeTextColor(ColorManager.paramchangeTextColor(changePartyItemNumber));
      this.drawText(`${$gameParty.numItems(this._item) + changePartyItemNumber}`, 0, 0, this.innerWidth, 'right');
      this.changeTextColor(ColorManager.paramchangeTextColor(-changePartyItemNumber));
      this.drawText(
        `${$gameParty.storageItems().numItems(this._item) - changePartyItemNumber}`,
        0,
        this.lineHeight(),
        this.innerWidth,
        'right'
      );
      this.resetTextColor();
    }
    itemNameY() {
      return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5);
    }
    maxDigits() {
      return Math.floor(Math.log10(settings.maxItems)) + 1;
    }
    update() {
      super.update();
      this.processNumberChange();
    }
    itemRect() {
      return new Rectangle(this.cursorX(), this.itemNameY(), this.cursorWidth(), this.lineHeight());
    }
  }
  globalThis.Game_StorageItems = Game_StorageItems;
  globalThis.Scene_ItemStorage = Scene_ItemStorage;
  globalThis.Window_StorageItems = Window_StorageItems;
  globalThis.Window_StorageNumber = Window_StorageNumber;
})();
