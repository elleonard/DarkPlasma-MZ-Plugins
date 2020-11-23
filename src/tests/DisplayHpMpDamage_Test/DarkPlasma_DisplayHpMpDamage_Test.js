import { settings, targetPluginVersion } from './_build/DarkPlasma_DisplayHpMpDamage_Test_parameters';
import { registerAutoTestCases, registerManualTestCases } from '../../common/registerTestCase';
import { doTest } from '../../common/doTest';

const TESTCASE_NAME = {
  BOTH_HP_AND_MP_DAMAGE: 'HP/MP両方ダメージの表示が適切',
  ONLY_HP_DAMAGE: 'HPのみダメージの表示が適切',
  ONLY_MP_DAMAGE: 'MPのみダメージの表示が適切',
  BOTH_HP_AND_MP_HEAL: 'HP/MP両方回復の表示が適切',
  ONLY_HP_HEAL: 'HPのみ回復の表示が適切',
  ONLY_MP_HEAL: 'MPのみ回復の表示が適切',
  HP_DAMAGE_MP_HEAL: 'HPダメージかつMP回復の表示が適切',
  HP_HEAL_MP_DAMAGE: 'HP回復かつMPダメージの表示が適切',
};

const AUTO_TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定値が正しくロードできる',
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
    TestSpec.instance([TestResult.mustBeInteger], () => settings.delay, '表示時間差'),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.offsetX, '横オフセット'),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.offsetY, '縦オフセット'),
  ];
}
