/// <reference path="./SetColorByCode.d.ts" />

import { Window_ObtainEscapeParamTextMixIn } from '../../common/window/obtainEscapeParamText';

Window_ObtainEscapeParamTextMixIn(Window_Base.prototype);

function Window_SetColorByCodeMixIn(windowClass: Window_Base) {
  windowClass.processEscapeCharacter = function (code, textState) {
    if (code === "C") {
      const color = this.obtainEscapeParamText(textState);
      if (color.startsWith("#")) {
        this.changeTextColor(color);
      } else {
        this.processColorChange(Number(color));
      }
    }
  };
}

Window_SetColorByCodeMixIn(Window_Base.prototype);
