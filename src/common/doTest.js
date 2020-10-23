import { targetPluginName } from './targetPluginName';

/**
 * テストを実行する
 * @param {string} targetPluginVersion 対象プラグインのバージョン
 * @param {string} testCaseName テストケース名
 * @param {TestSpec[]} testSpecs スペック一覧
 */
export function doTest(targetPluginVersion, testCaseName, testSpecs) {
  $testTargetPlugins.doTest(targetPluginName, targetPluginVersion, testCaseName, testSpecs);
}
