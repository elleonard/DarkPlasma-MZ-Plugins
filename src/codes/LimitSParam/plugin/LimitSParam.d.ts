/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_BattlerBase {
  sparamLimitSetting(paramId: number): {
    enableUpperLimit: boolean;
    upperLimit: number;
    enableLowerLimit: boolean;
    lowerLimit: number;
  };
}