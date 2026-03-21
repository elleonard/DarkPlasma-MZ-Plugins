/// <reference path="./RecoverGameEvents.d.ts" />

function Game_Map_CleanUpDeletedEventMixIn(gameMap: Game_Map) {
  gameMap.recoverEvents = function () {
    const events: Game_Event[] = [];
    this._events.filter(event => event && event.event()).forEach(event => {
      events[event.eventId()] = event;
    });
    this._events = events;
  }
}

Game_Map_CleanUpDeletedEventMixIn(Game_Map.prototype);

function Scene_Map_CleanUpDeletedEventsMixIn(sceneMap: Scene_Map) {
  const _onMapLoaded = sceneMap.onMapLoaded;
  sceneMap.onMapLoaded = function () {
    _onMapLoaded.call(this);
    $gameMap.recoverEvents();
  };
}

Scene_Map_CleanUpDeletedEventsMixIn(Scene_Map.prototype);
