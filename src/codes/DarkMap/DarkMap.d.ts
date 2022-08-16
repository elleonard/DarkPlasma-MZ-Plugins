/// <reference path="../../typings/rmmz/rmmz_objects.d.ts" />
/// <reference path="../../typings/rmmz/rmmz_windows.d.ts" />

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

declare namespace DarknessLayer {}

declare interface Spriteset_Map {
  _darknessLayer: DarknessLayer;

  createDarknessLayer(): void;
  addChild(child: PIXI.Container): void;
}
