/// <reference path="./CommonEventByDiscardItem.d.ts" />

import { settings } from '../config/_build/DarkPlasma_CommonEventByDiscardItem_parameters';

function Scene_Item_CommonEventByDiscardItemMixIn(sceneItem: Scene_Item) {
  const _discardItem = sceneItem.discardItem;
  sceneItem.discardItem = function () {
    const item = this.item() as MZ.Item|MZ.Weapon|MZ.Armor;
    $gameVariables.setValue(settings.discardItemVariable, item.id);
    _discardItem.call(this);
    if (DataManager.isItem(item)) {
      $gameTemp.reserveCommonEvent(settings.itemDiscardCommonEvent);
    } else if (DataManager.isWeapon(item)) {
      $gameTemp.reserveCommonEvent(settings.weaponDiscardCommonEvent);
    } else if (DataManager.isArmor(item)) {
      $gameTemp.reserveCommonEvent(settings.armorDiscardCommonEvent);
    }
    this.checkCommonEvent();
  };
}

Scene_Item_CommonEventByDiscardItemMixIn(Scene_Item.prototype);
