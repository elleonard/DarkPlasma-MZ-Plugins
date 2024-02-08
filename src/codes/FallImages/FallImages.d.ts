/// <reference path="../../typings/rmmz.d.ts" />

type FallImageStatusSaveObject = {
  startRequested: boolean;
  requestedImageId: number;
  stopRequested: boolean;
  fadeOutRequested: boolean;
  isFalling: boolean;
};

declare interface Game_System {
  _fallImageStatus: FallImageStatusSaveObject;
}

declare interface Spriteset_Map {
  _fallImageSprites: SPrite_FallImage[];

  createFallImage(): void;
  needCreateFallImage(): boolean;
  updateFallImage(): void;
  destroyFallImages(): void;
}
