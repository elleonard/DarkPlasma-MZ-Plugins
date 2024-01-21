/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Scene_Item {
  _itemCommandWindowLayer: WindowLayer;
  _itemCommandWindow: Window_ItemCommand;

  createItemCommandWindow(): void;
  itemCommandWindowRect(): Rectangle;
  adjustItemCommandWindowPosition(): void;

  itemCommandWindowX(): number;
  itemCommandWindowY(): number;
  itemCommandWindowWidth(): number;
  itemCommandWindowHeight(): number;

  onItemCommandCancel(): void;
}

declare interface Window_ItemList {
  _itemCommandWindow: Window_ItemCommand;

  setItemCommandWindow(itemCommandWindow: Window_ItemCommand): void;
}

declare interface Window_ItemCommand extends Window_Command {

}
