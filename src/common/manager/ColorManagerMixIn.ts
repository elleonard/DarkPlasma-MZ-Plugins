/// <reference path="./ColorManagerMixIn.d.ts" />

export function ColorManagerMixIn(colorManager: typeof ColorManager) {
  colorManager.convertColorParameter = function (colorParameter: number|string) {
    return typeof colorParameter === "string"
      ? colorParameter
      : this.textColor(colorParameter);
  };
}