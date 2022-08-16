/// <reference path="./CustomKeyHandler.d.ts" />
//@ts-check
class CustomKeyMethod {
  /**
   * @param {() => boolean} isTriggered
   * @param {(Window_Selectable) => void} process
   * @param {(Window_Selectable) => boolean} isEnabled
   */
  constructor(isTriggered, process, isEnabled) {
    this._isTriggered = isTriggered;
    this._process = process;
    this._isEnabled = isEnabled;
  }

  isTriggered() {
    return this._isTriggered();
  }

  process(self) {
    this._process(self);
  }

  isEnabled(self) {
    return this._isEnabled(self);
  }
}

/**
 * @param {string} key キー
 * @param {Window_Selectable.prototype} windowClass
 * @param {string} handlerName
 */
function Window_CustomKeyHandlerMixIn(key, windowClass, handlerName) {
  if (!windowClass.customKeyMethods) {
    windowClass.customKeyMethods = [];

    const _processHandling = windowClass.processHandling;
    windowClass.processHandling = function () {
      _processHandling.call(this);
      if (this.isOpenAndActive()) {
        const customKeyMethod = this.customKeyMethods.find((method) => method.isTriggered());
        if (customKeyMethod && customKeyMethod.isEnabled(this)) {
          return customKeyMethod.process(this);
        }
      }
    };
  }

  windowClass.isCustomKeyEnabled = function (key) {
    return true;
  };

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

window.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
