/// <reference path="./EquipDetail.d.ts" />

import { settings } from '../config/_build/DarkPlasma_EquipDetail_parameters';

function Scene_Equip_DetailMixIn(sceneEquip: Scene_Equip) {
  const _create = sceneEquip.create;
  sceneEquip.create = function () {
    _create.call(this);
    this.createDetailWindow();
  };

  const _createSlotWindow = sceneEquip.createSlotWindow;
  sceneEquip.createSlotWindow = function () {
    _createSlotWindow.call(this);
    this._slotWindow.setHandler('detail', () => this.toggleDetailWindow(this._slotWindow));
  };

  const _createItemWindow = sceneEquip.createItemWindow;
  sceneEquip.createItemWindow = function () {
    _createItemWindow.call(this);
    this._itemWindow.setHandler('detail', () => this.toggleDetailWindow(this._itemWindow));
  };

  sceneEquip.createDetailWindow = function () {
    this._detailWindowLayer = new WindowLayer();
    this._detailWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._detailWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._detailWindowLayer);
    this._detailWindow = new Window_DetailText(this.detailWindowRect());
    this._detailWindowLayer.addChild(this._detailWindow);
    this._itemWindow.setDetailWindow(this._detailWindow);
    this._slotWindow.setDetailWindow(this._detailWindow);
  };

  sceneEquip.detailWindowRect = function () {
    return this.slotWindowRect();
  };

  sceneEquip.toggleDetailWindow = function (activeWindow) {
    activeWindow.activate();
    this._detailWindow.scrollTo(0, 0);
    if (!this._detailWindow.visible) {
      this._detailWindow.show();
    } else {
      this._detailWindow.hide();
    }
  };
}

Scene_Equip_DetailMixIn(Scene_Equip.prototype);

Window_WithDetailWindowMixIn(settings.openDetailKey, Window_EquipSlot.prototype);
Window_WithDetailWindowMixIn(settings.openDetailKey, Window_EquipItem.prototype);
