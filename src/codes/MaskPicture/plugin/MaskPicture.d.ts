/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Picture {
  _maskPictureId?: number;

  mask(maskPictureId: number): void;
  unmask(): void;
  maskPictureId(): number|undefined;
}

declare interface Spriteset_Base {
  _spritePictures: Sprite_Picture[];

  updateMask(): void;
  mustUpdateMask(spritePicture: Sprite_Picture): boolean;
  spritePicture(pictureId?: number): Sprite_Picture|null;
}

declare interface Sprite_Picture {
  setMask<T extends PIXI.Container>(sprite: T|null): void;
  isMaskedWith<T extends PIXI.Container>(sprite: T|null): boolean;
  hasMask(): boolean;
  unmask(): void;
  mustUpdateMask(): boolean;
  pictureId(): number;
}
