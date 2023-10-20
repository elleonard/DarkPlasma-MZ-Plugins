/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare interface Scene_Item {
  _detailWindowLayer: WindowLayer;
  _detailWindow: Window_ItemDetail;

  createDetailWindow(): void;
  detailWindowRect(): Rectangle;
  toggleDetailWindow(): void;
}

declare interface Window_ItemList {
  _detailWindow?: Window_ItemDetail;

  setDetailWindow(detailWindow: Window_ItemDetail): void;
}

declare interface Window_ItemDetail extends Window_Scrollable {
  _text: string;

  setItem(item: MZ.Item|MZ.Weapon|MZ.Armor|null): void;
}
