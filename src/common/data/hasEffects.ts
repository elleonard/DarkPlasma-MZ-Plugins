export function hasEffects(data: DataManager.NoteHolder): data is MZ.Item | MZ.Skill {
  return "effects" in data;
}
