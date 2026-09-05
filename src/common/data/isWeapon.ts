export function isWeapon(data: DataManager.NoteHolder): data is MZ.Weapon {
  return $dataWeapons && $dataWeapons.includes(data as MZ.Weapon);
}
