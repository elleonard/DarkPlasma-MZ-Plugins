import { settings } from './_build/DarkPlasma_NPCKeepOutRegion_parameters';

const MOVE_TYPE_CUSTOM = 3;

Game_Map.prototype.isEventKeepOutRegion = function (x, y) {
  return settings.regions.includes(this.regionId(x, y));
};

const _Game_Event_isMapPassable = Game_Event.prototype.isMapPassable;
Game_Event.prototype.isMapPassable = function (x, y, d) {
  const x2 = $gameMap.roundXWithDirection(x, d);
  const y2 = $gameMap.roundYWithDirection(y, d);
  if (this.isMoveRangeLimited() && $gameMap.isEventKeepOutRegion(x2, y2)) {
    return false;
  }
  return _Game_Event_isMapPassable.call(this, x, y, d);
};

Game_Event.prototype.isMoveRangeLimited = function () {
  return this._moveType !== MOVE_TYPE_CUSTOM && !this.isMoveRouteForcing();
};
