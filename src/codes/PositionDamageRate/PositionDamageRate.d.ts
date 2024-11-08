/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_BattlerBase {
  physicalDamageRateByPosition(): number;
  magicalDamageRateByPosition(): number;
}

declare interface Game_Actor {
  originalIndex(): number;
}
