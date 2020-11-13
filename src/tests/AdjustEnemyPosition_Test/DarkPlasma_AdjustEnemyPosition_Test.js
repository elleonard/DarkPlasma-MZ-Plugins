import { targetPluginVersion } from './_build/DarkPlasma_AdjustEnemyPosition_Test_parameters';
import { registerManualTestCases } from '../../common/registerTestCase';

const TESTCASE_NAME = {
  SIZE_DEFAULT: 'デフォルトサイズで敵配置が正常',
  SIZE_1280_720: '1280x720で敵配置が正常',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerManualTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};
