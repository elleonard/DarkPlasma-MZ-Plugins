// DarkPlasma_PartitionTileLayer 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/01/05 1.0.0 公開
 */

/*:
 * @plugindesc カーテンや衝立のようなタイルレイヤー
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param terrainTag
 * @desc カーテンや衝立を表す地形タグを設定します。
 * @text 地形タグ
 * @type number
 * @default 1
 *
 * @help
 * version: 1.0.0
 * マップにおいて、キャラクターが下のマスにいる場合は奥に、そのマスにいる場合は手前に
 * 表示されるような特殊なレイヤーに配置するタイルを設定します。
 * ただし、そのようなタイルを上下に連続して配置した場合の仕様は定義しません。
 *
 * FSMのベッドのベッドボードの通行設定について
 * 下方向のみ通行不可にして侵入可能としてしまうと
 * ベッドボードよりもキャラクターが手前に表示されてしまう問題を解決します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    terrainTag: Number(pluginParameters.terrainTag || 1),
  };

  function Tilemap_PartitionTileLayerMixIn(tilemap) {
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
  function Game_CharacterBase_PartitionTileLayerMixIn(gameCharacterBase) {
    const _screenZ = gameCharacterBase.screenZ;
    gameCharacterBase.screenZ = function () {
      const z = _screenZ.call(this);
      const xRange = [this.x - 1, this.x, this.x + 1];
      if (xRange.some((x) => $gameMap.terrainTag(x, this.y) === settings.terrainTag)) {
        return z - 0.1;
      } else if (xRange.some((x) => $gameMap.terrainTag(x, this.y + 1) === settings.terrainTag)) {
        return z + 0.1;
      }
      return z;
    };
  }
  Game_CharacterBase_PartitionTileLayerMixIn(Game_CharacterBase.prototype);
})();
