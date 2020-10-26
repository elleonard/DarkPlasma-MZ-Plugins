import { settings } from './_build/DarkPlasma_ExpandTargetScope_Test_parameters';
import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';
import { targetPluginVersion } from '../DisableRegenerateOnMap_Test/_build/DarkPlasma_DisableRegenerateOnMap_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定値が正しくロードできている',
  CAN_BE_WIDEN: '全体化ボタンで全体化できる',
  CAN_BE_NARROW: '全体化ボタンで単体に絞れる',
  CAN_NOT_CHANGE_SCOPE: '全体化不可スキルは対象を変えられない',
  WIDEN_ANIMATION: '全体化時のアニメーション変化が有効',
};

/**
 * 全体化/単体化 => processHandlingの中だが、複雑になるのでメソッドを分けた上でテスト。
 * ダメージ倍率 => makeDamageValueの中だが、これもメソッドを分ける。_enableForAllRateを見る
 */
const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_BE_WIDEN, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_BE_NARROW, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_NOT_CHANGE_SCOPE, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.WIDEN_ANIMATION, false);
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance([TestResult.mustBeString], () => settings.switchScopeButton, '全体化ボタン'),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.damageRateForAll, '全体化ダメージ倍率'),
    TestSpec.instance([TestResult.mustBeInteger], () => settings.mpCostRateForAll, '全体化消費MP倍率'),
  ];
}
