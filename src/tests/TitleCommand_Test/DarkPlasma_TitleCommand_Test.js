import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { settings, targetPluginVersion } from './_build/DarkPlasma_TitleCommand_Test_parameters';

const AUTO_TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(AUTO_TESTCASE_NAME));
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, AUTO_TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance([TestResult.mustBeArray], () => settings.additionalCommands, 'CG一覧'),
    TestSpec.id(() => settings.additionalCommands[0].commandType, 'コマンド種別'),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.additionalCommands[0].position, '追加位置'),
    TestSpec.instance([TestResult.mustBeString], () => settings.additionalCommands[0].text, 'テキスト'),
    TestSpec.instance([TestResult.mustBeString], () => settings.additionalCommands[0].symbol, 'シンボル'),
    TestSpec.instance([TestResult.mustBeString], () => settings.additionalCommands[0].scene, 'シーン名'),
  ];
}
