/// <reference path="./CustomKeyHandler.d.ts" />

class CustomKeyMethod {
  /**
   * @param {() => boolean} isTriggered
   * @param {(Window_Selectable) => void} process
   * @param {(Window_Selectable) => boolean} isEnabled
   */
  constructor(isTriggered: () => boolean, process: (self: Window_Selectable) => void, isEnabled: (self: Window_Selectable) => boolean) {
    this._isTriggered = isTriggered;
    this._process = process;
    this._isEnabled = isEnabled;
  }

  isTriggered(): boolean {
    return this._isTriggered();
  }

  process(self: Window_Selectable): void {
    this._process(self);
  }

  isEnabled(self: Window_Selectable): boolean {
    return this._isEnabled(self);
  }
}

/**
 * @param {string} key キー
 * @param {Window_Selectable.prototype} windowClass
 * @param {?string} handlerName
 */
function Window_CustomKeyHandlerMixIn(key: string, windowClass: Window_Selectable, handlerName?: string): void {
  if (!windowClass.customKeyMethods) {
    windowClass.customKeyMethods = [];

    const _processHandling = windowClass.processHandling;
    windowClass.processHandling = function (this: Window_Selectable) {
      _processHandling.call(this);
      if (this.isOpenAndActive()) {
        const customKeyMethod = this.customKeyMethods.find((method) => method.isTriggered());
        if (customKeyMethod && customKeyMethod.isEnabled(this)) {
          return customKeyMethod.process(this);
        }
      }
    };
  }

  if (!windowClass.isCustomKeyEnabled) {
    windowClass.isCustomKeyEnabled = function (key) {
      return true;
    };
  }

  windowClass.customKeyMethods.push(
    new CustomKeyMethod(
      () => Input.isTriggered(key),
      (self) => {
        self.playCursorSound();
        self.updateInputData();
        self.callHandler(handlerName || key);
      },
      (self) => self.isCustomKeyEnabled(key)
    )
  );
}

globalThis.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
