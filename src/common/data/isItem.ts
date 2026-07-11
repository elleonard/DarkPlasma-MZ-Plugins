export function isItem(data: DataManager.NoteHolder): data is MZ.Item {
  return $dataItems && $dataItems.includes(data as MZ.Item);
}
