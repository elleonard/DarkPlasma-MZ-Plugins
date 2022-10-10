export function hasTraits(data: DataManager.NoteHolder): data is MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy {
  return "traits" in data;
}
