/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Actor {
  physicalDamageRateByPosition(): number;
  magicalDamageRateByPosition(): number;
  originalIndex(): number;
}
