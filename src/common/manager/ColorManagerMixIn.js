/// <reference path="./ColorManagerMixIn.d.ts" />
export function ColorManagerMixIn(colorManager) {
    colorManager.convertColorParameter = function (colorParameter) {
        return typeof colorParameter === "string"
            ? colorParameter
            : this.textColor(colorParameter);
    };
}
