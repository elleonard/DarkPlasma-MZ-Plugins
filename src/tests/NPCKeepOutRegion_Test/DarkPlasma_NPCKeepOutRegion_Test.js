import { doTest } from '../../common/doTest';
import { pluginName } from '../../common/pluginName';
import { registerAutoTestCases } from '../../common/registerTestCase';
import { targetPluginVersion } from './_build/DarkPlasma_NPCKeepOutRegion_Test_parameters';

const TESTCASE_NAME = {
  CANNOT_PASS_MOVE_TYPE_RANDOM: 'ランダム移動で指定リージョンを通行できない',
  CAN_PASS_MOVE_TYPE_CUSTOM: 'カスタム移動で指定リージョンを通行できる',
  CAN_PASS_MOVE_ROUTE_FORCING: '移動ルートの指定で指定リージョンを通行できる',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerAutoTestCases(targetPluginVersion, Object.values(TESTCASE_NAME));
};

PluginManager.registerCommand(pluginName, 'doTest', function () {
  /**
   * 移動ルートの指定で完了までウェイトした後に実行するので、実行できれば成功
   */
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_PASS_MOVE_ROUTE_FORCING, [
    TestSpec.instance([TestResult.mustBeTrue], () => true, '移動ルートの指定'),
  ]);
  doTest(targetPluginVersion, TESTCASE_NAME.CAN_PASS_MOVE_TYPE_CUSTOM, カスタム移動で指定リージョンを通行できる());
  doTest(targetPluginVersion, TESTCASE_NAME.CANNOT_PASS_MOVE_TYPE_RANDOM, ランダム移動で指定リージョンを通行できない());
});

function カスタム移動で指定リージョンを通行できる() {
  const event = customMoveEvent();
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () =>
        keepOutRegionCells().every((cell) =>
          [2, 4, 6, 8].every((direction) =>
            event.isMapPassable(
              $gameMap.roundXWithDirection(cell.x, direction),
              $gameMap.roundYWithDirection(cell.y, direction),
              direction
            )
          )
        ),
      '自律移動 カスタム'
    ),
  ];
}

function ランダム移動で指定リージョンを通行できない() {
  const event = randomMoveEvent();
  return [
    TestSpec.instance(
      [TestResult.mustBeTrue],
      () =>
        keepOutRegionCells().every(
          (cell) =>
            ![2, 4, 6, 8].every((direction) =>
              event.isMapPassable(
                $gameMap.roundXWithDirection(cell.x, direction),
                $gameMap.roundYWithDirection(cell.y, direction),
                direction
              )
            )
        ),
      '自律移動 ランダム'
    ),
  ];
}

/**
 * NPC立ち入り禁止マスの一覧
 * @return {Object.<string, number>}
 */
function keepOutRegionCells() {
  const cellCount = $gameMap.width() * $gameMap.height();
  return [...Array(cellCount).keys()]
    .map((cellIndex) => {
      return {
        x: cellIndex % $gameMap.width(),
        y: Math.floor(cellIndex / $gameMap.width()),
      };
    })
    .filter((cell) => {
      return $gameMap.isEventKeepOutRegion(cell.x, cell.y);
    });
}

function randomMoveEvent() {
  return $gameMap.events().find((event) => event._moveType === 1);
}

function customMoveEvent() {
  return $gameMap.events().find((event) => event._moveType === 3);
}
