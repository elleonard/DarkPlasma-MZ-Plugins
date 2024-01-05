/// <reference path="./PartitionTileLayer.d.ts" />

import { settings } from "./_build/DarkPlasma_PartitionTileLayer_parameters";

function Tilemap_PartitionTileLayerMixIn(tilemap: Tilemap) {
  const _updateTransform = tilemap.updateTransform;
  tilemap.updateTransform = function () {
    const ox = Math.ceil(this.origin.x);
    const oy = Math.ceil(this.origin.y);
    const startX = Math.floor((ox - this._margin) / this.tileWidth);
    const startY = Math.floor((oy - this._margin) / this.tileHeight);
    this._partitionLayer.x = startX * this.tileWidth - ox;
    this._partitionLayer.y = startY * this.tileHeight - oy;
    _updateTransform.call(this);
  };

  const _createLayers = tilemap._createLayers;
  tilemap._createLayers = function () {
    _createLayers.call(this);
    this._partitionLayer = new Tilemap.CombinedLayer();
    this._partitionLayer.z = 3;
    this.addChild(this._partitionLayer);
  };

  const _addAllSpots = tilemap._addAllSpots;
  tilemap._addAllSpots = function (startX, startY) {
    this._partitionLayer.clear();
    _addAllSpots.call(this, startX, startY);
  };

  const _addSpotTile = tilemap._addSpotTile;
  tilemap._addSpotTile = function (tileId, dx, dy) {
    if (this.isPartitionTile(tileId)) {
      this._addTile(this._partitionLayer, tileId, dx, dy);
    } else {
      _addSpotTile.call(this, tileId, dx, dy);
    }
  };

  tilemap.isPartitionTile = function (tileId) {
    return this.flags[tileId] >> 12 === settings.terrainTag;
  };
}

Tilemap_PartitionTileLayerMixIn(Tilemap.prototype);

function Game_CharacterBase_PartitionTileLayerMixIn(gameCharacterBase: Game_CharacterBase) {
  const _screenZ = gameCharacterBase.screenZ;
  gameCharacterBase.screenZ = function () {
    const z = _screenZ.call(this);
    const xRange = [this.x-1, this.x, this.x + 1];
    if (xRange.some(x => $gameMap.terrainTag(x, this.y) === settings.terrainTag)) {
      return z - 0.1;
    } else if (xRange.some(x => $gameMap.terrainTag(x, this.y + 1) === settings.terrainTag)) {
      return z + 0.1;
    }
    return z;
  };
}

Game_CharacterBase_PartitionTileLayerMixIn(Game_CharacterBase.prototype);
