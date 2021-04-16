import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion } from './_build/DarkPlasma_SeverImmortality_Test_parameters';

const TESTCASE_NAME = {
  CAN_REVIVE_BY_HEAL_SKILL: 'HP回復スキル効果で復活できる',
  CAN_REVIVE_BY_REMOVE_STATE_SKILL: 'ステート解除スキル効果で復活できる',
  CAN_REVIVE_BY_REMOVE_STATE_COMMAND: 'ステート変更イベントコマンドで復活できる',
  CAN_REVIVE_BY_RECOVER_ALL_COMMAND: '全回復イベントコマンドで復活できる',
  CANNOT_REVIVE_BY_HEAL_SKILL: 'HP回復スキル効果で復活できない',
  CANNOT_REVIVE_BY_REMOVE_STATE_SKILL: 'ステート解除スキル効果で復活できない',
  CANNOT_REVIVE_BY_REMOVE_STATE_COMMAND: 'ステート変更イベントコマンドで復活できない',
  CANNOT_REVIVE_BY_RECOVER_ALL_COMMAND: '全回復イベントコマンドで復活できない',
};

/**
 * 戦闘不能を解除する効果を持つアイテムか
 * @param {MZ.Item} item アイテムデータ
 * @return {boolean}
 */
DataManager.isResurrectionItem = function (item) {
  return item.effects.some(
    (effect) =>
      effect.code === Game_Action.EFFECT_REMOVE_STATE && effect.dataId === Game_BattlerBase.prototype.deathStateId()
  );
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
  const isDeadTarget = target.isDead();
  _Game_Action_apply.call(this, target);
  if (isDeadTarget) {
    if (this.item().damage.type === 3) {
      if (target.cannotRevive()) {
        doTest(targetPluginVersion, TESTCASE_NAME.CANNOT_REVIVE_BY_HEAL_SKILL, [
          TestSpec.instance([TestResult.mustBeTrue], () => target.isDead(), '戦闘不能'),
        ]);
      } else {
        doTest(targetPluginVersion, TESTCASE_NAME.CAN_REVIVE_BY_HEAL_SKILL, [
          TestSpec.instance([TestResult.mustBeTrue], () => target.isAlive(), '生存'),
        ]);
      }
    } else if (DataManager.isResurrectionItem(this.item())) {
      if (target.cannotRevive()) {
        doTest(targetPluginVersion, TESTCASE_NAME.CANNOT_REVIVE_BY_REMOVE_STATE_SKILL, [
          TestSpec.instance([TestResult.mustBeTrue], () => target.isDead(), '戦闘不能'),
        ]);
      } else {
        doTest(targetPluginVersion, TESTCASE_NAME.CAN_REVIVE_BY_REMOVE_STATE_SKILL, [
          TestSpec.instance([TestResult.mustBeTrue], () => target.isAlive(), '生存'),
        ]);
      }
    }
  }
};

const _Game_Interpreter_command333 = Game_Interpreter.prototype.command333;
Game_Interpreter.prototype.command333 = function (params) {
  const deadTarget = params[0] < 0 ? $gameTroop.members().find((enemy) => enemy.isDead()) : null;
  const result = _Game_Interpreter_command333.call(this, params);
  if (deadTarget && params[1] !== 0 && params[2] === deadTarget.deathStateId()) {
    if (deadTarget.cannotRevive()) {
      doTest(targetPluginVersion, TESTCASE_NAME.CANNOT_REVIVE_BY_REMOVE_STATE_COMMAND, [
        TestSpec.instance([TestResult.mustBeTrue], () => deadTarget.isDead(), '戦闘不能'),
      ]);
    } else {
      doTest(targetPluginVersion, TESTCASE_NAME.CAN_REVIVE_BY_REMOVE_STATE_COMMAND, [
        TestSpec.instance([TestResult.mustBeTrue], () => deadTarget.isAlive(), '生存'),
      ]);
    }
  }
  return result;
};

const _Game_Interpreter_command334 = Game_Interpreter.prototype.command334;
Game_Interpreter.prototype.command334 = function (params) {
  const deadTarget = params[0] < 0 ? $gameTroop.members().find((enemy) => enemy.isDead()) : null;
  const result = _Game_Interpreter_command334.call(this, params);
  if (deadTarget) {
    if (deadTarget.cannotRevive()) {
      doTest(targetPluginVersion, TESTCASE_NAME.CANNOT_REVIVE_BY_RECOVER_ALL_COMMAND, [
        TestSpec.instance([TestResult.mustBeTrue], () => deadTarget.isDead(), '戦闘不能'),
      ]);
    } else {
      doTest(targetPluginVersion, TESTCASE_NAME.CAN_REVIVE_BY_RECOVER_ALL_COMMAND, [
        TestSpec.instance([TestResult.mustBeTrue], () => deadTarget.isAlive(), '生存'),
      ]);
    }
  }
  return result;
};
