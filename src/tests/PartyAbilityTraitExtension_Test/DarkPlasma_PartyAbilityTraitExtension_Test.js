import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion, testSettings } from './_build/DarkPlasma_PartyAbilityTraitExtension_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_META: 'メタデータが正しくロードできている',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Game_Interpreter_doTest = Game_Interpreter.prototype.doTest;
Game_Interpreter.prototype.doTest = function () {
  _Game_Interpreter_doTest.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_META, メタデータが正しくロードできている());
};

function メタデータが正しくロードできている() {
  const addAtkArmor = $dataArmors[testSettings.addArmor];
  const multiFdrArmor = $dataArmors[testSettings.multiArmor];
  return [
    TestSpec.instance([TestResult.mustBeInteger], () => partyAbilityTraitAdd(addAtkArmor, 'atk'), 'ATK加算'),
    TestSpec.instance([TestResult.mustBeInteger], () => partyAbilityTraitMulti(multiFdrArmor), 'fdr', '床ダメージ乗算'),
  ];
}

/**
 * 対象に設定された、加算方式のパーティ能力値を取得する
 * @param {MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State} object 対象
 * @param {string} key キー
 * @return {number}
 */
function partyAbilityTraitAdd(object, key) {
  const match = new RegExp(`${key}:([0-9]+)`).exec(object.meta.partyAbility);
  return match && match.length > 1 ? Number(match[1]) : 0;
}

/**
 * 対象に設定された、乗算方式のパーティ能力値を取得する
 * @param {MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State} object 対象
 * @param {string} key キー
 * @return {number}
 */
function partyAbilityTraitMulti(object, key) {
  const match = new RegExp(`${key}:([0-9]+)`).exec(object.meta.partyAbility);
  return match && match.length > 1 ? Number(match[1]) : 1;
}
