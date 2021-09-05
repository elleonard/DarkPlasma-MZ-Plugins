import { settings } from './_build/DarkPlasma_HighlightNewItem_parameters';

Game_Party = class extends Game_Party {
  gainItem(item, amount, includeEquip) {
    super.gainItem(item, amount, includeEquip);
    if (amount > 0) {
      this.addNewItems(item);
    } else {
      this.touchItem(item);
    }
  }

  /**
   * アイテムを新しいアイテム扱いではなくする
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   */
  touchItem(item) {
    if (!this._newItemIds) {
      this._newItemIds = [];
    }
    this._newItemIds = this._newItemIds.filter((id) => id !== item.id);
  }

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   */
  addNewItems(item) {
    if (!this._newItemIds) {
      this._newItemIds = [];
    }
    if (!this.hasItemAsNew(item)) {
      this._newItemIds.push(item.id);
    }
  }

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   * @return {boolean}
   */
  hasItemAsNew(item) {
    if (!this._newItemIds) {
      this._newItemIds = [];
    }
    return this.hasItem(item, false) && this._newItemIds.includes(item.id);
  }
};

Window_ItemList = class extends Window_ItemList {
  drawItemName(item, x, y, width) {
    if (this.isNewItem(item)) {
      this.drawNewItemName(item, x, y, width);
    } else {
      super.drawItemName(item, x, y, width);
    }
  }

  /**
   * 新しいアイテムを描画する
   * 色を変えるため、描画中は resetTextColor を上書きする
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
   * @param {number} x X座標
   * @param {number} y Y座標
   * @param {number} width 幅
   */
  drawNewItemName(item, x, y, width) {
    const resetTextColor = this.resetTextColor;
    this.resetTextColor = () => {};
    this.changeTextColor(ColorManager.textColor(settings.newItemColor));
    super.drawItemName(item, x, y, width);
    this.resetTextColor = resetTextColor;
    this.resetTextColor();
  }

  /**
   * @param {MZ.Item | MZ.Weapon | MZ.Armor} item
   * @return {boolean}
   */
  isNewItem(item) {
    return $gameParty.hasItemAsNew(item);
  }

  select(index) {
    super.select(index);
    const item = this.item();
    if (item && this.isNewItem(item)) {
      $gameParty.touchItem(item);
      this.refresh();
    }
  }
};
