export function isState(data: DataManager.NoteHolder): data is MZ.State {
  return $dataStates && $dataStates.includes(data as MZ.State);
}
