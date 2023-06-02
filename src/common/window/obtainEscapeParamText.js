/// <reference path="./obtainEscapeParamText.d.ts" />
export function Window_ObtainEscapeParamTextMixIn(windowClass) {
    windowClass.obtainEscapeParamText = function (textState) {
        const arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[1];
        }
        else {
            return "";
        }
    };
}
