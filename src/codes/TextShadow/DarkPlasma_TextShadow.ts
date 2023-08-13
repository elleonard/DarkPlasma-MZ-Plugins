/// <reference path="./TextShadow.d.ts" />

import { settings } from "./_build/DarkPlasma_TextShadow_parameters";

function Bitmap_TextShadowMixIn(bitmap: Bitmap) {
  const _drawTextOutline = bitmap._drawTextOutline;
  bitmap._drawTextOutline = function (text, tx, ty, maxWidth) {
    if (this.shadow) {
      this.context.shadowBlur = this.shadow.blur;
      this.context.shadowColor = this.shadow.color;
      this.context.shadowOffsetX = this.shadow.offsetX;
      this.context.shadowOffsetY = this.shadow.offsetY;
    }
    _drawTextOutline.call(this, text, tx, ty, maxWidth);
  };

  bitmap.setTextShadow = function (shadow) {
    this.shadow = shadow;
  };
}

Bitmap_TextShadowMixIn(Bitmap.prototype);

function Window_TextShadowMixIn(windowClass: Window_Base) {
  const _processEscapeCharacter = windowClass.processEscapeCharacter;
  windowClass.processEscapeCharacter = function (code, textState) {
    if (code === "SHADOW") {
      this.processShadowChange(this.obtainEscapeParam(textState));
    }
    _processEscapeCharacter.call(this, code, textState);
  };

  windowClass.processShadowChange = function (shadowId) {
    if (shadowId === 0) {
      this.resetTextShadow();
    } else {
      const shadowSetting = settings.shadows.find(shadow => shadow.id === shadowId);
      this.contents.setTextShadow(shadowSetting ? {
        blur: shadowSetting.blur,
        color: typeof shadowSetting.color === "string"
          ? shadowSetting.color
          : ColorManager.textColor(shadowSetting.color),
        offsetX: shadowSetting.offsetX,
        offsetY: shadowSetting.offsetY,
      } : undefined);
    }
  };

  windowClass.resetTextShadow = function () {
    this.contents.setTextShadow(undefined);
  };
}

Window_TextShadowMixIn(Window_Base.prototype);
