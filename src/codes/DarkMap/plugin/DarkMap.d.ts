/// <reference path="../../../typings/rmmz.d.ts" />

declare class DarknessLayer extends PIXI.Container {
  _width: number;
  _height: number;
  _bitmap: Bitmap;

  createSprite(): void;
  update(): void;
}

declare interface Game_Map {
  isDark(): boolean;
  lightEvents(): Game_Event[];
}

type Game_CharacterLight = {
  isOn: boolean;
  radius: number;
  color?: string;
};

declare interface Game_CharacterBase {
  _light: Game_CharacterLight;

  initializeLight(): void;

  isLightOn(): boolean;
  turnOnLight(): void;
  turnOffLight(): void;

  lightRadius(): number;
  setLightRadius(radius: number): void;

  lightColor(): string;
  setLightColor(color?: string): void;

  onLightChange(): void;
}

declare interface Game_Event {
  restoreLight(): void;
  mustSaveLight(): boolean;
}

declare interface Game_System {
  _eventLights: {[key: string]: Game_CharacterLight};

  initializeEventLights(): void;
  eventLights(): {[key: string]: Game_CharacterLight};
  storeEventLight(mapId: number, eventId: number, light: Game_CharacterLight): void;
  fetchEventLight(mapId: number, eventId: number): Game_CharacterLight|undefined;
  eventLightKey(mapId: number, eventId: number): string;
}

declare interface Bitmap {
  fillGradientCircle(centerX: number, centerY: number, radius: number, lightColor: string): void;
}

declare interface Spriteset_Map {
  _darknessLayer: DarknessLayer;

  createDarknessLayer(): void;
}
