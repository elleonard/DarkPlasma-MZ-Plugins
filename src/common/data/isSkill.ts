export function isSkill(data: DataManager.NoteHolder): data is MZ.Skill {
  return $dataSkills && $dataSkills.includes(data as MZ.Skill);
}
