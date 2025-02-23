/// <reference path="./StoreWishList.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { DataManagerMixIn } from '../../../common/manager/DataManagerMixIn';
import { command_sceneWishList } from '../config/_build/DarkPlasma_StoreWishList_commands';
import { settings } from '../config/_build/DarkPlasma_StoreWishList_parameters';

PluginManager.registerCommand(pluginName, command_sceneWishList, function () {
  SceneManager.push(Scene_WishList);
});

ColorManager.wishListRegisteredColor = function () {
  return typeof settings.wishListRegisteredColor === "string"
    ? settings.wishListRegisteredColor
    : this.textColor(settings.wishListRegisteredColor);
};

DataManagerMixIn(DataManager);

class Game_WishListItem {
  _result: ItemWeaponArmorId;
  _materials: Game_WishListItemMaterial[];

  constructor(result: ItemWeaponArmorId, materials: Game_WishListItemMaterial[]) {
    this._result = result;
    this._materials = materials;
  }

  get result() {
    return this._result;
  }

  get materials() {
    return this._materials;
  }

  resultData() {
    return DataManager.dataObject(this._result.kind, this._result.dataId);
  }
}

class Game_WishList {
  _items: Game_WishListItem[];

  constructor() {
    this._items = [];
  }

  get items() {
    return this._items;
  }

  add(data: MZ.Item | MZ.Weapon | MZ.Armor, materials: Game_WishListItemMaterial[]) {
    const wishListItem = new Game_WishListItem(
      this.toItemWeaponArmorId(data),
      materials,
    );
    const index = this._items.findIndex(
      item => item.result.dataId === wishListItem.result.dataId && item.result.kind === wishListItem.result.kind
    );
    if (index >= 0) {
      this._items[index] = wishListItem;
    } else {
      this._items.push(wishListItem);
    }
  }

  delete(data: MZ.Item | MZ.Weapon | MZ.Armor) {
    const result = this.toItemWeaponArmorId(data);
    this._items = this._items.filter(
      item => item.result.dataId !== result.dataId || item.result.kind !== result.kind
    );
  }

  item(data: MZ.Item | MZ.Weapon | MZ.Armor) {
    const result = this.toItemWeaponArmorId(data);
    return this._items.find(
      item => item.result.dataId === result.dataId && item.result.kind === result.kind
    );
  }

  isInList(data: MZ.Item | MZ.Weapon | MZ.Armor) {
    const result = this.toItemWeaponArmorId(data);
    return this._items.some(
      item => item.result.dataId === result.dataId && item.result.kind === result.kind
    );
  }

  isMaterialCompleted(data: MZ.Item | MZ.Weapon | MZ.Armor) {
    const item = this.item(data);
    return !!item && item.materials
      .every(material => $gameParty.numItems(DataManager.dataObject(material.kind, material.dataId)!) >= material.count);
  }

  itemsHaveMaterial(material: MZ.Item | MZ.Weapon | MZ.Armor) {
    return this.items.filter(item => item.materials.some(m => m.dataId === material.id && m.kind === DataManager.kindOf(material)));
  }

  toItemWeaponArmorId(data: MZ.Item | MZ.Weapon | MZ.Armor): ItemWeaponArmorId {
    return {
      kind: DataManager.kindOf(data)!,
      dataId: data.id,
    };
  }
}

function Game_Party_WishListMixIn(gameParty: Game_Party) {
  gameParty.wishList = function () {
    if (!this._wishList) {
      this._wishList = new Game_WishList();
    }
    return this._wishList;
  };

  gameParty.addWishListItem = function (result, materials) {
    this.wishList().add(result, materials);
  };

  gameParty.deleteWishListItem = function (result) {
    this.wishList().delete(result);
  }

  gameParty.isInWishList = function (result) {
    return !!result && this.wishList().isInList(result);
  };

  const _gainItem = gameParty.gainItem;
  gameParty.gainItem = function (item, amount, includeEquip) {
    _gainItem.call(this, item, amount, includeEquip);
    if (item && amount > 0) {
      if (this.isInWishList(item)) {
        this.deleteWishListItem(item);
      }
    }
  };
}

Game_Party_WishListMixIn(Game_Party.prototype);

class Scene_WishList extends Scene_MenuBase {
  _listWindow: Window_WishList;
  _wishListDetailWindow: Window_WishListDetail;

  public create(): void {
    super.create();
    this.createHelpWindow();
    this.createListWindow();
    this.createWishListDetailWindow();
  }

  public start(): void {
    super.start();
    this._listWindow.activate();
  }

  createListWindow() {
    this._listWindow = new Window_WishList(this.listWindowRect());
    this._listWindow.setHelpWindow(this._helpWindow!);
    this._listWindow.setHandler('ok', () => this.onListOk());
    this._listWindow.setHandler('cancel', () => this.onListCancel());
    this.addWindow(this._listWindow);
  }

  createWishListDetailWindow() {
    this._wishListDetailWindow = new Window_WishListDetail(this.wishListDetailWindowRect());
    this._wishListDetailWindow.setHelpWindow(this._helpWindow!);
    this._wishListDetailWindow.setHandler('cancel', () => this.onWishListDetailCancel());
    this._listWindow.setWishListDetailWindow(this._wishListDetailWindow);
    this.addWindow(this._wishListDetailWindow);
  }

  listWindowRect() {
    return new Rectangle(0, this.mainAreaTop(), Math.floor(Graphics.boxWidth / 2), this.mainAreaHeight());
  }

  wishListDetailWindowRect() {
    const listWindowRect = this.listWindowRect();
    const x = listWindowRect.x + listWindowRect.width;
    return new Rectangle(
      x,
      this.mainAreaTop(),
      Graphics.boxWidth - x,
      this.mainAreaHeight()
    );
  }

  onListOk() {
    this._listWindow.deactivate();
    this._wishListDetailWindow.activate();
    this._wishListDetailWindow.select(0);
    this._wishListDetailWindow.updateHelp();
  }

  onListCancel() {
    this.popScene();
  }

  onWishListDetailCancel() {
    this._wishListDetailWindow.deselect();
    this._wishListDetailWindow.deactivate();
    this._listWindow.activate();
    this._listWindow.updateHelp();
  }
}

class Window_WishList extends Window_Selectable {
  _data: Game_WishListItem[];
  _wishListDetailWindow: Window_WishListDetail;

  setWishListDetailWindow(detailWindow: Window_WishListDetail): void {
    this._wishListDetailWindow = detailWindow;
    this.refresh();
  }

  public makeItemList(): void {
    this._data = $gameParty.wishList().items;
  }

  public maxItems(): number {
    return this._data ? this._data.length : 1;
  }

  item(): Game_WishListItem | null {
    return this.itemAt(this.index());
  }

  itemAt(index: number): Game_WishListItem | null {
    return this._data ? this._data[index] || null : null;
  }

  public isCurrentItemEnabled(): boolean {
    return !!this.item();
  }

  public drawAllItems(): void {
    if (this.maxItems() === 0) {
      this.drawText(settings.emptyText, 0, 0, this.innerWidth);
    } else {
      super.drawAllItems();
    }
  }

  public drawItem(index: number): void {
    const item = this.itemAt(index);
    if (item) {
      const rect = this.itemLineRect(index);
      this.drawItemName(item.resultData() || null, rect.x, rect.y, rect.width);
    }
  }

  public updateHelp(): void {
    super.updateHelp();
    this.setHelpWindowItem(this.item()?.resultData() || null);
    if (this._wishListDetailWindow) {
      this._wishListDetailWindow.setItem(this.item())
    }
  }

  public refresh(): void {
    this.makeItemList();
    super.refresh();
  }
}

class Window_WishListDetail extends Window_Selectable {
  _item: Game_WishListItem | null;

  setItem(item: Game_WishListItem | null) {
    if (this._item !== item) {
      this._item = item;
      this.refresh();
    }
  }

  public maxItems(): number {
    return this._item ? this._item.materials.length : 0;
  }

  itemAt(index: number): Game_WishListItemMaterial | null {
    return this._item?.materials[index] || null;
  }

  item(): Game_WishListItemMaterial | null {
    return this.itemAt(this.index());
  }

  isEnabled(item: Game_WishListItemMaterial | null) {
    return item ? $gameParty.numItems(DataManager.dataObject(item.kind, item.dataId)!) >= item.count : false;
  }

  public itemRect(index: number): Rectangle {
    const rect = super.itemRect(index);
    rect.y += this.lineHeight() * 3;
    return rect;
  }

  public drawAllItems(): void {
    if (!this._item) {
      return;
    }
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(settings.resultLabel, 0, 0, this.innerWidth);
    this.drawText(settings.materialLabel, 0, this.lineHeight() * 2, this.innerWidth);
    this.drawItemName(this._item.resultData() || null, 0, this.lineHeight(), this.innerWidth);
    super.drawAllItems();
  }

  public drawItem(index: number): void {
    const item = this.itemAt(index);
    if (item) {
      const data = DataManager.dataObject(item.kind, item.dataId);
      if (data) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(data || null, rect.x, rect.y, rect.width - numberWidth);
        this.drawMaterialCount($gameParty.numItems(data), item.count, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
      }
    }
  }

  numberWidth() {
    return this.textWidth("000/000");
  }

  drawMaterialCount(count: number, required: number, x: number, y: number, width: number) {
    this.drawText(":", x, y, width - this.textWidth("000/000"), "right");
    this.drawText(`${count}/${required}`, x, y, width, "right");
  }

  public updateHelp(): void {
    super.updateHelp();
    const item = this.item();
    if (item) {
      this.setHelpWindowItem(DataManager.dataObject(item.kind, item.dataId));
    }
  }
}

type _Game_WishList = typeof Game_WishList;
type _Game_WishListItem = typeof Game_WishListItem;
type _Scene_WishList = typeof Scene_WishList;
type _Window_WishList = typeof Window_WishList;
type _Window_WishListDetail = typeof Window_WishListDetail;
declare global {
  var Game_WishList: _Game_WishList;
  var Game_WishListItem: _Game_WishListItem;
  var Scene_WishList: _Scene_WishList;
  var Window_WishList: _Window_WishList;
  var Window_WishListDetail: _Window_WishListDetail;
}
globalThis.Game_WishList = Game_WishList;
globalThis.Game_WishListItem = Game_WishListItem;
globalThis.Scene_WishList = Scene_WishList;
globalThis.Window_WishList = Window_WishList;
globalThis.Window_WishListDetail = Window_WishListDetail;
