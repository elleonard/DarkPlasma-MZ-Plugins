/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Window_Selectable {
  maxPageCols(): number;
}

type HorizontalScrollWindowOptions = {
  maxRows?: number;
  maxPageCols?: number;
};

declare function Window_HorizontalScrollMixIn(
  windowClass: Window_Selectable,
  options?: HorizontalScrollWindowOptions
): void;
