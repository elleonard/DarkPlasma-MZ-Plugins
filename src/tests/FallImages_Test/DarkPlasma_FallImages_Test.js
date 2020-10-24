import { settings } from './_build/DarkPlasma_FallImages_Test_parameters';
import { targetPluginVersion } from './_build/DarkPlasma_FallImages_Test_parameters';
import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定値が正しくロードできている',
  START_FALLING: '降らせることができる',
  STOP_FALLING: '止めることができる',
  FADE_OUT_FALLING: 'フェードアウトできる',
};
const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.START_FALLING, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.STOP_FALLING, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.FADE_OUT_FALLING, false);
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance(
      [TestResult.mustBeArray, TestResult.mustBeWithAtLeastOneElement],
      () => settings.images,
      '降らせる画像設定'
    ),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.images[0].id, '画像設定ID'),
    TestSpec.instance([TestResult.mustBeString], () => settings.images[0].file, '画像ファイル'),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].rows,
      '画像の行数'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].cols,
      '画像の列数'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].waveringFrequency,
      '揺れ頻度'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].minimumLifeTime,
      '最短表示時間'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].lifeTimeRange,
      '表示時間の範囲'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].animationSpeed,
      'アニメーション速度'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].moveSpeedX,
      '横方向の移動速度'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.images[0].moveSpeedY,
      '縦方向の移動速度'
    ),
  ];
}
