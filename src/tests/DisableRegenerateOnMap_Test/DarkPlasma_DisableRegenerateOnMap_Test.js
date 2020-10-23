import { targetPluginVersion } from './_build/DarkPlasma_DisableRegenerateOnMap_Test_parameters';
import { registerTestCase } from '../../common/registerTestCase';
import { doTest } from '../../common/doTest';

const TESTCASE_NAME = {
  NOT_REGENERATED_ON_MAP: 'マップ上でHP再生処理が動作していない',
  REGENERATED_ON_BATTLE: '戦闘中にHP再生処理が動作している',
};

const _Scene_Boot_defineTestCase = Scene_Boot.prototype.defineTestCase;
Scene_Boot.prototype.defineTestCase = function () {
  _Scene_Boot_defineTestCase.call(this);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.NOT_REGENERATED_ON_MAP, true);
  registerTestCase(targetPluginVersion, TESTCASE_NAME.REGENERATED_ON_BATTLE, true);
};

const _Game_Actor_onTurnEnd = Game_Actor.prototype.onTurnEnd;
Game_Actor.prototype.onTurnEnd = function () {
  const beforeHp = this.hp;
  _Game_Actor_onTurnEnd.call(this);
  if (this.hrg > 0 && beforeHp < this.mhp) {
    if ($gameParty.inBattle()) {
      doTest(
        targetPluginVersion,
        TESTCASE_NAME.REGENERATED_ON_BATTLE,
        戦闘中にHP再生処理が動作している(this.hp, beforeHp)
      );
    } else {
      doTest(
        targetPluginVersion,
        TESTCASE_NAME.NOT_REGENERATED_ON_MAP,
        マップ上でHP再生処理が動作していない(this.hp, beforeHp)
      );
    }
  }
};

function 戦闘中にHP再生処理が動作している(hp, beforeHp) {
  return [TestSpec.instance([TestResult.mustBeGreaterThanZero], () => hp - beforeHp, '再生後のHP再生量')];
}

function マップ上でHP再生処理が動作していない(hp, beforeHp) {
  return [TestSpec.instance([TestResult.mustBeZero], () => hp - beforeHp, 'ターン終了処理後のHP再生量')];
}
