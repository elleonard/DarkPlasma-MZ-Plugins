export function isActor(data: DataManager.NoteHolder): data is MZ.Actor {
  return $dataActors && $dataActors.includes(data as MZ.Actor);
}
