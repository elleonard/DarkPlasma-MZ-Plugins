/// <reference path="../../typings/rmmz.d.ts" />

type TextShadow = {
  blur: number;
  color: string;
  offsetX: number;
  offsetY: number;
};

declare interface Bitmap {
  shadow: TextShadow|undefined;

  setTextShadow(shadow: TextShadow|undefined): void;
}

declare interface Window_Base {
  processShadowChange(shadowId: number): void;
  changeTextShadow(shadow: TextShadow|undefined): void;
  resetTextShadow(): void;
}
