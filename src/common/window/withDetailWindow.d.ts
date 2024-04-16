/// <reference path="./detailWindow.d.ts" />

declare interface Window_Selectable {
  _detailWindow?: Window_DetailText;
  
  setDetailWindow(detailWindow: Window_DetailText): void;
}
