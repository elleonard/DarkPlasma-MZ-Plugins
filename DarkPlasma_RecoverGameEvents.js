// DarkPlasma_RecoverGameEvents 2.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/03/21 2.0.0 CleanUpDeletedEventsから改名
 * 2026/03/17 1.0.1 イベントの一時消去などが正常に動作しなくなる不具合を修正
 *            1.0.0 最初のバージョン
 */

/*:
 * @plugindesc セーブデータのイベント配列を復元する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 2.0.0
 * セーブデータにはイベントの状態が配列で記録されます。
 * 本プラグインは、セーブデータに含まれるイベント配列のキーを
 * 意図しない状態から復元するためのプラグインです。
 *
 * 通常のプロジェクトにとっては不要ですので、必要性を認識してから導入を検討してください。
 */

(() => {
  'use strict';

  function Game_Map_CleanUpDeletedEventMixIn(gameMap) {
    gameMap.recoverEvents = function () {
      const events = [];
      this._events
        .filter((event) => event && event.event())
        .forEach((event) => {
          events[event.eventId()] = event;
        });
      this._events = events;
    };
  }
  Game_Map_CleanUpDeletedEventMixIn(Game_Map.prototype);
  function Scene_Map_CleanUpDeletedEventsMixIn(sceneMap) {
    const _onMapLoaded = sceneMap.onMapLoaded;
    sceneMap.onMapLoaded = function () {
      _onMapLoaded.call(this);
      $gameMap.recoverEvents();
    };
  }
  Scene_Map_CleanUpDeletedEventsMixIn(Scene_Map.prototype);
})();
