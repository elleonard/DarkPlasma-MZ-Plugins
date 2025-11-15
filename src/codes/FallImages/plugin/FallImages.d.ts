/// <reference path="../../../typings/rmmz.d.ts" />

type Game_FallImagesStartOption = "override";

type FallImageStatusSaveObject = {
  startRequested: boolean;
  requestedImageId: number;
  stopRequested: boolean;
  fadeOutRequested: boolean;
  isFalling: boolean;
  startOptions?: Game_FallImagesStartOption[];
};

declare interface Game_System {
  _fallImageStatus: FallImageStatusSaveObject;
}

declare interface Game_Map {
  _autoFallingImage: boolean;

  autoFallImageId(): number|undefined;
}

declare interface Spriteset_Map {
  _fallImageSprites: Sprite_Falling[];

  createFallImage(): void;
  needCreateFallImage(): boolean;
  updateFallImage(): void;
  destroyFallImages(): void;
}

declare interface Sprite_Falling extends Sprite {
  setup(): void;
}
