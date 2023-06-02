/// <reference path="./obtainEscapeParamText.d.ts" />

export function Window_ObtainEscapeParamTextMixIn(windowClass: Window_Base) {
  windowClass.obtainEscapeParamText = function(textState: Window_Base.TextState): string {
    const arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
      textState.index += arr[0].length;
      return arr[1];
    } else {
      return "";
    }
  }
}
