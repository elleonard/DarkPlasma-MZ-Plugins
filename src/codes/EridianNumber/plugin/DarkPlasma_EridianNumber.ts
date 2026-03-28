/// <reference path="./EridianNumber.d.ts" />

const numberMapping = ["ℓ", "I", "V", "λ", "+", "∀"];

function replaceNumberToEridian(str: string): string {
  return String(str)
    .replaceAll(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replaceAll(/([0-9]+)/gi, (s) => decimalToEridianNumber(Number(s)));
}

function decimalToEridianNumber(decimal: number): string {
  return [...decimal.toString(6)].map((c) => numberMapping[Number(c)]).join("");
}

function Game_Message_EridianNumberMixIn(gameMessage: Game_Message) {
  const _allText = gameMessage.allText;
  gameMessage.allText = function () {
    return replaceNumberToEridian(_allText.call(this));
  };
}

Game_Message_EridianNumberMixIn(Game_Message.prototype);

function Window_Base_EridianNumberMixIn(windowBase: Window_Base) {
  const _drawText = windowBase.drawText;
  windowBase.drawText = function (text, x, y, maxWidth, align) {
    _drawText.call(this, replaceNumberToEridian(text), x, y, maxWidth, align);
  }

  const _drawTextEx = windowBase.drawTextEx;
  windowBase.drawTextEx = function (text, x, y, width) {
    return _drawTextEx.call(
      this,
      replaceNumberToEridian(text),
      x,
      y,
      width
    );
  };
}

Window_Base_EridianNumberMixIn(Window_Base.prototype);

function Sprite_Gauge_EridianNumberMixIn(spriteGauge: Sprite_Gauge) {
  spriteGauge.drawValue = function () {
    const currentValue = this.currentValue();
    const width = this.bitmapWidth();
    const height = this.textHeight();
    this.setupValueFont();
    this.bitmap?.drawText(decimalToEridianNumber(currentValue), 0, 0, width, height, "right");
  };
}

Sprite_Gauge_EridianNumberMixIn(Sprite_Gauge.prototype);
