/// <reference path="./WishListForFusionItem.d.ts" />

import { settings } from '../config/_build/DarkPlasma_WishListForFusionItem_parameters';

function Scene_FusionItem_WishListMixIn(sceneFusionItem: Scene_FusionItem) {
  const _createBuyWindow = sceneFusionItem.createBuyWindow;
  sceneFusionItem.createBuyWindow = function () {
    _createBuyWindow.call(this);
    this._buyWindow.setHandler('wishList', () => this.registerWishListItem());
  };

  sceneFusionItem.registerWishListItem = function () {
    const wishListItem = this._buyWindow.currentItemForWishList();
    const resultData = wishListItem.resultData();
    if (resultData) {
      if (!$gameParty.isInWishList(resultData)) {
        $gameParty.addWishListItem(resultData, wishListItem.materials);
        if (settings.registerMessage) {
          $gameMessage.add(settings.registerMessage.replaceAll("{item}", `${resultData.name}`));
        }
      } else {
        $gameParty.deleteWishListItem(resultData!);
      }
    }
    this._buyWindow.refresh();
    this._buyWindow.activate();
  };
}

Scene_FusionItem_WishListMixIn(Scene_FusionItem.prototype);

function Window_FusionShopBuy_WishListMixIn(windowFusionShopBuy: Window_FusionShopBuy) {
  windowFusionShopBuy.currentItemForWishList = function () {
    return new Game_WishListItem(
      {
        kind: DataManager.kindOf(this.item())!,
        dataId: this.item().id,
      },
      this.materials().map(material => {
        return {
          kind: DataManager.kindOf(material.data)!,
          dataId: material.data.id,
          count: material.count,
        };
      })
    );
  };

  const _drawItemName = windowFusionShopBuy.drawItemName;
  windowFusionShopBuy.drawItemName = function (item, x, y, width) {
    const mustHighlight = $gameParty.isInWishList(item as MZ.Item | MZ.Weapon | MZ.Armor | null);
    const _resetTextColor = this.resetTextColor;
    if (mustHighlight) {
      this.changeTextColor(ColorManager.wishListRegisteredColor());
      this.resetTextColor = () => { };
    }
    _drawItemName.call(this, item, x, y, width);
    if (mustHighlight) {
      this.resetTextColor = _resetTextColor;
      this.resetTextColor();
    }
  };
}

Window_FusionShopBuy_WishListMixIn(Window_FusionShopBuy.prototype);
Window_CustomKeyHandlerMixIn(settings.registerKey, Window_FusionShopBuy.prototype, "wishList");
