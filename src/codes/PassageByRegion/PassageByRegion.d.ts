/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Map {
  isPassableRegion(x: number, y: number): boolean;
  isImpassableRegion(x: number, y: number, d: number): boolean;
}
