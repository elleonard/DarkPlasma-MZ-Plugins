/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface Window_Base {
  _manualOffsetY: number;
  _manualCols: number;
  _manualRows: number;
  _manualWidth: number;
  _manualPadding: number;
  _manualTexts: string[];
  _manualFontSize: number;
  _isManualVisible: boolean;

  drawManual(): void;
  manualX(index: number): number;
  manualY(index: number): number;
  manualCols(): number;
  manualWidth(): number;

  setManualOffsetY(offset: number): void;
  manualOffsetY(): number;
  manualLineHeight(): number;
  setManualPadding(padding: number): void;
  manualPadding(): number;
  setManualCols(cols: number): void;
  setManualWidth(width: number): void;

  initManualTexts(): void;
  addManualText(text: string): void;
  manualTexts(): string[];

  setManualFontSize(fontSize: number): void;
  manualFontSize(): number;
  isManualVisible(): boolean;
  setIsManualVisible(visible: boolean): void;

  refresh(): void;
}
