import { doTest } from '../../common/doTest';
import { registerAutoTestCases, registerManualTestCases } from '../../common/registerTestCase';
import { settings, targetPluginVersion } from './_build/DarkPlasma_CGGallery_Test_parameters';

const TESTCASE_NAME = {
  DISPLAY_BACKGROUND_IMAGE: 'シーンの背景画像が表示できる',
  DISPLAY_CG_NAME: 'CGの名前が表示できる',
  HIDE_SECRET_CG_NAME: '閲覧条件を満たさないCGの名前が隠される',
  DISPLAY_CG: 'CGを表示できる',
  BACK_FROM_CG: 'CGを非表示にして一覧に戻ることができる',
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
    TestSpec.instance([TestResult.mustBeArray], () => settings.cgs, 'CG一覧'),
    TestSpec.instance([TestResult.mustBeString], () => settings.cgs[0].file, 'ファイル名'),
    TestSpec.id(() => settings.cgs[0].switchId, 'スイッチ'),
    TestSpec.instance([TestResult.mustBeString], () => settings.cgs[0].title, 'タイトル'),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.selectWindowWidth,
      'ウィンドウ幅'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.selectWindowHeight,
      'ウィンドウ幅'
    ),
    TestSpec.instance([TestResult.mustBeString], () => settings.secretTitle, '未開放タイトル'),
    TestSpec.instance([TestResult.mustBeString], () => settings.backgroundImage, '背景画像'),
  ];
}
