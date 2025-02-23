// DarkPlasma_WishListForFusionItem 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/02/23 1.0.0 公開
 */

/*:
 * @plugindesc アイテム融合ショップ用ウィッシュリスト登録
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_StoreWishList
 * @base DarkPlasma_FusionItem
 * @base DarkPlasma_CustomKeyHandler
 * @orderAfter DarkPlasma_FusionItem
 * @orderAfter DarkPlasma_CustomKeyHandler
 *
 * @param registerKey
 * @desc 融合ショップでこのキーを押すと、対象アイテムをウィッシュリスト登録/削除します。
 * @text 登録/削除キー
 * @type select
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @param registerMessage
 * @desc ウィッシュリスト登録時にメッセージを表示します。
 * @text 登録時メッセージ
 * @type multiline_string
 * @default {item}をウィッシュリストに登録しました。
 *
 * @help
 * version: 1.0.0
 * アイテム融合ショップでウィッシュリスト登録できます。
 * アイテム融合ショップでそのアイテムを入手すると、
 * ウィッシュリストから削除します。
 *
 * ウィッシュリスト登録時のメッセージ表示について
 * DarkPlasma_Scene_MessageMixIn など、
 * 融合ショップにメッセージウィンドウを追加するプラグインがあると
 * ショップで登録した際にその場でメッセージ表示できます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_StoreWishList version:1.0.0
 * DarkPlasma_FusionItem version:2.1.1
 * DarkPlasma_CustomKeyHandler version:1.3.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_FusionItem
 * DarkPlasma_CustomKeyHandler
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    registerKey: String(pluginParameters.registerKey || `shift`),
    registerMessage: String(pluginParameters.registerMessage || `{item}をウィッシュリストに登録しました。`),
  };

  function Scene_FusionItem_WishListMixIn(sceneFusionItem) {
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
            $gameMessage.add(settings.registerMessage.replaceAll('{item}', `${resultData.name}`));
          }
        } else {
          $gameParty.deleteWishListItem(resultData);
        }
      }
      this._buyWindow.refresh();
      this._buyWindow.activate();
    };
  }
  Scene_FusionItem_WishListMixIn(Scene_FusionItem.prototype);
  function Window_FusionShopBuy_WishListMixIn(windowFusionShopBuy) {
    windowFusionShopBuy.currentItemForWishList = function () {
      return new Game_WishListItem(
        {
          kind: DataManager.kindOf(this.item()),
          dataId: this.item().id,
        },
        this.materials().map((material) => {
          return {
            kind: DataManager.kindOf(material.data),
            dataId: material.data.id,
            count: material.count,
          };
        }),
      );
    };
    const _drawItemName = windowFusionShopBuy.drawItemName;
    windowFusionShopBuy.drawItemName = function (item, x, y, width) {
      const mustHighlight = $gameParty.isInWishList(item);
      const _resetTextColor = this.resetTextColor;
      if (mustHighlight) {
        this.changeTextColor(ColorManager.wishListRegisteredColor());
        this.resetTextColor = () => {};
      }
      _drawItemName.call(this, item, x, y, width);
      if (mustHighlight) {
        this.resetTextColor = _resetTextColor;
        this.resetTextColor();
      }
    };
  }
  Window_FusionShopBuy_WishListMixIn(Window_FusionShopBuy.prototype);
  Window_CustomKeyHandlerMixIn(settings.registerKey, Window_FusionShopBuy.prototype, 'wishList');
})();
