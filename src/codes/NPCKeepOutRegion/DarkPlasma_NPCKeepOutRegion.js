import { settings } from './_build/DarkPlasma_NPCKeepOutRegion_parameters';

Game_Map.prototype.isEventKeepOutRegion = function (x, y) {
  return settings.regions.includes(this.regionId(x, y));
};

/**
 * @param {Game_Event.prototype} gameEvent
 */
function Game_Event_KeepOutRegionMixIn(gameEvent) {
  const _isMapPassable = gameEvent.isMapPassable;
  gameEvent.isMapPassable = function (x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if (!this.ignoreKeepOut() && $gameMap.isEventKeepOutRegion(x2, y2)) {
      return false;
    }
    return _isMapPassable.call(this, x, y, d);
  };

  gameEvent.ignoreKeepOut = function () {
    if (!this.event()) {
      return false;
    }
    const selfSwitchCh = this.event().meta.ignoreKeepOut;
    return selfSwitchCh === true || $gameSelfSwitches.value([this._mapId, this._eventId, selfSwitchCh]);
  };
}

Game_Event_KeepOutRegionMixIn(Game_Event.prototype);
