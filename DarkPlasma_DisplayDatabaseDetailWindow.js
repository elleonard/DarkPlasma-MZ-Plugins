// DarkPlasma_DisplayDatabaseDetailWindow 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/04/26 1.0.1 詳細説明の前後にある空白を無視する
 * 2024/04/20 1.0.0 公開
 */

/*:
 * @plugindesc データベース項目の詳細説明を表示するウィンドウ基底
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.1
 * ウィンドウにデータベース項目の
 * 詳細説明を表示するための基底を提供します。
 *
 * 本プラグインは単体では動作しません。
 * 拡張プラグインとともに利用してください。
 */

(() => {
  'use strict';

  class Window_DetailText extends Window_Scrollable {
    initialize(rect) {
      super.initialize(rect);
      this._text = '';
      this.hide();
    }
    setItem(item) {
      this.setText(this.detailText(item));
    }
    setText(text) {
      if (this._text !== text) {
        this._text = text;
        this.refresh();
      }
    }
    detailText(item) {
      const detailText = String(item?.meta.detail || '');
      return this.mustTrimText() ? detailText.trim() : detailText;
    }
    mustTrimText() {
      return true;
    }
    drawDetail(detail) {
      this.drawTextEx(detail, 0, this.baseLineY());
    }
    baseLineY() {
      return -(this.scrollBaseY() / this.scrollBlockHeight()) * this.lineHeight();
    }
    scrollBlockHeight() {
      return this.lineHeight();
    }
    overallHeight() {
      return this.textSizeEx(this._text).height + this.heightAdjustment();
    }
    heightAdjustment() {
      return 32;
    }
    paint() {
      this.contents.clear();
      this.drawDetail(this._text);
    }
    refresh() {
      this.paint();
    }
    update() {
      super.update();
      this.processCursorMove();
    }
    processCursorMove() {
      if (this.isCursorMovable()) {
        if (Input.isRepeated('down')) {
          this.cursorDown();
        }
        if (Input.isRepeated('up')) {
          this.cursorUp();
        }
      }
    }
    isCursorMovable() {
      return this.visible;
    }
    cursorDown() {
      if (this.scrollY() <= this.maxScrollY()) {
        this.smoothScrollDown(1);
      }
    }
    cursorUp() {
      if (this.scrollY() > 0) {
        this.smoothScrollUp(1);
      }
    }
  }

  function Window_WithDetailWindowMixIn(openDetailKey, windowClass) {
    Window_CustomKeyHandlerMixIn(openDetailKey, windowClass, 'detail');
    windowClass.setDetailWindow = function (detailWindow) {
      this._detailWindow = detailWindow;
    };
    const _setHelpWindowItem = windowClass.setHelpWindowItem;
    windowClass.setHelpWindowItem = function (item) {
      _setHelpWindowItem.call(this, item);
      this._detailWindow?.setItem(item);
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

  globalThis.Window_DetailText = Window_DetailText;
  globalThis.Window_WithDetailWindowMixIn = Window_WithDetailWindowMixIn;
})();
