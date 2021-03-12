import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion } from './_build/DarkPlasma_MapNameOnSave_Test_parameters';

const TESTCASE_NAME = {
  MAP_NAME_IN_SAVEFILE_INFO: 'マップ名がセーブファイル情報に含まれる',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Game_Interpreter_doTest = Game_Interpreter.prototype.doTest;
Game_Interpreter.prototype.doTest = function () {
  _Game_Interpreter_doTest.call(this);
  const savefileInfo = DataManager.makeSavefileInfo();
  doTest(targetPluginVersion, TESTCASE_NAME.MAP_NAME_IN_SAVEFILE_INFO, [
    TestSpec.instance([TestResult.mustBeString], () => savefileInfo.mapName, 'マップ名'),
  ]);
};
