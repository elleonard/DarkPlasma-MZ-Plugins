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

/**
 * 自動テストケースを登録する
 * @param {string} targetPluginVersion 対象プラグインのバージョン
 * @param {string[]} testCaseNames テストケース名一覧
 */
export function registerAutoTestCases(targetPluginVersion, testCaseNames) {
  testCaseNames.forEach((testCaseName) => {
    registerTestCase(targetPluginVersion, testCaseName, true);
  });
}

export function registerManualTestCases(targetPluginVersion, testCaseNames) {
  testCaseNames.forEach((testCaseName) => {
    registerTestCase(targetPluginVersion, testCaseName, false);
  });
}
