import { doTest } from '../../common/doTest';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion } from './_build/DarkPlasma_SealItemCommand_Test_parameters';

const TESTCASE_NAME = {
  SEAL_ITEM_IN_MAP: 'メニューのアイテムを封印できる',
  SEAL_ITEM_IN_BATTLE: '戦闘中のアイテムを封印できる',
  UNSEALED_IN_MAP: '非封印時メニューのアイテムを選択できる',
  UNSEALED_IN_BATTLE: '非封印時戦闘のアイテムを選択できる',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

const _Scene_Menu_start = Scene_Menu.prototype.start;
Scene_Menu.prototype.start = function () {
  _Scene_Menu_start.call(this);
  if ($gameMap.isItemCommandEnabled()) {
    doTest(targetPluginVersion, TESTCASE_NAME.UNSEALED_IN_MAP, [
      TestSpec.instance([TestResult.mustBeTrue], () => this._commandWindow.itemCommand().enabled, 'アイテムコマンド'),
    ]);
  } else {
    doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_IN_MAP, [
      TestSpec.instance([TestResult.mustBeFalse], () => this._commandWindow.itemCommand().enabled, 'アイテムコマンド'),
    ]);
  }
};

const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function () {
  _Scene_Battle_startActorCommandSelection.call(this);
  if ($gameMap.isItemCommandEnabled()) {
    doTest(targetPluginVersion, TESTCASE_NAME.UNSEALED_IN_BATTLE, [
      TestSpec.instance(
        [TestResult.mustBeTrue],
        () => this._actorCommandWindow.itemCommand().enabled,
        'アイテムコマンド'
      ),
    ]);
  } else {
    doTest(targetPluginVersion, TESTCASE_NAME.SEAL_ITEM_IN_BATTLE, [
      TestSpec.instance(
        [TestResult.mustBeFalse],
        () => this._actorCommandWindow.itemCommand().enabled,
        'アイテムコマンド'
      ),
    ]);
  }
};
