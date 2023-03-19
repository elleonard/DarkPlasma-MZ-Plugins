/// <reference path="./ControlAutoplay.d.ts" />

import { settings } from "./_build/DarkPlasma_ControlAutoplay_parameters";

function Game_Map_ControlAutoPlayMixIn(gameMap: Game_Map) {
  /**
   * コードをシンプルにするために上書き
   */
  gameMap.autoplay = function () {
    if (this.isAutoplayBgmEnabled()) {
      if ($gamePlayer.isInVehicle()) {
        $gameSystem.saveWalkingBgm2();
      } else {
        AudioManager.playBgm($dataMap!.bgm);
      }
    }
    if (this.isAutoplayBgsEnabled()) {
      AudioManager.playBgs($dataMap!.bgs);
    }
  };

  gameMap.isAutoplayBgmEnabled = function () {
    return !!$dataMap?.autoplayBgm &&
      (!settings.disableAutoplayBgmSwitch || !$gameSwitches.value(settings.disableAutoplayBgmSwitch));
  };

  gameMap.isAutoplayBgsEnabled = function () {
    return !!$dataMap?.autoplayBgs &&
      (!settings.disableAutoplayBgsSwitch || !$gameSwitches.value(settings.disableAutoplayBgsSwitch));
  };
}

Game_Map_ControlAutoPlayMixIn(Game_Map.prototype);
