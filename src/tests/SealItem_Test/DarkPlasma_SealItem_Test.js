import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { testSettings, targetPluginVersion } from './_build/DarkPlasma_SealItem_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_META: 'メタデータが正しくロードできている',
  SEAL_ITEM_ACTOR: 'アクターによるアイテム使用禁止',
  SEAL_ITEM_CLASS: '職業によるアイテム使用禁止',
  SEAL_ITEM_EQUIP: '装備によるアイテム使用禁止',
  SEAL_ITEM_STATE: 'ステートによるアイテム使用禁止',
  SEAL_HEAL_ITEM: '回復アイテム使用禁止',
  SEAL_RESURRECTION_ITEM: '蘇生アイテム使用禁止',
  UNSEALED: '封印されていない場合使用可能',
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
  $gameParty.members().forEach((actor) => {
    if (actor.actorId() === testSettings.sealItemActor) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_ACTOR, [
        createUnusableSpec(actor, TESTCASE_NAME.SEAL_ITEM_ACTOR),
      ]);
    }
    if (actor.isClass($dataClasses[testSettings.sealItemClass])) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_CLASS, [
        createUnusableSpec(actor, TESTCASE_NAME.SEAL_ITEM_CLASS),
      ]);
    }
    if (actor.isEquipped($dataArmors[testSettings.sealItemArmor])) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_EQUIP, [
        createUnusableSpec(actor, TESTCASE_NAME.SEAL_ITEM_EQUIP),
      ]);
    }
    if (actor.isStateAffected(testSettings.sealItemState)) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_STATE, [
        createUnusableSpec(actor, TESTCASE_NAME.SEAL_ITEM_STATE),
      ]);
    }
    if (
      actor.actorId() !== testSettings.sealItemActor &&
      !actor.isClass($dataClasses[testSettings.sealItemClass]) &&
      !actor.isEquipped($dataArmors[testSettings.sealItemArmor]) &&
      !actor.isStateAffected(testSettings.sealItemState)
    ) {
      doTest(targetPluginVersion, TESTCASE_NAME.UNSEALED, [
        TestSpec.instance(
          [TestResult.mustBeTrue],
          () => actor.canUse($dataItems[testSettings.sealTargetItem]),
          '使用可能'
        ),
      ]);
    }
    if (actor.isEquipped($dataArmors[testSettings.sealHealItemArmor])) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_HEAL_ITEM, createHealItemSpecs(actor));
    }
    if (actor.isEquipped($dataArmors[testSettings.sealResurrectionItemArmor])) {
      doTest(targetPluginVersion, TESTCASE_NAME.SEAL_RESURRECTION_ITEM, createResurrectionItemSpecs(actor));
    }
  });
};

/**
 * @param {Game_Actor} actor アクター
 * @return {TestSpec[]}
 */
function createResurrectionItemSpecs(actor) {
  return $gameParty
    .items()
    .filter((item) => DataManager.isResurrectionItem(item))
    .map((item) => {
      return TestSpec.instance([TestResult.mustBeFalse], () => actor.canUse(item), '蘇生アイテム');
    });
}

/**
 * @param {Game_Actor} actor アクター
 * @return {TestSpec[]}
 */
function createHealItemSpecs(actor) {
  return $gameParty
    .items()
    .filter((item) => DataManager.isHealItem(item))
    .map((item) => {
      return TestSpec.instance([TestResult.mustBeFalse], () => actor.canUse(item), '回復アイテム');
    });
}

/**
 * @param {Game_Actor} actor アクター
 * @param {string} type テスト種別
 * @return {TestSpec}
 */
function createUnusableSpec(actor, type) {
  return TestSpec.instance([TestResult.mustBeFalse], () => actor.canUse($dataItems[testSettings.sealTargetItem], type));
}

function メタデータが正しくロードできている() {
  const sealItemActor = $dataActors[testSettings.sealItemActor];
  const sealItemClass = $dataClasses[testSettings.sealItemClass];
  const sealItemArmor = $dataArmors[testSettings.sealItemArmor];
  const sealItemState = $dataStates[testSettings.sealItemState];
  const sealHealItemArmor = $dataArmors[testSettings.sealHealItemArmor];
  const sealResurrectionItemArmor = $dataArmors[testSettings.sealResurrectionItemArmor];
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => DataManager.sealItems(sealItemActor).includes(testSettings.sealTargetItem),
      'アクター'
    ),
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => DataManager.sealItems(sealItemClass).includes(testSettings.sealTargetItem),
      '職業'
    ),
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => DataManager.sealItems(sealItemArmor).includes(testSettings.sealTargetItem),
      '装備'
    ),
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => DataManager.sealItems(sealItemState).includes(testSettings.sealTargetItem),
      'ステート'
    ),
    TestSpec.instance([TestResult.mustBeTrue], () => sealHealItemArmor.meta.sealHealItem, '回復アイテム封印'),
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => sealResurrectionItemArmor.meta.sealResurrectionItem,
      '蘇生アイテム封印'
    ),
  ];
}
