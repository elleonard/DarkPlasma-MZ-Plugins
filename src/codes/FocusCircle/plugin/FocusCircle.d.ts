/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../FillGradientCircle/plugin/FillGradientCircle.d.ts" />

declare namespace ColorManager {
  function focusInsideColor(): string;
  function focusOutsideColor(): string;
}

type Game_Focus = {
  id: number;
  x: number;
  y: number;
  radius: number;
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
  moveFocus(focusId: number, x: number, y: number, radius: number): void;
  clearAllFocus(): void;
}

declare interface Scene_Base {
  _focusCircleLayer: PIXI.Container;

  createFocusCircleLayer(): void;
}
