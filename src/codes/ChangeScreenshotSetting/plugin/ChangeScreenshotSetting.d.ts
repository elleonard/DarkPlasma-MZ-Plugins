/// <reference path="../../../typings/rmmz.d.ts" />

declare namespace Bitmap {
  function snapRectangle(stage: Stage, rect: Rectangle): Bitmap;
}

declare interface SceneManager {
  snapForScreenshot(): Bitmap;
}

declare interface Game_ScreenshotSetting {
  _x: number;
  _y: number;
  _width: number;
  _height: number;

  setRectangle(rect: Rectangle): void;
  rectangle(): Rectangle|undefined;
}

declare interface Game_System {
  _screenshotSetting: Game_ScreenshotSetting;

  screenshotSetting(): Game_ScreenshotSetting;
  setScreenshotRectangle(rect: Rectangle): void;
  screenshotRectangle(): Rectangle|undefined;
}
