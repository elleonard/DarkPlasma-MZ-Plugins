/// <reference path="../../../typings/rmmz.d.ts" />

/**
 * Foreground.js
 */
declare namespace ImageManager {
  function isZeroForeground(filename: string): boolean;
}

type Game_Foreground = {
  file: string;
  loopX: boolean;
  loopY: boolean;
  scrollSpeedX: number;
  scrollSpeedY: number;
};

declare interface Game_Map {
  _foregroundDefined: boolean;
  _foregroundName: string;
  _foregroundZero: boolean;
  _foregroundLoopX: boolean;
  _foregroundLoopY: boolean;
  _foregroundSx: number;
  _foregroundSy: number;
  _foregroundX: number;
  _foregroundY: number;

  initForeground(): void;
  guardForeground(): void;
  foregroundName(): string;
  setupForeground(): void;
  foregroundOx(): number;
  foregroundOy(): number;
  updateForeground(): void;

  setForeground(foreground: Game_Foreground): void;
  clearForeground(): void;
}

declare interface Spriteset_Map {
  _foreground: TilingSprite;

  createForeground(): void;
  updateForeground(): void;
}
