/// <reference path="./detailWindow.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

declare interface Window_Selectable {
  _detailWindow?: Window_DetailText;
  
  setDetailWindow(detailWindow: Window_DetailText): void;
}

declare function Window_WithDetailWindowMixIn(openDetailKey: string, windowClass: Window_Selectable): void;
