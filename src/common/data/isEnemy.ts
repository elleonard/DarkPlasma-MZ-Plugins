export function isEnemy(data: DataManager.NoteHolder): data is MZ.Enemy {
  return $dataEnemies && $dataEnemies.includes(data as MZ.Enemy);
}
