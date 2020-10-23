import { targetPluginName } from './targetPluginName';

/**
 * テストケースを登録する
 * @param {string} targetPluginVersion 対象プラグインのバージョン
 * @param {string} testCaseName テストケース名
 * @param {boolean} isAuto 自動かどうか
 */
export function registerTestCase(targetPluginVersion, testCaseName, isAuto) {
  $testTargetPlugins.addTestCase(targetPluginName, targetPluginVersion, testCaseName, isAuto);
}
