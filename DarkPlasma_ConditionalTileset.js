// DarkPlasma_ConditionalTileset 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/07/19 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 条件連動タイルセット
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param switchMapTileset
 * @desc スイッチに連動して変化するタイルセットの設定一覧
 * @text スイッチ連動タイルセット
 * @type struct<SwitchMapTileset>[]
 * @default []
 *
 * @help
 * version: 1.0.0
 * 指定した条件に連動して、指定マップのタイルセットを変更します。
 */
/*~struct~SwitchMapTileset:
 * @param switchId
 * @text スイッチ
 * @type switch
 * @default 0
 *
 * @param mapId
 * @text マップ
 * @type map
 *
 * @param tilesetId
 * @text タイルセット
 * @type tileset
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    switchMapTileset: pluginParameters.switchMapTileset
      ? JSON.parse(pluginParameters.switchMapTileset).map((e) => {
          return e
            ? ((parameter) => {
                const parsed = JSON.parse(parameter);
                return {
                  switchId: Number(parsed.switchId || 0),
                  mapId: Number(parsed.mapId || 1),
                  tilesetId: Number(parsed.tilesetId || 0),
                };
              })(e)
            : { switchId: 0, mapId: 1, tilesetId: 0 };
        })
      : [],
  };

  function Scene_Map_ConditionalTilesetMixIn(sceneMap) {
    const _onMapLoaded = sceneMap.onMapLoaded;
    sceneMap.onMapLoaded = function () {
      const mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
      $dataMap.conditionalTilesets = settings.switchMapTileset.filter((smt) => smt.mapId === mapId);
      _onMapLoaded.call(this);
    };
  }
  Scene_Map_ConditionalTilesetMixIn(Scene_Map.prototype);
  function Game_Map_ConditionalTilesetMixIn(gameMap) {
    const _setup = gameMap.setup;
    gameMap.setup = function (mapId) {
      _setup.call(this, mapId);
      this.refreshTileset();
    };
    gameMap.refreshTileset = function () {
      const conditionalTileset = $dataMap?.conditionalTilesets.find((smt) => $gameSwitches.value(smt.switchId));
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
})();
