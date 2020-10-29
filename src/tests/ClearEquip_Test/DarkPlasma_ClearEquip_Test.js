import { targetPluginVersion, settings } from './_build/DarkPlasma_ClearEquip_Test_parameters';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { doTest } from '../../common/doTest';
import { targetPluginName } from '../../common/targetPluginName';

const PLUGIN_COMMAND_NAME = {
  CLEAR_EQUIP: 'clearEquip',
  CLEAR_ALL_MEMBER_EQUIP: 'clearAllMemberEquip',
  CLEAR_ALL_EQUIP: 'clearAllEquip',
  CLEAR_ALL_MEMBER_ALL_EQUIP: 'clearAllMemberAllEquip',
};

const TESTCASE_NAME = {
  CAN_LOAD_SETTING: '設定が正しくロードできている',
  CLEAR_EQUIP_WHEN_MEMBER_IS_OUT: 'パーティ脱退時、装備がはずれる',
  DONT_CLEAR_FIXED_EQUIP_BY_OUT: 'パーティ脱退時、固定装備がはずれない',
  CLEAR_EQUIP_BY_COMMAND: 'コマンドで指定装備タイプがはずれる',
  DONT_CLEAR_FIXED_EQUIP_BY_COMMAND: 'コマンドで固定装備がはずれない',
  CLEAR_ALL_EQUIP_BY_COMMAND: 'コマンドで装備がすべてはずれる',
  DONT_CLEAR_FIXED_EQUIP_BY_ALL_COMMAND: '全はずし時、固定装備がはずれない',
  CLEAR_EQUIP_ALL_MEMBER_BY_COMMAND: 'コマンドで全員の指定装備タイプがはずれる',
  DONT_CLEAR_FIXED_EQUIP_BY_ALL_MEMBER_COMMAND: '全員装備はずし時、固定装備がはずれない',
  CLEAR_ALL_EQUIP_ALL_MEMBER_BY_COMMAND: 'コマンドで全員の装備がすべてはずれる',
  DONT_CLEAR_FIXED_EQUIP_BY_ALL_MEMBER_ALL_COMMAND: '全員装備全はずし時、固定装備がはずれない',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Scene_Boot_doTestOnBoot = Scene_Boot.prototype.doTestOnBoot;
Scene_Boot.prototype.doTestOnBoot = function () {
  _Scene_Boot_doTestOnBoot.call(this);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_LOAD_SETTING, 設定値が正しくロードできている());
};

function 設定値が正しくロードできている() {
  return [
    TestSpec.instance(
      [TestResult.mustBeBoolean],
      () => settings.clearEquipWhenMemberIsOut,
      'パーティアウト時装備はずす'
    ),
  ];
}

const _Game_Party_removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function (actorId) {
  const isTargetActor = this._actors.includes(actorId);
  _Game_Party_removeActor.call(this, actorId);
  if (isTargetActor && settings.clearEquipWhenMemberIsOut) {
    doTest(
      targetPluginVersion,
      TESTCASE_NAME.CLEAR_EQUIP_WHEN_MEMBER_IS_OUT,
      指定アクターの装備が可能な限りはずれている(actorId)
    );
    doTest(
      targetPluginVersion,
      TESTCASE_NAME.DONT_CLEAR_FIXED_EQUIP_BY_OUT,
      指定アクターの固定装備がはずれていない(actorId)
    );
  }
};

const _PluginManager_callCommand = PluginManager.callCommand;
PluginManager.callCommand = function (self, pluginName, commandName, args) {
  _PluginManager_callCommand.call(this, self, pluginName, commandName, args);
  if (pluginName === targetPluginName) {
    switch (commandName) {
      case PLUGIN_COMMAND_NAME.CLEAR_EQUIP:
        装備をはずすコマンドのテスト(args);
        break;
      case PLUGIN_COMMAND_NAME.CLEAR_ALL_EQUIP:
        装備をすべてはずすコマンドのテスト(args);
        break;
      case PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_EQUIP:
        全員の装備をはずすコマンドのテスト(args);
        break;
      case PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_ALL_EQUIP:
        全員の装備をすべてはずすコマンドのテスト();
        break;
    }
  }
};

function 装備をはずすコマンドのテスト(args) {
  const actorId = Number(args.actorId);
  const equipTypes = JSON.parse(args.equipTypes).map((etypeId) => Number(etypeId));
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.CLEAR_EQUIP_BY_COMMAND,
    equipTypes
      .map((equipType) => {
        return 指定アクターの装備が可能な限りはずれている(actorId, equipType);
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.DONT_CLEAR_FIXED_EQUIP_BY_COMMAND,
    指定アクターの固定装備がはずれていない(actorId)
  );
}

function 装備をすべてはずすコマンドのテスト(args) {
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.CLEAR_ALL_EQUIP_BY_COMMAND,
    指定アクターの装備が可能な限りはずれている(Number(args.actorId))
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.DONT_CLEAR_FIXED_EQUIP_BY_ALL_COMMAND,
    指定アクターの固定装備がはずれていない(Number(args.actorId))
  );
}

function 全員の装備をはずすコマンドのテスト(args) {
  const equipTypes = JSON.parse(args.equipTypes).map((etypeId) => Number(etypeId));
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.CLEAR_EQUIP_ALL_MEMBER_BY_COMMAND,
    $gameParty
      .members()
      .map((actor) => {
        return equipTypes
          .map((equipType) => {
            return 指定アクターの指定装備がはずれる(actor.actorId(), equipType);
          })
          .flat();
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.DONT_CLEAR_FIXED_EQUIP_BY_ALL_MEMBER_COMMAND,
    $gameParty
      .members()
      .map((actor) => {
        return 指定アクターの固定装備がはずれていない(actor.actorId());
      })
      .flat()
  );
}

function 全員の装備をすべてはずすコマンドのテスト() {
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.CLEAR_ALL_EQUIP_ALL_MEMBER_BY_COMMAND,
    $gameParty
      .members()
      .map((actor) => {
        return 指定アクターの装備が可能な限りはずれている(actor.actorId());
      })
      .flat()
  );
  doTest(
    targetPluginVersion,
    TESTCASE_NAME.DONT_CLEAR_FIXED_EQUIP_BY_ALL_MEMBER_ALL_COMMAND,
    $gameParty
      .members()
      .map((actor) => {
        return 指定アクターの固定装備がはずれていない(actor.actorId());
      })
      .flat()
  );
}

function 指定アクターの装備が可能な限りはずれている(actorId) {
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => {
        const actor = $gameActors.actor(actorId);
        return [...Array(actor.equipSlots().length).keys()]
          .filter((slotId) => actor.isEquipChangeOk(slotId))
          .every((slotId) => actor.equips()[slotId] === null);
      },
      '装備がはずれているか'
    ),
  ];
}

/**
 * 何も装備せずに装備固定の状態になっているケースには目をつぶる
 * @param {number} actorId アクターID
 * @return {TestSpec[]}
 */
function 指定アクターの固定装備がはずれていない(actorId) {
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => {
        const actor = $gameActors.actor(actorId);
        return [...Array(actor.equipSlots().length).keys()]
          .filter((slotId) => actor.isEquipTypeLocked(actor.equipSlots()[slotId]))
          .every((slotId) => actor.equips()[slotId] !== null);
      },
      '固定装備がはずれていないか'
    ),
  ];
}

function 指定アクターの指定装備がはずれる(actorId, etypeId) {
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () => {
        const actor = $gameActors.actor(actorId);
        return [...Array(actor.equipSlots().length).keys()]
          .filter((slotId) => actor.equipSlots()[slotId] === etypeId && !actor.isEquipTypeLocked(etypeId))
          .every((slotId) => actor.equips()[slotId] === null);
      },
      '指定装備がはずれているか'
    ),
  ];
}
