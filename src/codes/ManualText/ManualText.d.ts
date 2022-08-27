/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface Window_Base {
  _manualOffsetY: number;
  _manualPadding: number;
  _manualTexts: string[];
  _manualFontSize: number;
  _isManualVisible: boolean;

  drawManual(): void;
  manualX(): number;
  manualY(index: number): number;

  setManualOffsetY(offset: number): void;
  manualOffsetY(): number;
  manualLineHeight(): number;
  setManualPadding(padding: number): void;
  manualPadding(): number;

  initManualTexts(): void;
  addManualText(text: string): void;
  manualTexts(): string[];

  setManualFontSize(fontSize: number): void;
  manualFontSize(): number;
  isManualVisible(): boolean;
  setIsManualVisible(visible: boolean): void;

  refresh(): void;
}
