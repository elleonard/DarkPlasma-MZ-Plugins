export function isArmor(data: DataManager.NoteHolder): data is MZ.Armor {
  return $dataArmors && $dataArmors.includes(data as MZ.Armor);
}
