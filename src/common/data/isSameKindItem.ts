export function isSameKindItem(data1: MZ.Item|MZ.Weapon|MZ.Armor, data2: MZ.Item|MZ.Weapon|MZ.Armor): boolean {
  return DataManager.isItem(data1) && DataManager.isItem(data2)
    || DataManager.isWeapon(data1) && DataManager.isWeapon(data2)
    || DataManager.isArmor(data1) && DataManager.isArmor(data2);
}
