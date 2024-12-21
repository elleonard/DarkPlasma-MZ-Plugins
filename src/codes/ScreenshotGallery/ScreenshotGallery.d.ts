/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../TweetScreenshot/plugin/TweetScreenshot.d.ts" />

declare namespace Bitmap {
  function snapRectangle(stage: Stage, rect: Rectangle): Bitmap;
}

declare interface Bitmap {
  drawFrame(x: number, y: number, width: number, height: number, thick: number, color: string): void;
}

declare interface SceneManager {
  saveScreenshot(format: string, rect?: Rectangle): void;
  saveImage(filename: string, format: string, base64Image: string): void;
  snapRectangle(rect: Rectangle): Bitmap;
}

declare namespace ImageManager {
  var _latestSceenshotName: string;
  function setLatestScreenshotName(name: string): void
  function loadLatestScreenshot(): Bitmap;
  function loadAllScreenshot(): Bitmap[];
  function loadScreenshot(filename: string): Bitmap;
  function validScreenshotCount(): number;
}

declare namespace StorageManager {
  function screenshotDirPath(): string;
}

declare interface Game_Temp {
  _screenshotRectangle: Rectangle|undefined;

  screenshotRectangle(): Rectangle|undefined;
  setScreenshotRectangle(rect: Rectangle|undefined): void;
}

declare interface Scene_Base {
  _flashDuration: number;
  _flashOpacity: number;
  _previewContainer: Sprite;
  _previewDuration: number;
  _previewSprite: Sprite;

  createPreviewContainer(): void;
  blendColor(): [number, number, number, number];
  startFlash(): void;
  updateFlash(): void;
  clearFlash(): void;
  startPreview(): void;
  updatePreview(): void;
  hidePreview(): void;
}
