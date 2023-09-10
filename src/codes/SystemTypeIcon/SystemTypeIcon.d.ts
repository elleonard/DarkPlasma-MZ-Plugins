/// <reference path="../../typings/rmmz.d.ts" />

type ParamName = 'mhp'|'mmp'|'atk'|'def'|'mat'|'mdf'|'agi'|'luk';

declare interface Game_System {
  elementIconIndex(elementId: number): number;
  largeDebuffStatusIconIndex(paramName: ParamName): number;
  smallDebuffStatusIconIndex(paramName: ParamName): number;
  weaponTypeIconIndex(weaponTypeId: number): number;
  armorTypeIconIndex(armorTypeId: number): number;
}
