/// <reference path="../../typings/rmmz.d.ts" />

declare interface SceneManager {
  tweetScreenshot(): void;
  tweetImage(base64Image: string): void;
  notifyTweetScreenshotError(error: Error): void;
}
