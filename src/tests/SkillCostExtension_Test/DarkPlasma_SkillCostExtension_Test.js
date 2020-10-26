import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';
import { targetPluginVersion } from './_build/DarkPlasma_SkillCostExtension_Test_parameters';

const TESTCASE_NAME = {
  CAN_LOAD_META: 'メタデータが正しくロードできている',
  VALID_SKILL_COST_HP: 'HPスキルコストが正しい',
  VALID_SKILL_COST_MP: 'MPスキルコストが正しい',
  VALID_SKILL_COST_GOLD: 'お金スキルコストが正しい',
  VALID_SKILL_COST_ITEM: 'アイテムスキルコストが正しい',
  VALID_SKILL_COST_VARIABLE: '変数スキルコストが正しい',
  WITH_MP_COST_RATE: 'MP消費率と合わせたときのMPコストが正しい',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_META, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.VALID_SKILL_COST_HP, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.VALID_SKILL_COST_MP, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.VALID_SKILL_COST_GOLD, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.VALID_SKILL_COST_ITEM, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.VALID_SKILL_COST_VARIABLE, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.WITH_MP_COST_RATE, true);
};

const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
Scene_Boot.prototype.onDatabaseLoaded = function () {
  _Scene_Boot_onDatabaseLoaded.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_META, メタデータが正しくロードできている());
};

function メタデータが正しくロードできている() {
  const skillsWithAdditionalCost = $dataSkills.filter((skill) => skill && skill.additionalCost);
  const itemCostSkill = skillsWithAdditionalCost.find((skill) => skill.additionalCost.items);
  const variableCostSkill = skillsWithAdditionalCost.find((skill) => skill.additionalCost.variables);
  return [
    createCostValueSpec(
      () => skillsWithAdditionalCost.find((skill) => skill.additionalCost.hp).additionalCost.hp,
      '追加HPコスト'
    ),
    createCostValueSpec(
      () => skillsWithAdditionalCost.find((skill) => skill.additionalCost.hpRate).additionalCost.hpRate,
      '追加HP割合コスト'
    ),
    createCostValueSpec(
      () => skillsWithAdditionalCost.find((skill) => skill.additionalCost.mpRate).additionalCost.mpRate,
      '追加MP割合コスト'
    ),
    createCostValueSpec(
      () => skillsWithAdditionalCost.find((skill) => skill.additionalCost.gold).additionalCost.gold,
      '追加お金コスト'
    ),
    TestSpec.arrayWithElement(() => itemCostSkill.additionalCost.items, '追加アイテムコスト'),
    TestSpec.id(() => itemCostSkill.additionalCost.items[0].id, '追加コスト_アイテムID'),
    createCostValueSpec(() => itemCostSkill.additionalCost.items[0].num, '追加コスト_アイテム数'),
    TestSpec.arrayWithElement(() => variableCostSkill.additionalCost.variables, '追加変数コスト'),
    TestSpec.id(() => variableCostSkill.additionalCost.variables[0].id, '追加コスト_変数ID'),
    createCostValueSpec(() => variableCostSkill.additionalCost.variables[0].num, '追加コスト_変数量'),
  ];
}

function createCostValueSpec(getValue, targetName) {
  return TestSpec.instance([TestResult.mustBeInteger], getValue, targetName);
}

const _Game_Interpreter_doTest = Game_Interpreter.prototype.doTest;
Game_Interpreter.prototype.doTest = function () {
  _Game_Interpreter_doTest.call(this);
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.VALID_SKILL_COST_HP,
    $gameParty
      .members()
      .map((actor) => {
        return actor
          .skills()
          .filter((skill) => !!skill.additionalCost.hp || !!skill.additionalCost.hpRate)
          .map((skill) => createCostValueSpec(() => actor.skillHpCost(skill), 'HPコスト'));
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.VALID_SKILL_COST_MP,
    $gameParty
      .members()
      .map((actor) => {
        return actor
          .skills()
          .filter((skill) => !!skill.additionalCost.mpRate)
          .map((skill) => createCostValueSpec(() => actor.skillMpCost(skill), 'MPコスト'));
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.VALID_SKILL_COST_GOLD,
    $gameParty
      .members()
      .map((actor) => {
        return actor
          .skills()
          .filter((skill) => !!skill.additionalCost.gold)
          .map((skill) => createCostValueSpec(() => actor.skillGoldCost(skill), 'お金コスト'));
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.VALID_SKILL_COST_ITEM,
    $gameParty
      .members()
      .map((actor) => {
        return actor
          .skills()
          .filter((skill) => skill.additionalCost.items)
          .map((skill) => TestSpec.arrayWithElement(() => actor.skillItemCosts(skill), 'アイテムコスト'));
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.VALID_SKILL_COST_VARIABLE,
    $gameParty
      .members()
      .map((actor) => {
        return actor
          .skills()
          .filter((skill) => skill.additionalCost.variables)
          .map((skill) => TestSpec.arrayWithElement(() => actor.skillVariableCosts(skill), '変数コスト'));
      })
      .flat()
  );
  const actorWithMcr = $gameParty.members().find((actor) => actor.mcr !== 1);
  if (actorWithMcr) {
    const mpRateSkill = actorWithMcr.skills().find((skill) => skill.additionalCost.mpRate);
    if (mpRateSkill) {
      doTest(
        targetPluginVersion,
        TESTCASE_NAME.WITH_MP_COST_RATE,
        MP消費率と合わせたときのMPコストが正しい(actorWithMcr, mpRateSkill)
      );
    }
  }
};

function MP消費率と合わせたときのMPコストが正しい(actor, skill) {
  return [
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeValue],
      () => actor.skillMpCost(skill),
      '消費MP',
      Math.floor(skill.mpCost * actor.mcr) + Math.floor(((skill.additionalCost.mpRate * actor.mmp) / 100) * actor.mcr)
    ),
  ];
}
