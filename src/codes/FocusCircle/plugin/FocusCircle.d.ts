/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../Scene_MessageMixIn/Scene_MessageMixIn.d.ts" />

declare namespace ColorManager {
  function focusInsideColor(): string;
  function focusOutsideColor(): string;
}

declare interface Bitmap {
  fillGradientEllipse(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    insideColor: string,
    outsideColor: string
  ): void;
}

type Game_Focus = {
  id: number;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

declare interface Game_Temp {
  _focusList: Game_Focus[];
  _needsFocusRefresh: boolean;

  isFocusRefreshRequested(): boolean;
  clearFocusRefreshRequest(): void;
  isFocusMode(): boolean;
  focusList(): Game_Focus[];
  focusOn(focus: Game_Focus): void;
  focusOff(focusId: number): void;
  moveFocus(focus: Game_Focus): void;
  clearAllFocus(): void;
}

declare interface Scene_Base {
  _focusCircleLayer: Sprite;
  _focusMessageWindowLayer: WindowLayer;

  createFocusCircleLayer(): void;
  createFocusMessageWindowLayer(x: number, y: number): void;
}
