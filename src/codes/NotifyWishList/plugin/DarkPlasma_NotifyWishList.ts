/// <reference path="./NotifyWishList.d.ts" />

import { isSameKindItem } from '../../../common/data/isSameKindItem';
import { settings } from '../config/_build/DarkPlasma_NotifyWishList_parameters';

function Game_Temp_NotifyWishListMixIn(gameTemp: Game_Temp) {
  gameTemp.clearRecentNotifiedWishListItems = function () {
    this._recentNotifiedWishListItems = [];
  };

  gameTemp.pushRecentNotifiedWishListItem = function (item) {
    if (!this._recentNotifiedWishListItems) {
      this._recentNotifiedWishListItems = [];
    }
    this._recentNotifiedWishListItems.push(item);
  };

  gameTemp.removeRecentNotifiedWishListItem = function (item) {
    if (!this._recentNotifiedWishListItems) {
      this._recentNotifiedWishListItems = [];
    }
    this._recentNotifiedWishListItems = this._recentNotifiedWishListItems
      .filter(i => i.id !== item.id || !isSameKindItem(i, item));
  };

  gameTemp.isRecentNotifiedWishListItem = function (item) {
    if (!this._recentNotifiedWishListItems) {
      this._recentNotifiedWishListItems = [];
    }
    return this._recentNotifiedWishListItems.some(i => i.id === item.id && isSameKindItem(i, item));
  };

  gameTemp.reservedWishListNotifyItems = function () {
    if (!this._reservedWishListNotifyItems) {
      this._reservedWishListNotifyItems = [];
    }
    return this._reservedWishListNotifyItems;
  };

  gameTemp.reserveWishListNotification = function (notifyItem) {
    this.reservedWishListNotifyItems().push(notifyItem);
  };

  gameTemp.shiftReservedWishListNotification = function () {
    return this.reservedWishListNotifyItems().shift();
  };
}

Game_Temp_NotifyWishListMixIn(Game_Temp.prototype);

function Game_WishList_NotifyMixIn(gameWishList: Game_WishList) {
  gameWishList.mustNotifyCompletion = function (data) {
    const result = this.toItemWeaponArmorId(data);
    const wishListItem = this.items.find(item => item.result.dataId === result.dataId && item.result.kind === result.kind);
    if (!wishListItem) {
      return false;
    }
    return !$gameTemp.isRecentNotifiedWishListItem(data) && this.isMaterialCompleted(data);
  };

  gameWishList.notifyCompletionByGainMaterial = function (material) {
    const targets = this.itemsHaveMaterial(material);
    targets
      .filter(target => this.mustNotifyCompletion(DataManager.dataObject(target.result.kind, target.result.dataId)!))
      .forEach(target => {
        const data = DataManager.dataObject(target.result.kind, target.result.dataId);
        if (data) {
          $gameTemp.reserveWishListNotification(new Torigoya.NotifyMessage.NotifyItem({
            message: settings.message.replaceAll("{item}", `${data.name}`),
            icon: data.iconIndex,
          }));
          $gameTemp.pushRecentNotifiedWishListItem(data);
        }
      });
  };

  const _delete = gameWishList.delete;
  gameWishList.delete = function (item) {
    _delete.call(this, item);
    $gameTemp.removeRecentNotifiedWishListItem(item);
  };
}

Game_WishList_NotifyMixIn(Game_WishList.prototype);

function Game_Party_NotifyWishListMixIn(gameParty: Game_Party) {
  const _gainItem = gameParty.gainItem;
  gameParty.gainItem = function (item, amount, includeEquip) {
    _gainItem.call(this, item, amount, includeEquip);
    if (item && amount > 0) {
      /**
       * そのアイテムを素材とする成果物の素材が揃っていれば通知する
       */
      this.wishList().notifyCompletionByGainMaterial(item);
    }
  };
}

Game_Party_NotifyWishListMixIn(Game_Party.prototype);

function Scene_NotifyWishListMixIn(sceneClass: Scene_Base) {
  sceneClass.notifyWishListItem = function () {
    const notifyItem = $gameTemp.shiftReservedWishListNotification();
    if (notifyItem) {
      Torigoya.NotifyMessage.Manager.notify(notifyItem);
    }
  };

  sceneClass.canNotifyWishListItem = function () {
    return false;
  };

  const _update = sceneClass.update;
  sceneClass.update = function () {
    _update.call(this);
    if (this.canNotifyWishListItem()) {
      this.notifyWishListItem();
    }
  };
}

Scene_NotifyWishListMixIn(Scene_Base.prototype);

function Scene_CanNotifyWishListMixIn(sceneClass: Scene_Map | Scene_MenuBase) {
  sceneClass.canNotifyWishListItem = function () {
    return this._fadeDuration <= 0;
  };
}

Scene_CanNotifyWishListMixIn(Scene_Map.prototype);
Torigoya.NotifyMessage.parameter.advancedAppendScenes
  .filter(scene => scene in globalThis)
  .forEach(scene => Scene_CanNotifyWishListMixIn(window[scene as keyof _Window].prototype));
