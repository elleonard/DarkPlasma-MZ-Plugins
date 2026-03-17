/// <reference path="./CleanUpDeletedEvents.d.ts" />

function Game_Map_CleanUpDeletedEventMixIn(gameMap: Game_Map) {
  gameMap.cleanUpDeletedEvents = function () {
    this._events = this._events.filter(event => !event || !!event.event());
  };
}

Game_Map_CleanUpDeletedEventMixIn(Game_Map.prototype);

function Scene_Map_CleanUpDeletedEventsMixIn(sceneMap: Scene_Map) {
  const _onMapLoaded = sceneMap.onMapLoaded;
  sceneMap.onMapLoaded = function () {
    _onMapLoaded.call(this);
    $gameMap.cleanUpDeletedEvents();
  };
}

Scene_Map_CleanUpDeletedEventsMixIn(Scene_Map.prototype);
