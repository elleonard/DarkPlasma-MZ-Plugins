/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../TweetScreenshot/TweetScreenshot.d.ts" />

declare interface SceneManager {
  saveScreenshot(format: string): void;
  saveImage(filename: string, format: string, base64Image: string): void;
}

declare namespace ImageManager {
  function loadAllScreenshot(): Bitmap[];
  function loadScreenshot(filename: string): Bitmap;
  function validScreenshotCount(): number;
}

declare namespace StorageManager {
  function screenshotDirPath(): string;
}
