// DarkPlasma_SaveEventLocations 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/04/13 1.0.0 公開
 */

/*:
 * @plugindesc マップ上のイベント位置と向きを記録する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * RPGツクールMZでは、マップのロード時に
 * イベントの位置と向きを初期化します。
 * 本プラグインはマップ上のイベント位置と向きを記録し、
 * 再びそのマップをロードした際に、その情報を元に
 * イベントの位置と向きを復元します。
 *
 * マップのメモ欄に以下のように記述すると
 * そのマップのイベントすべての位置と向きを記録します。
 * <saveEventLocations>
 *
 * イベントのメモ欄に以下のように記述すると
 * そのイベントの位置と向きを記録します。
 * <saveLocation>
 *
 * 記録した位置と向きはセーブデータに含まれます。
 * 記録するイベントの数が多いほど、
 * セーブデータの容量も大きくなります。
 */

(() => {
  'use strict';

  class Game_EventLocation {
    constructor(x, y, direction) {
      this._x = x;
      this._y = y;
      this._direction = direction;
    }
    get x() {
      return this._x;
    }
    get y() {
      return this._y;
    }
    get direction() {
      return this._direction;
    }
    notMoved(x, y, direction) {
      return this.x === x && this.y === y && this.direction === direction;
    }
  }
  class Game_EventLocations {
    constructor() {
      this._locations = {};
    }
    storeLocation(mapId, eventId, location) {
      this._locations[this.key(mapId, eventId)] = location;
    }
    fetchLocation(mapId, eventId) {
      return this._locations[this.key(mapId, eventId)];
    }
    key(mapId, eventId) {
      return `${mapId}_${eventId}`;
    }
  }
  function Game_Map_SaveEventLocationMixIn(gameMap) {
    gameMap.mustSaveEventLocations = function () {
      return !!$dataMap?.meta.saveEventLocations;
    };
  }
  Game_Map_SaveEventLocationMixIn(Game_Map.prototype);
  function Game_Event_SaveLocationMixIn(gameEvent) {
    const _initialize = gameEvent.initialize;
    gameEvent.initialize = function (mapId, eventId) {
      _initialize.call(this, mapId, eventId);
      if (this.mustRestoreLocation()) {
        this.restoreLocation();
      }
    };
    gameEvent.mustSaveLocation = function () {
      return (
        $gameMap.mustSaveEventLocations() ||
        (!!this.event()?.meta.saveLocation &&
          !$gameSystem.fetchSavedEventLocation(this._mapId, this.eventId())?.notMoved(this.x, this.y, this.direction()))
      );
    };
    gameEvent.mustRestoreLocation = function () {
      /**
       * this.event() は EventReSpawn.js のプレハブイベントで undefined を返し得る
       */
      return (
        $gameMap.mustSaveEventLocations() ||
        (!!this.event()?.meta.saveLocation && !!$gameSystem.fetchSavedEventLocation(this._mapId, this.eventId()))
      );
    };
    gameEvent.restoreLocation = function () {
      const location = $gameSystem.fetchSavedEventLocation(this._mapId, this.eventId());
      if (location) {
        this.locate(location.x, location.y);
        this.setDirection(location.direction);
      }
    };
    const _update = gameEvent.update;
    gameEvent.update = function () {
      _update.call(this);
      if (this.mustSaveLocation()) {
        $gameSystem.storeEventLocation(this._mapId, this.eventId(), this.x, this.y, this.direction());
      }
    };
  }
  Game_Event_SaveLocationMixIn(Game_Event.prototype);
  function Game_System_SaveEventLocationMixIn(gameSystem) {
    const _initialize = gameSystem.initialize;
    gameSystem.initialize = function () {
      _initialize.call(this);
      this._eventLocations = new Game_EventLocations();
    };
    const _onAfterLoad = gameSystem.onAfterLoad;
    gameSystem.onAfterLoad = function () {
      _onAfterLoad.call(this);
      if (!this._eventLocations) {
        this._eventLocations = new Game_EventLocations();
      }
    };
    gameSystem.storeEventLocation = function (mapId, eventId, x, y, direction) {
      this._eventLocations.storeLocation(mapId, eventId, new Game_EventLocation(x, y, direction));
    };
    gameSystem.fetchSavedEventLocation = function (mapId, eventId) {
      return this._eventLocations.fetchLocation(mapId, eventId);
    };
  }
  Game_System_SaveEventLocationMixIn(Game_System.prototype);
  globalThis.Game_EventLocation = Game_EventLocation;
  globalThis.Game_EventLocations = Game_EventLocations;
})();
