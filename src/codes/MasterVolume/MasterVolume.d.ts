/// <reference path="../../typings/rmmz.d.ts" />

declare namespace ConfigManager {
  var masterVolume: number;

  interface Config {
    masterVolume: number;
  }
}

declare namespace AudioManager {
  var _masterVolume: number;
  var masterVolume: number;
}
