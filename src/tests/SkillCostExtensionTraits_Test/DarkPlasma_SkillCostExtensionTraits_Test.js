import { doTest } from '../../common/doTest';
import { pluginName } from '../../common/pluginName';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion, testSettings } from './_build/DarkPlasma_SkillCostExtensionTraits_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_META: 'メタデータが正しくロードできている',
  HP_COST_RATE_THREE: 'HP消費率が3倍の装備',
  HP_COST_RATE_HALF: 'HP消費率が0.5倍の装備',
  HP_COST_RATE_ONE_HALF: 'HP消費率が3倍と0.5倍の装備',
  HP_COST_RATE_ZERO: 'HP消費率が0倍の装備',
  HP_COST_RATE_ONE: 'HP消費率変更装備なし',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
Scene_Boot.prototype.onDatabaseLoaded = function () {
  _Scene_Boot_onDatabaseLoaded.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_META, メタデータが正しくロードできている());
};

PluginManager.registerCommand(pluginName, 'HP消費率テスト', function (args) {
  $gameParty.members().forEach((actor) => {
    if (actor.hasArmor($dataArmors[testSettings.hpCostRateZero])) {
      doTest(targetPluginVersion, TESTCASE_NAME.HP_COST_RATE_ZERO, [createCostRateSpec(actor, 0)]);
    } else if (actor.hasArmor($dataArmors[testSettings.hpCostRateThree])) {
      if (actor.hasArmor($dataArmors[testSettings.hpCostRateHalf])) {
        doTest(targetPluginVersion, TESTCASE_NAME.HP_COST_RATE_ONE_HALF, [createCostRateSpec(actor, 1.5)]);
      } else {
        doTest(targetPluginVersion, TESTCASE_NAME.HP_COST_RATE_THREE, [createCostRateSpec(actor, 3)]);
      }
    } else {
      if (actor.hasArmor($dataArmors[testSettings.hpCostRateHalf])) {
        doTest(targetPluginVersion, TESTCASE_NAME.HP_COST_RATE_HALF, [createCostRateSpec(actor, 0.5)]);
      } else {
        doTest(targetPluginVersion, TESTCASE_NAME.HP_COST_RATE_ONE, [createCostRateSpec(actor, 1)]);
      }
    }
  });
});

function createCostRateSpec(actor, value) {
  return TestSpec.instance([TestResult.mustBeValue], () => actor.hpCostRate(), 'HP消費率', value);
}

function メタデータが正しくロードできている() {
  const hpCostRateZeroArmor = $dataArmors[testSettings.hpCostRateZero];
  const hpCostRateThreeArmor = $dataArmors[testSettings.hpCostRateThree];
  const hpCostRateHalfArmor = $dataArmors[testSettings.hpCostRateHalf];
  return [
    TestSpec.instance([TestResult.mustBeValue], () => Number(hpCostRateZeroArmor.meta.hpCostRate), 'HP消費率', 0),
    TestSpec.instance([TestResult.mustBeValue], () => Number(hpCostRateThreeArmor.meta.hpCostRate), 'HP消費率', 3),
    TestSpec.instance([TestResult.mustBeValue], () => Number(hpCostRateHalfArmor.meta.hpCostRate), 'HP消費率', 0.5),
  ];
}
