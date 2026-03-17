// DarkPlasma_CleanUpDeletedEvents 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/03/17 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 削除されたイベントをセーブデータから除去する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * ゲームのバージョンアップによって削除されたイベントも、
 * セーブデータ内には残ってしまいます。
 * 本プラグインは、その残ってしまったセーブデータを除去し、意図しないエラーを防ぎます。
 */

(() => {
  'use strict';

  function Game_Map_CleanUpDeletedEventMixIn(gameMap) {
    gameMap.cleanUpDeletedEvents = function () {
      this._events = this._events.filter((event) => !event || !!event.event());
    };
  }
  Game_Map_CleanUpDeletedEventMixIn(Game_Map.prototype);
  function Scene_Map_CleanUpDeletedEventsMixIn(sceneMap) {
    const _onMapLoaded = sceneMap.onMapLoaded;
    sceneMap.onMapLoaded = function () {
      _onMapLoaded.call(this);
      $gameMap.cleanUpDeletedEvents();
    };
  }
  Scene_Map_CleanUpDeletedEventsMixIn(Scene_Map.prototype);
})();
