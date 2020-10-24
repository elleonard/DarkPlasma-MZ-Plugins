import { settings } from './_build/DarkPlasma_PositionDamageRate_Test_parameters';
import { targetPluginVersion } from './_build/DarkPlasma_PositionDamageRate_Test_parameters';
import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
  CALC_PHYSICAL_DAMAGE_RATE: '物理ダメージ倍率が正しく計算できている',
  CALC_MAGICAL_DAMAGE_RATE: '魔法ダメージ倍率が正しく計算できている',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CALC_PHYSICAL_DAMAGE_RATE, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CALC_MAGICAL_DAMAGE_RATE, true);
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

const _Game_Interpreter_doTest = Game_Interpreter.prototype.doTest;
Game_Interpreter.prototype.doTest = function () {
  _Game_Interpreter_doTest.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CALC_PHYSICAL_DAMAGE_RATE, 物理ダメージ倍率が正しく計算できている());
  doTest(targetPluginVersion, TESTCASE_NAME.CALC_MAGICAL_DAMAGE_RATE, 魔法ダメージ倍率が正しく計算できている());
};

function 物理ダメージ倍率が正しく計算できている() {
  return $gameParty.members().map((actor) => {
    return TestSpec.instance([TestResult.mustBeNumber], () => actor.pdr, '物理ダメージ倍率');
  });
}

function 魔法ダメージ倍率が正しく計算できている() {
  return $gameParty.members().map((actor) => {
    return TestSpec.instance([TestResult.mustBeNumber], () => actor.mdr, '魔法ダメージ倍率');
  });
}
