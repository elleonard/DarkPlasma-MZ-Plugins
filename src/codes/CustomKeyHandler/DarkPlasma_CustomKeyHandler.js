class CustomKeyMethods {
  /**
   * @param {() => boolean} isTriggered
   * @param {() => void} process
   */
  constructor(isTriggered, process) {
    this._isTriggered = isTriggered;
    this._process = process;
  }

  isTriggered() {
    return this._isTriggered();
  }

  process(self) {
    this._process(self);
  }
}

/**
 * @param {string} key キー
 * @param {Window_Base.prototype} windowClass
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
        if (customKeyMethod) {
          return customKeyMethod.process(this);
        }
      }
    };
  }

  windowClass.customKeyMethods.push(
    new CustomKeyMethods(
      () => Input.isTriggered(key),
      (self) => {
        self.playCursorSound();
        self.updateInputData();
        self.callHandler(handlerName || key);
      }
    )
  );
}

window.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
