/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../DarkMap/plugin/DarkMap.d.ts" />

declare interface Game_Map {
  crowFlyDistance(x1, x2, y1, y2): number;
}

declare interface Game_CharacterBase {
  isInLights(): boolean;
  lightCovers(x, y): boolean;
}
