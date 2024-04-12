/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_Screen {
  /**
   * 同じ情報の合成ピクチャ情報を何度も生成しない
   */
  _cachedAdditionalPictures: {[key: string]: Game_AdditionalPicture};
  /**
   * ピクチャIDでランダムアクセスするために利用する
   */
  _additionalPictures: {[pictureId: number]: Game_AdditionalPicture};
  /**
   * 合成ピクチャ情報
   * ピクチャの表示を行うとGame_Pictureインスタンスが再生成されるため、ここで保持して復元する
   */
  _composedPictures: {[basePictureId: number]: Game_AdditionalPicture[]};

  allocateAdditionalPicture(name: string, origin: number, offsetX: number, offsetY: number, scaleX: number, scaleY: number, opacity: number, blendMode: number): Game_AdditionalPicture;
  composePicture(basePictureId: number, additionalPictures: Game_AdditionalPicture[]): void;
}

declare interface Game_Picture {
  _additionalPictures: Game_AdditionalPicture[];

  composePicture(additionalPictures: Game_AdditionalPicture[]): void;
  additionalPictures(): Game_AdditionalPicture[];
}

declare interface Game_AdditionalPicture extends Game_Picture {
  _pictureId: number;

  pictureId(): number;
  setPictureId(pictureId: number): void;
}

declare interface Sprite_Picture {
  _additionalSprites: Sprite_Picture[];
  _forceUpdateCompose: boolean;

  additionalPictureIds(): number[];
  updateCompose(): void;
  mustBeComposed(): boolean;
  composePicture(additionalSprites: Sprite_Picture[]): void;
}
