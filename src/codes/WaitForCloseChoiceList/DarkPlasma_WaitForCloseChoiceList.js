const _Window_Message_isClosing = Window_Message.prototype.isClosing;
Window_Message.prototype.isClosing = function () {
  if (this._choiceListWindow && this._choiceListWindow.isClosing()) {
    return true;
  }
  return _Window_Message_isClosing.call(this);
};
