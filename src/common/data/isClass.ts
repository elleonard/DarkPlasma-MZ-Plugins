export function isClass(data: DataManager.NoteHolder): data is MZ.Class {
  return $dataClasses && $dataClasses.includes(data as MZ.Class);
}
