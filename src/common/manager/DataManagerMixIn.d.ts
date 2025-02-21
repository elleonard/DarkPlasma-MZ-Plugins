/// <reference path="../../typings/rmmz.d.ts" />

declare namespace DataManager {
  function kindOf(data: MZ.Item|MZ.Weapon|MZ.Armor): number|undefined;
  function dataObject(kind: number, dataId: number): MZ.Item|MZ.Weapon|MZ.Armor|null;
}
