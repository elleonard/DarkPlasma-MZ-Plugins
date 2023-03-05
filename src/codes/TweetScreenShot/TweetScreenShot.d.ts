/// <reference path="../../typings/rmmz.d.ts" />

declare interface SceneManager {
  tweetScreenShot(): void;
  tweetImage(base64Image: string): void;
  notifyTweetScreenShotError(error: Error): void;
}
