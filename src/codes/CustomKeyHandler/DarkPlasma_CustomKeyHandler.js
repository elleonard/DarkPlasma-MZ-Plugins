/**
 * @param {string} key キー
 * @param {Window_Base.prototype} windowClass
 */
function Window_CustomKeyHandlerMixIn(key, windowClass) {
  if (!windowClass.isCustomKeyTriggered) {
    windowClass.isCustomKeyTriggered = [];
    windowClass.processCustomKey = [];
    windowClass.callCustomKeyHandler = [];

    const _processHandling = windowClass.processHandling;
    windowClass.processHandling = function () {
      _processHandling.call(this);
      if (this.isOpenAndActive()) {
        const index = this.isCustomKeyTriggered.findIndex((isTriggered) => isTriggered.call(this));
        if (index >= 0) {
          return this.processCustomKey[index].call(this);
        }
      }
    };
  }

  windowClass.isCustomKeyTriggered.push(function () {
    return Input.isTriggered(key);
  });

  windowClass.processCustomKey.push(function () {
    this.playCursorSound();
    this.updateInputData();
    this.callCustomKeyHandler[windowClass.isCustomKeyTriggered.length - 1].call(this);
  });

  windowClass.callCustomKeyHandler.push(function () {
    this.callHandler(key);
  });
}

window.Window_CustomKeyHandlerMixIn = Window_CustomKeyHandlerMixIn;
