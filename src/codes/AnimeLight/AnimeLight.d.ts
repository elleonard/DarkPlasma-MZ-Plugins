/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Temp {
  _requestedAnimeLightCharacters: Game_CharacterBase[];

  requestedAnimeLightCharacter(): Game_CharacterBase|undefined;
  requestAnimeLight(character: Game_CharacterBase): void;
}

declare interface Game_CharacterBase {
  animeLightSetting(): Data_AnimeLight|null;
}

declare interface Game_Event {
  hasAnimeLight(): boolean;
  isMarkedAsAnimeLight(): boolean;
}

declare interface Spriteset_Map {
  _animeLightSprites: Sprite_AnimeLight[];

  initAnimeLights(): void;
  updateAnimeLight(): void;
}
