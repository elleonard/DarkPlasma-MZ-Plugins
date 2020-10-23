import { settings } from './_build/DarkPlasma_PositionDamageRate_Test_parameters';
import { targetPluginVersion } from './_build/DarkPlasma_PositionDamageRate_Test_parameters';
import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, true);
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance([TestResult.mustBeArray], () => settings.physicalDamageRates, '物理ダメージ倍率'),
    TestSpec.instance([TestResult.mustBeArray], () => settings.magicalDamageRates, '魔法ダメージ倍率'),
  ];
}
