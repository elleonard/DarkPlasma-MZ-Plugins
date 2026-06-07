/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../DrawLine/plugin/DrawLine.d.ts" />

declare namespace Window_Base {
  interface TextState {
    underlineWord?: string | null;
  }
}

declare interface Window_Base {
  isUnderlineWindow(): boolean;
}
