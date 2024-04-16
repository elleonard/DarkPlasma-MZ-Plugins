/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />
/// <reference path="../../../common/window/detailWindow.d.ts" />

declare interface Scene_Equip {
  _detailWindowLayer: WindowLayer;
  _detailWindow: Window_DetailText;

  createDetailWindow(): void;
  detailWindowRect(): Rectangle;
  toggleDetailWindow(activeWindow: Window_EquipSlot|Window_EquipItem): void;
}

declare interface Window_EquipSlot {
  _detailWindow?: Window_DetailText;

  setDetailWindow(detailWindow: Window_DetailText): void;
}

declare interface Window_EquipItem {
  _detailWindow?: Window_DetailText;

  setDetailWindow(detailWindow: Window_DetailText): void;
}
