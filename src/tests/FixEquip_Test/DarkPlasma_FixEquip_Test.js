import { doTest } from '../../common/doTest';
import { registerAutoTestCases, registerManualTestCases } from '../../common/registerTestCase';
import { settings, targetPluginVersion } from './_build/DarkPlasma_FixEquip_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定値が正しくロードできている',
};

const MANUAL_TESTCASE = {
  FIX_EQUIP: 'ONで指定タイプの装備が変更できない',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
  registerManualTestCases(targetPluginVersion, Object.values(MANUAL_TESTCASE));
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.arrayWithElement(() => settings.fixEquips, '固定装備設定'),
    TestSpec.id(() => settings.fixEquips[0].switchId, 'スイッチID'),
    TestSpec.arrayWithElement(() => settings.fixEquips[0].equipTypes, '装備タイプ一覧'),
    TestSpec.id(() => settings.fixEquips[0].equipTypes[0], '装備タイプID'),
  ];
}
