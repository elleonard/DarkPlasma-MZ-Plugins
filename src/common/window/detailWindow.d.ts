/// <reference path="../../typings/rmmz.d.ts" />

declare interface Window_DetailText extends Window_Scrollable {
  _text: string;

  initialize(rect: Rectangle): void;
  setItem(item: DataManager.NoteHolder|null): void;
  setText(text: string): void;
  drawDetail(detail: string): void;
  baseLineY(): number;
  heightAdjustment(): number;
  refresh(): void;
  processCursorMove(): void;
  isCursorMovable(): boolean;
  cursorDown(): void;
  cursorUp(): void;
}
