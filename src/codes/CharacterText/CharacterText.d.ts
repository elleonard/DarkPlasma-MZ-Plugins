/// <reference path="../../typings/rmmz.d.ts" />

type Game_SetupCharacterTextRequest = {
  text: string;
  character: Game_Character;
  offset: {
    x: number;
    y: number;
  };
};

declare interface Game_Temp {
  _setupCharacterTextRequests: Game_SetupCharacterTextRequest[];
  _hideAllCharacterTextsRequest: boolean;
  _mustShowCharacterTextCache: {[key: string]: boolean};

  isHideAllCharacterTextsRequested(): boolean;
  clearHideAllCharacterTextsRequest(): void;
  requestHideAllCharacterTexts(): void;

  requestSetupCharacterText(request: Game_SetupCharacterTextRequest): void;
  setupCharacterTextRequests(): Game_SetupCharacterTextRequest[];
  clearSetupCharacterTextRequests(): void;

  setMustShowCharacterTextCache(mapId: number, eventId: number, mustShow: boolean): void;
  mustShowCharacterTextCache(mapId: number, eventId: number): boolean;
}

declare interface Game_Character {
  mustShowText(): boolean;
  hasText(): boolean;
  requestSetupCharacterText(): void;
}

declare interface Spriteset_Map {
  _characterTexts: Sprite_CharacterText[];
  createCharacterText(character: Game_Character): void;
  setupCharacterText(request: Game_SetupCharacterTextRequest): void;
  hideAllCharacterTexts(): void;
  updateCharacterTexts(): void;
}

declare interface Sprite_CharacterText extends Sprite {
  isCharacter(character: Game_Character): boolean;
  setup(text: string, offsetX: number, offsetY: number): void;
}
