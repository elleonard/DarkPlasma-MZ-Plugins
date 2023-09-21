/// <reference path="../../typings/rmmz.d.ts" />

declare interface Window_Base {
  _ignoreAutoLineBreakTemporary: boolean;

  startIgnoreAutoLineBreakTemporary(): void;
  finishIgnoreAutoLineBreakTemporary(): void;

  isIgnoreAutoLineBreakWindow(): boolean;
  isAutoLineBreakEnabled(): boolean;

  nextNCharacter(textState: Window_Base.TextState, n: number): string|null;
  isSurrogatePair(character: string): boolean;
  isProhibitLineBreakBefore(character: string): boolean;
  isProhibitLineBreakAfter(character: string): boolean;
  shouldLineBreakHere(textState: Window_Base.TextState): boolean;
  shouldCharacterBaseLineBreakHere(textState: Window_Base.TextState): boolean;
  shouldWordBaseLineBreakHere(textState: Window_Base.TextState): boolean;

  /**
   * Window_Message用
   */
  needsNewPage(textState: Window_Base.TextState): boolean;

  lineWidth(): number;
  lineWidthMargin(): number;
}

declare namespace Window_Base {
  interface TextState {
    lineBuffer: string;
  }
}

declare interface Window_BattleLog {
  _newLines: number[];
  _currentIndex: number;
}
