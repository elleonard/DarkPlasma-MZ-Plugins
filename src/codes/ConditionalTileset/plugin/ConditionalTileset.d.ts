/// <reference path="../../../typings/rmmz.d.ts" />

type ConditionalTileset = {
  switchId: number;
  tilesetId: number;
};

declare namespace MZ {
  interface Map {
    conditionalTilesets: ConditionalTileset[];
  }
}

declare interface Game_Map {
  refreshTileset(): void;
  conditionalTilesetId(): number;
  switchConditionalTilesetId(): number;
}
