/// <reference path="./FloorDamageFlash.d.ts" />

import { settings } from '../config/_build/DarkPlasma_FloorDamageFlash_parameters';

function Game_Screen_FloorDamageFlashMixIn(gameScreen: Game_Screen) {
  gameScreen.floorDamageFlashDuration = function() {
    return settings.duration;
  };

  gameScreen.floorDamageFlashColor = function () {
    return [
      settings.red,
      settings.green,
      settings.blue,
      settings.opacity,
    ];
  };

  gameScreen.startFlashForDamage = function () {
    this.startFlash(this.floorDamageFlashColor(), this.floorDamageFlashDuration());
  };
}

Game_Screen_FloorDamageFlashMixIn(Game_Screen.prototype);
