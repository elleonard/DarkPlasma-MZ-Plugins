/// <reference path="./EquipDetail.d.ts" />

import { settings } from '../config/_build/DarkPlasma_EquipDetail_parameters';
import { Window_DetailText } from '../../../common/window/detailWindow';

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

Window_CustomKeyHandlerMixIn(settings.openDetailKey, Window_EquipSlot.prototype, 'detail');
Window_CustomKeyHandlerMixIn(settings.openDetailKey, Window_EquipItem.prototype, 'detail');

function Window_Equip_DetailMixIn(windowClass: Window_EquipSlot|Window_EquipItem) {
  windowClass.setDetailWindow = function (detailWindow) {
    this._detailWindow = detailWindow;
  };

  const _setHelpWindowItem = windowClass.setHelpWindowItem;
  windowClass.setHelpWindowItem = function (item) {
    _setHelpWindowItem.call(this, item);
    this._detailWindow?.setItem(item as DataManager.NoteHolder);
  };

  const _isCursorMovable = windowClass.isCursorMovable;
  windowClass.isCursorMovable = function () {
    return _isCursorMovable.call(this) && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _isOkEnabled = windowClass.isOkEnabled;
  windowClass.isOkEnabled = function () {
    return _isOkEnabled.call(this) && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _processCancel = windowClass.processCancel;
  windowClass.processCancel = function () {
    this._detailWindow?.hide();
    _processCancel.call(this);
  };
}

Window_Equip_DetailMixIn(Window_EquipSlot.prototype);
Window_Equip_DetailMixIn(Window_EquipItem.prototype);
