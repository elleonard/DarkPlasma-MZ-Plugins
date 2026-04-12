/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Screen {
  isPictureMoving(pictureId: number): boolean;
  hasMovingPicture(): boolean;

  slidePicture(
    pictureId: number,
    direction: number,
    distance: number,
    easingType: 0|1|2|3,
    duration: number
  ): void;
  fadeInPicture(pictureId: number, duration: number): void;
  shakePicture(pictureId: number, power: number, speed: number, duration: number): void;
  hoppingPicture(pictureId: number, count: number, speed: number, height: number, damping: number): void;
  flickerPicture(pictureId: number, count: number, interval: number): void;
}

declare interface Game_PictureMotion {
  isMoving(): boolean;
  update(): void;
  x(): number;
  y(): number;
  opacityRate(): number;
}

declare interface Game_Picture {
  _motions?: Game_PictureMotion[];

  isMoving(): boolean;

  slide(
    direction: number,
    distance: number,
    easingType: 0|1|2|3,
    duration: number
  ): void;
  shake(power: number, speed: number, duration: number): void;
  hopping(count: number, speed: number, height: number, damping: number): void;
  flicker(count: number, interval: number): void;
  updateMotion(): void;
  pushMotion(motion: Game_PictureMotion): void;
}
