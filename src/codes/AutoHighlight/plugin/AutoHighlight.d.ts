/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../PartialTextColor/plugin/PartialTextColor.d.ts" />

declare interface HighlightWords {
  findColorByWord(word: string): string | undefined;
}

declare var highlightWords: HighlightWords;

declare interface Scene_Boot {
  setupHighlightWords(): void;
}

declare interface Window_Base {
  isHighlightWindow(): boolean;
}
