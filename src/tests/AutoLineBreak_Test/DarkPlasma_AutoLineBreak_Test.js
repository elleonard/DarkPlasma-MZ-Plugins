import { targetPluginVersion } from './_build/DarkPlasma_AutoLineBreak_Test_parameters';
import { registerAutoTestCases, registerManualTestCases } from '../../common/registerTestCase';
import { settings } from './_build/DarkPlasma_AutoLineBreak_Test_parameters';
import { doTest } from '../../common/doTest';

const TESTCASE_NAME = {
  AUTO_LINE_BREAK_MESSSAGE: 'メッセージウィンドウの端で自動改行される',
  AUTO_LINE_BREAK_BATTLE_LOG: 'バトルログウィンドウの端で自動改行される',
  AUTO_LINE_BREAK_OTHER: 'その他ウィンドウの端で自動改行される',
  PROHIBIT_LINE_BREAK_BEFORE: '行末禁則文字が行末に来ない',
  PROHIBIT_LINE_BREAK_AFTER: '行頭禁則文字が行頭に来ない',
};

const AUTO_TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerManualTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
  registerAutoTestCases(targetPluginVersion, Object.values(AUTO_TESTCASE_NAME));
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, AUTO_TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance([TestResult.mustBeString], () => settings.prohibitLineBreakBefore, '行末禁則文字'),
    TestSpec.instance([TestResult.mustBeString], () => settings.prohibitLineBreakAfter, '行頭禁則文字'),
    TestSpec.instance(
      [TestResult.mustBeArray],
      () => settings.ignoreAutoLineBreakWindows,
      '自動折返し禁止ウィンドウリスト'
    ),
    TestSpec.instance([TestResult.mustBeNumber], () => settings.lineWidthMargin, '行幅のマージン'),
  ];
}
