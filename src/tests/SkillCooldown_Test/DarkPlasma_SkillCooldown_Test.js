import { settings } from './_build/DarkPlasma_SkillCooldown_Test_parameters';
import { targetPluginVersion } from './_build/DarkPlasma_SkillCooldown_Test_parameters';
import { doTest } from '../../common/doTest';
import { registerTestCase } from '../../common/registerTestCase';

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定値が正しくロードできている',
  CAN_DISPLAY_TURN_COUNT: 'クールダウンターン数が表示される',
  NO_COOLDOWN_ON_BATTLE_START_PARTY: '戦闘開始直後はクールダウンなし_味方',
  NO_COOLDOWN_ON_BATTLE_START_TROOP: '戦闘開始直後はクールダウンなし_敵',
  START_COOLDOWN: 'ターゲットスキルのクールダウン開始',
  DECREASE_COOLDOWN_TURN: 'クールダウンカウントを進める',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.CAN_DISPLAY_TURN_COUNT, false);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.NO_COOLDOWN_ON_BATTLE_START_PARTY, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.NO_COOLDOWN_ON_BATTLE_START_TROOP, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.START_COOLDOWN, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.DECREASE_COOLDOWN_TURN, true);
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

/**
 * @return {TestSpec[]}
 */
function 設定値が正しくロードできている() {
  return [
    TestSpec.instance(
      [TestResult.mustBeArray, TestResult.mustBeWithAtLeastOneElement],
      () => settings.skillCooldownSettings,
      'スキルクールダウン設定'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.skillCooldownSettings[0].triggerSkillId,
      'トリガースキルID'
    ),
    TestSpec.instance(
      [TestResult.mustBeArray, TestResult.mustBeWithAtLeastOneElement],
      () => settings.skillCooldownSettings[0].targetSkills,
      'ターゲットスキル一覧'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.skillCooldownSettings[0].targetSkills[0].targetSkillId,
      'ターゲットスキルID'
    ),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.skillCooldownSettings[0].targetSkills[0].cooldownTurnCount,
      'クールダウンターン数'
    ),
    TestSpec.instance([TestResult.mustBeBoolean], () => settings.displayCooldownTurn, 'クールダウンターン数表示ON/OFF'),
    TestSpec.instance([TestResult.mustBeString], () => settings.cooldownFormat, 'クールダウン表示フォーマット'),
    TestSpec.instance(
      [TestResult.mustBeInteger, TestResult.mustBeGreaterThanZero],
      () => settings.cooldownTextColor,
      'クールダウン表示色'
    ),
    TestSpec.instance([TestResult.mustBeBoolean], () => settings.decreaseBenchwarmersCooldown, '後衛クールダウン経過'),
  ];
}

/**
 * クールダウンの対象スキルID一覧
 * @return {number[]}
 */
function cooldownTargetSkillIds() {
  return settings.skillCooldownSettings
    .map((setting) => setting.targetSkills.map((skill) => skill.targetSkillId))
    .flat();
}

const _BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function () {
  _BattleManager_startBattle.call(this);
  const targetSkillIds = cooldownTargetSkillIds();
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.NO_COOLDOWN_ON_BATTLE_START_PARTY,
    戦闘開始直後は誰もクールダウンなし($gameParty.allMembers(), targetSkillIds)
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.NO_COOLDOWN_ON_BATTLE_START_TROOP,
    戦闘開始直後は誰もクールダウンなし($gameTroop.members(), targetSkillIds)
  );
};

function 戦闘開始直後は誰もクールダウンなし(targetBattlers, targetSkillIds) {
  return targetBattlers
    .map((battler) => {
      return targetSkillIds.map((skillId) => {
        return TestSpec.instance(
          [TestResult.mustBeFalse],
          () => battler.isDuringCooldown($dataSkills[skillId]),
          'スキルクールダウン状態'
        );
      });
    })
    .flat();
}

const _Game_Battler_useItem = Game_Battler.prototype.useItem;
Game_Battler.prototype.useItem = function (item) {
  _Game_Battler_useItem.call(this, item);
  if (DataManager.isSkill(item) && $gameParty.inBattle()) {
    const targetSkills = settings.skillCooldownSettings
      .filter((setting) => setting.triggerSkillId === item.id)
      .map((setting) => setting.targetSkills)
      .flat();
    targetSkills.forEach((targetSkill) => {
      doTest(
        targetPluginVersion,
        TESTCASE_NAME.START_COOLDOWN,
        ターゲットスキルのクールダウン開始(this, targetSkill.targetSkillId, targetSkill.cooldownTurnCount + 1)
      );
    });
  }
};

function ターゲットスキルのクールダウン開始(targetBattler, targetSkillId, expected) {
  return [
    TestSpec.instance(
      [TestResult.mustBeValue],
      () => targetBattler.cooldownTurn($dataSkills[targetSkillId]),
      'スキルクールダウンターン数',
      expected
    ),
  ];
}

const _BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function () {
  const targetSkillIds = cooldownTargetSkillIds();
  const testTargets = $gameParty
    .battleMembers()
    .concat($gameTroop.members())
    .filter((battler) => targetSkillIds.some((skillId) => battler.isDuringCooldown($dataSkills[skillId])))
    .map((battler) => {
      const battlersSkillIds = targetSkillIds.filter((skillId) => battler.isDuringCooldown($dataSkills[skillId]));

      return battlersSkillIds.map((skillId) => {
        return {
          battler: battler,
          skillId: skillId,
          expected: battler.cooldownTurn($dataSkills[skillId]) - 1,
        };
      });
    })
    .flat();
  _BattleManager_endTurn.call(this);
  testTargets.forEach((target) => {
    doTest(
      targetPluginVersion,
      TESTCASE_NAME.DECREASE_COOLDOWN_TURN,
      ターン終了時にクールダウンカウントを進める(target.battler, target.skillId, target.expected)
    );
  });
};

function ターン終了時にクールダウンカウントを進める(targetBattler, targetSkillId, expected) {
  return [
    TestSpec.instance(
      [TestResult.mustBeValue],
      () => targetBattler.cooldownTurn($dataSkills[targetSkillId]),
      'スキルクールダウンターン数',
      expected
    ),
  ];
}
