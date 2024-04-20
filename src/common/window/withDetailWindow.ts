/// <reference path="./withDetailWindow.d.ts" />

export function Window_WithDetailWindowMixIn(openDetailKey: string, windowClass: Window_Selectable): void {
  Window_CustomKeyHandlerMixIn(openDetailKey, windowClass, 'detail');

  windowClass.setDetailWindow = function (detailWindow) {
    this._detailWindow = detailWindow;
  };

  const _setHelpWindowItem = windowClass.setHelpWindowItem;
  windowClass.setHelpWindowItem = function (item) {
    _setHelpWindowItem.call(this, item);
    this._detailWindow?.setItem(item as DataManager.NoteHolder);
  };

  const _isCursorMovable = windowClass.isCursorMovable;
  windowClass.isCursorMovable = function () {
    return _isCursorMovable.call(this) && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _isOkEnabled = windowClass.isOkEnabled;
  windowClass.isOkEnabled = function () {
    return _isOkEnabled.call(this) && (!this._detailWindow || !this._detailWindow.visible);
  };

  const _processCancel = windowClass.processCancel;
  windowClass.processCancel = function () {
    this._detailWindow?.hide();
    _processCancel.call(this);
  };
}