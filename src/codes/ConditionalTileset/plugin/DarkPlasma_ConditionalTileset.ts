/// <reference path="./ConditionalTileset.d.ts" />

import { settings } from '../config/_build/DarkPlasma_ConditionalTileset_parameters';

function Scene_Map_ConditionalTilesetMixIn(sceneMap: Scene_Map) {
  const _onMapLoaded = sceneMap.onMapLoaded;
  sceneMap.onMapLoaded = function () {
    const mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    $dataMap!.conditionalTilesets = settings.switchMapTileset
      .filter(smt => smt.mapId === mapId);
    _onMapLoaded.call(this);
  };
}

Scene_Map_ConditionalTilesetMixIn(Scene_Map.prototype);

function Game_Map_ConditionalTilesetMixIn(gameMap: Game_Map) {
  const _setup = gameMap.setup;
  gameMap.setup = function (mapId) {
    _setup.call(this, mapId);
    this.refreshTileset();
  };

  gameMap.refreshTileset = function () {
    const conditionalTileset = $dataMap?.conditionalTilesets.find(smt => $gameSwitches.value(smt.switchId));
    if (conditionalTileset && conditionalTileset.tilesetId !== this._tilesetId) {
      this.changeTileset(conditionalTileset.tilesetId);
    }
  };

  const _refresh = gameMap.refresh;
  gameMap.refresh = function () {
    _refresh.call(this);
    this.refreshTileset();
  };
}

Game_Map_ConditionalTilesetMixIn(Game_Map.prototype);
