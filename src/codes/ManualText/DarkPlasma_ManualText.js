import { settings } from './_build/DarkPlasma_ManualText_parameters';

/**
 * @param {Window_Base.prototype} windowClass
 */
function Window_ManualTextMixIn(windowClass) {
  windowClass.drawManual = function () {
    if (this.isManualVisible()) {
      this.contents.fontSize = this.manualFontSize();
      this.changeTextColor(ColorManager.textColor(6));
      this.manualTexts().forEach((text, index) => {
        this.drawText(text, this.manualX(), this.manualY(index));
      });
      this.resetFontSettings();
    }
  };

  windowClass.manualX = function () {
    const maxWidth = this.manualTexts().reduce((result, text) => Math.max(result, this.textWidth(text)), 0);
    return this.innerWidth - maxWidth;
  };

  windowClass.manualY = function (index) {
    return this.innerHeight - this.manualLineHeight() * (this.manualTexts().length - index) + this.manualOffsetY();
  };

  windowClass.setManualOffsetY = function (offset) {
    this._manualOffsetY = offset;
  };

  windowClass.manualOffsetY = function () {
    return this._manualOffsetY || -settings.linePadding;
  };

  windowClass.manualLineHeight = function () {
    return this.manualFontSize() + this.manualPadding();
  };

  windowClass.setManualPadding = function (padding) {
    this._manualPadding = padding;
  };

  windowClass.manualPadding = function () {
    return this._manualPadding || settings.linePadding;
  };

  windowClass.initManualTexts = function () {
    this._manualTexts = [];
  };

  windowClass.addManualText = function (text) {
    if (!this._manualTexts) {
      this.initManualTexts();
    }
    this._manualTexts.push(text);
  };

  windowClass.manualTexts = function () {
    return this._manualTexts;
  };

  windowClass.setManualFontSize = function (fontSize) {
    this._manualFontSize = fontSize;
  };

  windowClass.manualFontSize = function () {
    if (!this._manualFontSize) {
      this._manualFontSize = 21;
    }
    return this._manualFontSize;
  };

  windowClass.isManualVisible = function () {
    return this._isManualVisible;
  };

  windowClass.setIsManualVisible = function (visible) {
    if (this._isManualVisible !== visible) {
      this._isManualVisible = visible;
      this.refresh();
    }
  };
}

globalThis.Window_ManualTextMixIn = Window_ManualTextMixIn;
