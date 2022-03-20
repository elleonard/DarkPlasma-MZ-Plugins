const KIND = {
  NONE: 0,
  ITEM: 1,
  WEAPON: 2,
  ARMOR: 3,
};

/**
 * アイテムデータから種別定数を返す
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} data
 * @return {number}
 */
export function kindFromData(data) {
  if (DataManager.isItem(data)) {
    return KIND.ITEM;
  } else if (DataManager.isWeapon(data)) {
    return KIND.WEAPON;
  } else if (DataManager.isArmor(data)) {
    return KIND.ARMOR;
  }
  return KIND.NONE;
}
