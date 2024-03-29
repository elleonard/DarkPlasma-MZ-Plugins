/// <reference path="./HighlightNewItem.d.ts" />
import { settings } from './_build/DarkPlasma_HighlightNewItem_parameters';

/**
 * @param {Game_Actor.prototype} gameActor
 */
function Game_Actor_HighlightNewItemMixIn(gameActor: Game_Actor) {
  const _tradeItemWithParty = gameActor.tradeItemWithParty;
  gameActor.tradeItemWithParty = function (this: Game_Actor, newItem, oldItem) {
    const result = _tradeItemWithParty.call(this, newItem, oldItem);
    if (result && oldItem) {
      /**
       * 装備変更後に新アイテムとしてマークされてしまうので強引に触る
       */
      $gameParty.touchItem(oldItem);
    }
    return result;
  };
}

Game_Actor_HighlightNewItemMixIn(Game_Actor.prototype);

/**
 * @param {Game_Party.prototype} gameParty
 */
function Game_Party_HighlightNewItemMixIn(gameParty: Game_Party) {
  const _initAllItems = gameParty.initAllItems;
  gameParty.initAllItems = function (this: Game_Party) {
    _initAllItems.call(this);
    this.initializeNewItems();
  };

  gameParty.initializeNewItems = function (this: Game_Party) {
    this._newItemIds = [];
    this._newWeaponIds = [];
    this._newArmorIds = [];
  };

  const _gainItem = gameParty.gainItem;
  gameParty.gainItem = function (this: Game_Party, item, amount, includeEquip) {
    _gainItem.call(this, item, amount, includeEquip);
    if (item) {
      if (amount > 0) {
        this.addNewItems(item);
      } else {
        this.touchItem(item);
      }
    }
  };

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   */
  gameParty.touchItem = function (this: Game_Party, item: MZ.Item | MZ.Weapon | MZ.Armor) {
    if (DataManager.isItem(item)) {
      if (!this._newItemIds) {
        this._newItemIds = [];
      }
      this._newItemIds = this._newItemIds.filter((id) => id && id !== item.id);
    } else if (DataManager.isWeapon(item)) {
      if (!this._newWeaponIds) {
        this._newWeaponIds = [];
      }
      this._newWeaponIds = this._newWeaponIds.filter((id) => id && id !== item.id);
    } else if (DataManager.isArmor(item)) {
      if (!this._newArmorIds) {
        this._newArmorIds = [];
      }
      this._newArmorIds = this._newArmorIds.filter((id) => id && id !== item.id);
    }
  };

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   */
  gameParty.addNewItems = function (this: Game_Party, item: MZ.Item | MZ.Weapon | MZ.Armor) {
    if (this.hasItemAsNew(item)) {
      return;
    }
    if (DataManager.isItem(item)) {
      this._newItemIds.push(item.id);
    } else if (DataManager.isWeapon(item)) {
      this._newWeaponIds.push(item.id);
    } else if (DataManager.isArmor(item)) {
      this._newArmorIds.push(item.id);
    }
  };

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   * @return {boolean}
   */
  gameParty.hasItemAsNew = function (this: Game_Party, item: MZ.Item | MZ.Weapon | MZ.Armor): boolean {
    if (!this._newItemIds) {
      this._newItemIds = [];
    }
    const newItemIds = DataManager.isItem(item)
      ? this.newItemIds()
      : DataManager.isWeapon(item)
        ? this.newWeaponIds()
        : this.newArmorIds();
    return this.hasItem(item, false) && newItemIds.includes(item.id);
  };

  gameParty.newItemIds = function (this: Game_Party) {
    if (!this._newItemIds) {
      this._newItemIds = [];
    }
    return this._newItemIds;
  };

  gameParty.newWeaponIds = function (this: Game_Party) {
    if (!this._newWeaponIds) {
      this._newWeaponIds = [];
    }
    return this._newWeaponIds;
  };

  gameParty.newArmorIds = function (this: Game_Party) {
    if (!this._newArmorIds) {
      this._newArmorIds = [];
    }
    return this._newArmorIds;
  };
}

Game_Party_HighlightNewItemMixIn(Game_Party.prototype);

/**
 * @param {Window_ItemList.prototype} windowClass
 */
function Window_ItemList_HighlightNewItemMixIn(windowClass: Window_ItemList) {
  const _initialize = windowClass.initialize;
  windowClass.initialize = function (rect) {
    _initialize.call(this, rect);
    this._touchRequestedItem = null;
    if (settings.newItemToTop) {
      this._newItemsForSort = $gameParty.newItemIds().map(itemId => $dataItems[itemId]);
      this._newWeaponsForSort = $gameParty.newWeaponIds().map(weaponId => $dataWeapons[weaponId]);
      this._newArmorsForSort = $gameParty.newArmorIds().map(armorId => $dataArmors[armorId]);
    }
  };

  windowClass.requestTouch = function (item) {
    this.processTouchRequest();
    if (item && this.isNewItem(item)) {
      this._touchRequestedItem = item;
    }
  };

  windowClass.processTouchRequest = function () {
    if (this._touchRequestedItem) {
      $gameParty.touchItem(this._touchRequestedItem);
      this._touchRequestedItem = null;
      this.refresh();
    }
  };

  const _processOk = windowClass.processOk;
  windowClass.processOk = function () {
    _processOk.call(this);
    this.processTouchRequest();
  };

  const _processCancel = windowClass.processCancel;
  windowClass.processCancel = function () {
    _processCancel.call(this);
    this.processTouchRequest();
  };

  const _drawItemName = windowClass.drawItemName;
  windowClass.drawItemName = function (this: Window_ItemList, item, x, y, width) {
    if (this.isNewItem(item)) {
      this.drawNewItemName(item, x, y, width!);
    } else {
      _drawItemName.call(this, item, x, y, width);
    }
  };

  /**
   * 新しいアイテムを描画する
   * 色を変えるため、描画中は resetTextColor を上書きする
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 幅
   */
  windowClass.drawNewItemName = function (this: Window_ItemList, item: MZ.Item | MZ.Weapon | MZ.Armor, x: number, y: number, width: number): void {
    const resetTextColor = this.resetTextColor;
    this.resetTextColor = () => { };
    this.changeTextColor(ColorManager.textColor(settings.newItemColor));
    _drawItemName.call(this, item, x, y, width);
    this.resetTextColor = resetTextColor;
    this.resetTextColor();
  };

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {boolean}
   */
  windowClass.isNewItem = function (item: MZ.Item | MZ.Weapon | MZ.Armor): item is MZ.Item | MZ.Weapon | MZ.Armor {
    return !!item && !DataManager.isSkill(item) && $gameParty.hasItemAsNew(item);
  };

  const _select = windowClass.select;
  windowClass.select = function (this: Window_ItemList, index) {
    _select.call(this, index);
    this.requestTouch(this.item());
  };

  windowClass.isNewItemForSort = function (this: Window_ItemList, item: MZ.Item | MZ.Weapon | MZ.Armor): boolean {
    return DataManager.isItem(item)
      ? this._newItemsForSort.includes(item)
      : DataManager.isWeapon(item)
        ? this._newWeaponsForSort.includes(item)
        : this._newArmorsForSort.includes(item);
  };

  if (settings.newItemToTop) {
    const _makeItemList = windowClass.makeItemList;
    windowClass.makeItemList = function (this: Window_ItemList): void {
      _makeItemList.call(this);
      this._data.sort((a, b) => {
        if (a === null && b === null) {
          return 0;
        } else if (a === null) {
          return 1;
        } else if (b === null) {
          return -1;
        }
        if (this.isNewItemForSort(a)) {
          return -1;
        } else if (this.isNewItemForSort(b)) {
          return 1;
        }
        return 0;
      });
    };
  }
}

Window_ItemList_HighlightNewItemMixIn(Window_ItemList.prototype);
