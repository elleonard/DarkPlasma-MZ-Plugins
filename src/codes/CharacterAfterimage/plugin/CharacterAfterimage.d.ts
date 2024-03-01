/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_CharacterBase {
  _afterimage: Game_CharacterAfterimage|undefined;

  hasAfterimage(): boolean;
  afterimage(): Game_CharacterAfterimage|undefined;
  requestStartAfterimage(): void;
  clearAfterimage(): void;
}

declare interface Game_CharacterAfterimage {
  _interval: number;
  _generateAfterimageFrameCount: number;
  _duration: number;
  _initialOpacity: number;
  _colorTone: [number, number, number, number];
  _blendMode: number;

  update(): void;
  resetGenerationFrameCount(): void;
  mustGenerateSprite(): boolean;
  duration(): number;
  initialOpacity(): number;
  colorTone(): [number, number, number, number];
  blendMode(): number;
}

declare interface Sprite_Character {
  _afterimageSprites: Sprite_CharacterAfterimage[];
  _clearReservedAfterimageSprites: Sprite_CharacterAfterimage[];

  createAfterimage(): void;
  clearAfterimage(): void;
  updateAfterimage(): void;
  clearReservedAfterimages(): void;
}

declare interface Sprite_CharacterAfterimage extends Sprite_Character {
  withPosition(x: number, y: number, z: number): Sprite_CharacterAfterimage;
  withScale(scale: PIXI.IPoint): Sprite_CharacterAfterimage;
  withRotation(rotation: number): Sprite_CharacterAfterimage;
  withAnchor(x: number, y: number): Sprite_CharacterAfterimage;

  update(): void;
}
