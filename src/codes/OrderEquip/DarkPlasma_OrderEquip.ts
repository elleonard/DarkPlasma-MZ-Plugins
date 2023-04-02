/// <reference path="./OrderEquip.d.ts" />

import { settings } from './_build/DarkPlasma_OrderEquip_parameters';

const paramsKeyMap = {
  mhp: 0,
  mmp: 1,
  atk: 2,
  def: 3,
  mat: 4,
  mdf: 5,
  agi: 6,
  luk: 7,
};

function equipSortKeyMap(equip: MZ.Weapon|MZ.Armor, key: string): number {
  switch (key) {
    case 'mhp':
    case 'mmp':
    case 'atk':
    case 'def':
    case 'mat':
    case 'mdf':
    case 'agi':
    case 'luk':
      return equip.params[paramsKeyMap[key]];
    case 'id':
      return equip.orderId || equip.id;
    default:
      const result = DataManager.isWeapon(equip) ? equip[key as keyof MZ.Weapon] : equip[key as keyof MZ.Armor];
      return Number.isFinite(result) ? Number(result) : 0;
  }
}

function compareEquip(a: MZ.Weapon|MZ.Armor, b: MZ.Weapon|MZ.Armor, keys: string[]): number {
  if (a === null && b === null) {
    // 両方nullなら順不同
    return 0;
  } else if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  }
  const key: string = keys.shift()!;
  const diff = equipSortKeyMap(a, key) - equipSortKeyMap(b, key);
  if (diff === 0) {
    return keys.length === 0 ? 0 : compareEquip(a, b, keys);
  }
  return diff;
}

function Window_OrderEquipMixIn(windowClass: Window_Selectable) {
  windowClass.sortWeapons = function (weapons) {
    return weapons.sort(
      (a, b) => (settings.weaponOrder === 'desc' ? -1 : 1) * compareEquip(a, b, settings.weaponSortKeys.slice())
    );
  };

  windowClass.sortArmors = function (armors) {
    return armors.sort(
      (a, b) => (settings.armorOrder === 'desc' ? -1 : 1) * compareEquip(a, b, settings.armorSortKeys.slice())
    );
  };
}

Window_OrderEquipMixIn(Window_Selectable.prototype);

/**
 * @param {Window_ItemList.prototype} windowClass
 */
function Window_ItemList_OrderEquipMixIn(windowClass: Window_ItemList) {
  const _makeItemList = windowClass.makeItemList;
  windowClass.makeItemList = function () {
    _makeItemList.call(this);
    this.sortEquips();
  };

  windowClass.sortEquips = function () {
    if (this.isWeaponList()) {
      this._data = this.sortWeapons(this._data as MZ.Weapon[]);
    } else if (this.isArmorList()) {
      this._data = this.sortArmors(this._data as MZ.Armor[]);
    }
  };

  windowClass.isWeaponList = function () {
    return this._category === 'weapon';
  };

  windowClass.isArmorList = function () {
    return this._category === 'armor';
  };
}

Window_ItemList_OrderEquipMixIn(Window_ItemList.prototype);

/**
 * @param {Window_EquipItem.prototype} windowClass
 */
function Window_EquipItem_OrderEquipMixIn(windowClass: Window_EquipItem) {
  windowClass.isWeaponList = function () {
    return this.etypeId() === 1;
  };

  windowClass.isArmorList = function () {
    return this.etypeId() > 1;
  };
}

Window_EquipItem_OrderEquipMixIn(Window_EquipItem.prototype);
