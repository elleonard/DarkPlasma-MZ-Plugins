/// <reference path="./SaveEventLocations.d.ts" />

class Game_EventLocation {
  _x: number;
  _y: number;
  _direction: number;
  constructor(x: number, y: number, direction: number) {
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

  notMoved(x: number, y: number, direction: number) {
    return this.x === x && this.y === y && this.direction === direction;
  }
}

class Game_EventLocations {
  _locations: {[key: string]: Game_EventLocation} = {};

  storeLocation(mapId: number, eventId: number, location: Game_EventLocation) {
    this._locations[this.key(mapId, eventId)] = location;
  }

  fetchLocation(mapId: number, eventId: number): Game_EventLocation|undefined {
    return this._locations[this.key(mapId, eventId)];
  }

  key(mapId: number, eventId: number) {
    return `${mapId}_${eventId}`;
  }
}

function Game_Map_SaveEventLocationMixIn(gameMap: Game_Map) {
  gameMap.mustSaveEventLocations = function () {
    return !!$dataMap?.meta.saveEventLocations;
  };
}

Game_Map_SaveEventLocationMixIn(Game_Map.prototype);

function Game_Event_SaveLocationMixIn(gameEvent: Game_Event) {
  const _initialize = gameEvent.initialize;
  gameEvent.initialize = function (mapId, eventId) {
    _initialize.call(this, mapId, eventId);
    if (this.mustRestoreLocation()) {
      this.restoreLocation();
    }
  };

  gameEvent.mustSaveLocation = function () {
    return $gameMap.mustSaveEventLocations() || !!this.event()?.meta.saveLocation
      && !$gameSystem.fetchSavedEventLocation(
          this._mapId, 
          this.eventId()
        )?.notMoved(this.x, this.y, this.direction());
  };

  gameEvent.mustRestoreLocation = function () {
    /**
     * this.event() は EventReSpawn.js のプレハブイベントで undefined を返し得る
     */
    return $gameMap.mustSaveEventLocations() || !!this.event()?.meta.saveLocation
      && !!$gameSystem.fetchSavedEventLocation(
        this._mapId, 
        this.eventId()
      );
  };

  gameEvent.restoreLocation = function () {
    const location = $gameSystem.fetchSavedEventLocation(
      this._mapId, 
      this.eventId()
    );
    if (location) {
      this.locate(location.x, location.y);
      this.setDirection(location.direction);
    }
  };

  const _update = gameEvent.update;
  gameEvent.update = function () {
    _update.call(this);
    if (this.mustSaveLocation()) {
      $gameSystem.storeEventLocation(
        this._mapId,
        this.eventId(),
        this.x,
        this.y,
        this.direction()
      );
    }
  };
}

Game_Event_SaveLocationMixIn(Game_Event.prototype);

function Game_System_SaveEventLocationMixIn(gameSystem: Game_System) {
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

type _Game_EventLocation = typeof Game_EventLocation;
type _Game_EventLocations = typeof Game_EventLocations;
declare global {
  var Game_EventLocation: _Game_EventLocation;
  var Game_EventLocations: _Game_EventLocations;
}
globalThis.Game_EventLocation = Game_EventLocation;
globalThis.Game_EventLocations = Game_EventLocations;

export {};
