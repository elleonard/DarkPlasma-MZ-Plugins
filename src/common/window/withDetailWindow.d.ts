/// <reference path="./detailWindow.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/plugin/CustomKeyHandler.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/plugin/CustomKeyHandlerExport.d.ts" />

declare interface Window_Selectable {
  _detailWindow?: Window_DetailText;
  
  setDetailWindow(detailWindow: Window_DetailText): void;
  updateDetailWindowItem(item: DataManager.NoteHolder|null): void;
}

declare function Window_WithDetailWindowMixIn(openDetailKey: string, windowClass: Window_Selectable): void;
