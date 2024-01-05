/// <reference path="../../typings/rmmz.d.ts" />

declare interface Tilemap {
  _partitionLayer: Tilemap.CombinedLayer;

  isPartitionTile(tileId: number): boolean;
}
