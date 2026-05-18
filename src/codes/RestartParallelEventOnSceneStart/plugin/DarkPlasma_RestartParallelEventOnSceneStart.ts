/// <reference path="./RestartParallelEventOnSceneStart.d.ts" />

const META_TAG = 'restartOnSceneStart';

function Scene_Map_RestartParallelEventMixIn(sceneMap: Scene_Map) {
  const _start = sceneMap.start;
  sceneMap.start = function () {
    _start.call(this);
    $gameMap.events()
      .filter(event => event.isRestartOnSceneStart())
      .forEach(event => event.restartInterpreter());
  };
}

Scene_Map_RestartParallelEventMixIn(Scene_Map.prototype);

function Game_Event_RestartParallelEventMixIn(gameEvent: Game_Event) {
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
