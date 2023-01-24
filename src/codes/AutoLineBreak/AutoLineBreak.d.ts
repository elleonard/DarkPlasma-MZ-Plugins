/// <reference path="../../typings/rmmz.d.ts" />

type LineBreakState = {
  lineBuffer: string;
  index: number;
  forceLineBreak?: boolean;
};

declare interface Window_Base {
  isIgnoreAutoLineBreakWindow(): boolean;
  isAutoLineBreakEnabled(force?: boolean): boolean;

  nextNCharacter(textState: Window_Base.TextState, lineBreakState: LineBreakState, n: number): string|null;
  isSurrogatePair(character: string): boolean;
  isProhibitLineBreakBefore(character: string): boolean;
  isProhibitLineBreakAfter(character: string): boolean;
  shouldLineBreakHere(textState: Window_Base.TextState, lineBreakState: LineBreakState): boolean;
  shouldCharacterBaseLineBreakHere(textState: Window_Base.TextState, lineBreakState: LineBreakState): boolean;
  shouldWordBaseLineBreakHere(textState: Window_Base.TextState, lineBreakState: LineBreakState): boolean;

  /**
   * Window_Message用
   */
  needsNewPage(textState: Window_Base.TextState): boolean;

  lineWidth(width?: number): number;
  lineWidthMargin(): number;
}

declare namespace Window_Base {
  interface TextState {
    lineBuffer: string;
    targetLineWidth?: number;
  }

  function createDummyWindow(): Window_MessageDummy;
}

declare interface Window_MessageDummy extends Window_Message {
  findLineText(textState: Window_Base.TextState): string;
}

declare interface Window_BattleLog {
  _newLines: number[];
  _currentIndex: number;
}
