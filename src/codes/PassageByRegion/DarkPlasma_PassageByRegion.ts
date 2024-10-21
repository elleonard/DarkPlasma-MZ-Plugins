/// <reference path="./PassageByRegion.d.ts" />

import { settings } from "./_build/DarkPlasma_PassageByRegion_parameters";

function Game_Map_PassageByRegionMixIn(gameMap: Game_Map) {
  const _isPassable = gameMap.isPassable;
  gameMap.isPassable = function (x, y, d) {
    if (this.isImpassableRegion(x, y, d)) {
      return false;
    }
    return this.isPassableRegion(x, y) || _isPassable.call(this, x, y, d);
  };

  gameMap.isPassableRegion = function (x, y) {
    const regionSetting = settings.regions.find(region => region.id === this.regionId(x, y));
    return regionSetting ? regionSetting.through : false;
  };

  gameMap.isImpassableRegion = function (x, y, d) {
    const regionSetting = settings.regions.find(region => region.id === this.regionId(x, y));
    const impassableFlag = 0
        | (regionSetting?.impassableUp ? 8 : 0)
        | (regionSetting?.impassableRight ? 4 : 0)
        | (regionSetting?.impassableLeft ? 2 : 0)
        | (regionSetting?.impassableDown ? 1 : 0);
    return (impassableFlag & ((1 << (d / 2 - 1)) & 0x0f)) !== 0;
  };
}

Game_Map_PassageByRegionMixIn(Game_Map.prototype);
