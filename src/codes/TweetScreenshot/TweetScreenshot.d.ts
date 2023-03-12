/// <reference path="../../typings/rmmz.d.ts" />

declare interface SceneManager {
  tweetScreenshot(): void;
  tweetImage(image: Bitmap): void;
  notifyTweetScreenshotError(error: Error): void;
}
