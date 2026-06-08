/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../DrawLine/plugin/DrawLine.d.ts" />

declare namespace Window_Base {
  interface TextState {
    underlineColor?: string | null;
    underlineLineWidth?: number;
    underlineStartX?: number;
  }
}

declare interface Scene_Boot {
  addUnderlineWordEntry(word: string, color: string | number, lineWidth: number): void;
}

declare interface Window_Base {
  drawUnderline(textState: Window_Base.TextState): void;
  isUnderlineWindow(): boolean;
}
