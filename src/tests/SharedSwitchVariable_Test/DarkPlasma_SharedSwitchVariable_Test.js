import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { settings, targetPluginVersion, testSettings } from './_build/DarkPlasma_SharedSwitchVariable_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
  NEW_GAME_SHARED_SWITCH: 'ニューゲーム開始時に共有スイッチをロードできる',
  LOAD_GAME_SHARED_SWITCH: 'ロード時に共有スイッチをロードできる',
};

let isNewGame = false;

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

const _DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
  _DataManager_setupNewGame.call(this);
  isNewGame = true;
};

const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
  _Scene_Map_onMapLoaded.call(this);
  if (isNewGame) {
    doTest(targetPluginVersion, TESTCASE_NAME.NEW_GAME_SHARED_SWITCH, [
      TestSpec.instance([TestResult.mustBeTrue], () => $gameSwitches.value(testSettings.switchId), '共有スイッチ'),
    ]);
    isNewGame = false;
  }
};

const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function () {
  _Game_System_onAfterLoad.call(this);
  isNewGame = false;
  doTest(targetPluginVersion, TESTCASE_NAME.LOAD_GAME_SHARED_SWITCH, [
    TestSpec.instance([TestResult.mustBeTrue], () => $gameSwitches.value(testSettings.switchId), '共有スイッチ'),
  ]);
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance([TestResult.mustBeArray], () => settings.switchRangeList, 'スイッチ範囲リスト'),
    TestSpec.instance([TestResult.mustBeArray], () => settings.variableRangeList, '変数範囲リスト'),
  ];
}
