/// <reference path="../../typings/rmmz/rmmz.d.ts" />

declare interface CustomKeyMethod {
  _isTriggered: () => boolean;
  _process: (self: Window_Selectable) => void;
  _isEnabled: (self: Window_Selectable) => boolean;
}

declare interface Window_Selectable {
  customKeyMethods: CustomKeyMethod[];
  isCustomKeyEnabled(key: string): boolean;
}
