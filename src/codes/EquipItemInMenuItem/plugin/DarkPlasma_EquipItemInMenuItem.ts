/// <reference path="./EquipItemInMenuItem.d.ts" />

function Scene_Item_EquipItemMixIn(sceneItem: Scene_Item) {
  const _createItemCommandWindow = sceneItem.createItemCommandWindow;
  sceneItem.createItemCommandWindow = function () {
    _createItemCommandWindow.call(this);
    this._itemCommandWindow.setHandler('equip', () => this.determineEquip());
  };

  sceneItem.determineEquip = function () {
    const item = this.item();
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      this._itemCommandWindow.hide();
      this.showActorWindow();
      this._actorWindow.selectForEquip(item);
    }
  };

  const _onActorOk = sceneItem.onActorOk;
  sceneItem.onActorOk = function () {
    const item = this.item();
    const actor = $gameParty.menuActor();
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      if (actor.canEquip(item)) {
        this.equipItem();
      } else {
        SoundManager.playBuzzer();
      }
    } else {
      _onActorOk.call(this);
    }
  };

  sceneItem.equipItem = function () {
    const item = this.item();
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      SoundManager.playEquip();
      $gameParty.menuActor().changeEquipById(item.etypeId, item.id);
      this._itemWindow.refresh();
      this.hideActorWindow();
      this.activateItemWindow();
    }
  };
}

Scene_Item_EquipItemMixIn(Scene_Item.prototype);

function Window_ItemCommand_EquipItemMixIn(windowClass: Window_ItemCommand) {
  const _commandsForItem = windowClass.commandsForItem;
  windowClass.commandsForItem = function (item) {
    const result = _commandsForItem.call(this, item);
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      result.push({
        name: "装備",
        symbol: "equip",
        enabled: true,
        ext: null,
      });
    }
    return result;
  };
}

Window_ItemCommand_EquipItemMixIn(Window_ItemCommand.prototype);

function Window_MenuActor_EquipItemMixIn(windowClass: Window_MenuActor) {
  const _selectForItem = windowClass.selectForItem;
  windowClass.selectForItem = function (item) {
    _selectForItem.call(this, item);
    this._equip = undefined;
  };

  windowClass.selectForEquip = function (equip) {
    this.forceSelect(0);
    this._equip = equip;
  };

  const _isCurrentItemEnabled = windowClass.isCurrentItemEnabled;
  windowClass.isCurrentItemEnabled = function () {
    if (this._equip) {
      return $gameParty.members()[this.index()].canEquip(this._equip);
    } else {
      return _isCurrentItemEnabled.call(this);
    }
  };
}

Window_MenuActor_EquipItemMixIn(Window_MenuActor.prototype);
