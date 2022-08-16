/// <reference path="../../typings/rmmz/rmmz_windows.d.ts" />

declare namespace CustomKeyMethod {}

declare interface Window_Selectable {
  customKeyMethods: CustomKeyMethod[];

  isCustomKeyEnabled(key: string): boolean;
}
