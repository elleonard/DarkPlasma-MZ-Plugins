/// <reference path="../../typings/rmmz/rmmz_objects.d.ts" />
/// <reference path="../../typings/rmmz/rmmz_windows.d.ts" />
/// <reference path="../../typings/rmmz/rmmz_sprites.d.ts" />
/// <reference path="../../typings/rmmz/rmmz_core.d.ts" />
/// <reference path="../../typings/rmmz/lib/pixi.js.d.ts" />
/// <reference path="../../typings/rmmz/data.d.ts" />
/// <reference path="../../typings/rmmz/globaldata.d.ts" />

declare interface Game_Map {
  isDark(): boolean;
  lightEvents(): Game_Event[];
}

declare interface Game_Event {
  hasLight(): boolean;
  lightRadius(): number;
  lightColor(): string | null;
}

declare interface Bitmap {
  fillGradientCircle(centerX: number, centerY: number, radius: number, lightColor: string): void;
}

declare class DarknessLayer extends PIXI.Container {
  _width: number;
  _height: number;
  _bitmap: Bitmap;
}

declare interface Spriteset_Map {
  _darknessLayer: DarknessLayer;

  createDarknessLayer(): void;
  addChild(child: PIXI.Container): PIXI.DisplayObject;
}
