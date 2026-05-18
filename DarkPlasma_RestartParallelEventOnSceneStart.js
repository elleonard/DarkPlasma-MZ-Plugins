// DarkPlasma_RestartParallelEventOnSceneStart 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/19 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc マップシーン開始時に先頭から再実行する並列実行イベント
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 *
 * マップシーン開始時（メニューを閉じた後、戦闘終了後など）に
 * 特定の並列実行イベントをコマンドリストの先頭から再実行します。
 *
 * イベントのメモ欄:
 * <restartOnSceneStart> マップシーン開始時に先頭から再実行します。
 *
 */

(() => {
  'use strict';

  const META_TAG = 'restartOnSceneStart';
  function Scene_Map_RestartParallelEventMixIn(sceneMap) {
    const _start = sceneMap.start;
    sceneMap.start = function () {
      _start.call(this);
      $gameMap
        .events()
        .filter((event) => event.isRestartOnSceneStart())
        .forEach((event) => event.restartInterpreter());
    };
  }
  Scene_Map_RestartParallelEventMixIn(Scene_Map.prototype);
  function Game_Event_RestartParallelEventMixIn(gameEvent) {
    gameEvent.isRestartOnSceneStart = function () {
      return !!this.event()?.meta[META_TAG];
    };
    gameEvent.restartInterpreter = function () {
      if (this._interpreter) {
        this._interpreter.setup(this.list(), this.eventId());
      }
    };
  }
  Game_Event_RestartParallelEventMixIn(Game_Event.prototype);
})();
