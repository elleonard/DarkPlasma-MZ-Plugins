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

declare interface Game_CharacterBase {
  hasLight(): boolean;
  lightRadius(): number;
  lightColor(): string|null;
}

declare interface Bitmap {
  fillGradientCircle(centerX: number, centerY: number, radius: number, lightColor: string): void;
}

declare interface Spriteset_Map {
  _darknessLayer: DarknessLayer;

  createDarknessLayer(): void;
}
