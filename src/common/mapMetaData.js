/**
 * マップのメタデータを取得できるか
 * @return {boolean}
 */
export function isMapMetaDataAvailable() {
  return $dataMap && $dataMap.meta;
}
