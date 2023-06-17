/// <reference path="./ForceFormation.d.ts" />

import { isMapMetaDataAvailable } from '../../common/mapMetaData';
import { settings } from './_build/DarkPlasma_ForceFormation_parameters';

function BattleManager_ForceFormationMixIn(battleManager: typeof BattleManager) {
  const _checkBattleEnd = battleManager.checkBattleEnd;
  battleManager.checkBattleEnd = function () {
    if (_checkBattleEnd.call(this)) {
      return true;
    }
    if (this._phase) {
      // 前衛が全滅していたら後衛と交代して戦闘続行
      if ($gameParty.forwardMembersAreAllDead() && $gameParty.isForceFormationEnabled()) {
        $gameParty.forceFormation();
        this._logWindow?.displayForceChangedFormation();
        if (settings.forceFormationCommonEvent > 0) {
          $gameTemp.reserveCommonEvent(settings.forceFormationCommonEvent);
        }
        if (settings.forceTurnChange) {
          this._phase = 'turnEnd';
        }
        return false;
      }
    }
    return false;
  };
}

BattleManager_ForceFormationMixIn(BattleManager);

function Game_Map_ForceFormationMixIn(gameMap: Game_Map) {
  gameMap.isForceFormationEnabled = function () {
    return !isMapMetaDataAvailable() || !$dataMap?.meta.disableForceFormation;
  };
}

Game_Map_ForceFormationMixIn(Game_Map.prototype);

function Game_Party_ForceFormationMixIn(gameParty: Game_Party) {
  const _onBattleStart = gameParty.onBattleStart;
  gameParty.onBattleStart = function (advantageous) {
    _onBattleStart.call(this, advantageous);
    this._forceFormationChanged = false;
  };
  
  /**
   * 前衛が全滅しているかどうか
   */
  gameParty.forwardMembersAreAllDead = function () {
    return this.battleMembers().every((member) => member.isDead());
  };
  
  /**
   * 全滅判定
   * - 戦闘外は元々の処理
   * - 強制入れ替えが有効の場合は、前衛後衛両方が全滅している
   * - 戦闘中かつ強制入れ替えが無効の場合は、前衛のみ全滅している
   */
  const _isAllDead = gameParty.isAllDead;
  gameParty.isAllDead = function () {
    if (!this.inBattle()) {
      return _isAllDead.call(this);
    }
    return this.isForceFormationEnabled()
      ? this.allMembers().every((actor) => actor.isDead())
      : this.forwardMembersAreAllDead();
  };
  
  gameParty.isForceFormationEnabled = function () {
    return (
      (settings.disableSwitchId === 0 || !$gameSwitches.value(settings.disableSwitchId)) &&
      $gameMap.isForceFormationEnabled()
    );
  };
  
  /**
   * 前衛全滅時に呼び出す
   * 後衛と強制的に入れ替える
   */
  gameParty.forceFormation = function () {
    const aliveMemberIndexes: number[] = this.allMembers().reduce((result: number[], member) => {
      return !member.isBattleMember() && member.isAlive()
        ? result.concat([this.allMembers().indexOf(member)])
        : result;
    }, []);
    this.battleMembers().forEach((deadMember, index) => {
      const swapTargetIndex = aliveMemberIndexes[index] ? aliveMemberIndexes[index] : null;
      if (swapTargetIndex) {
        this.swapOrder(deadMember.index(), swapTargetIndex);
      }
    });
    $gameTemp.requestBattleRefresh();
    this._forceFormationChanged = true;
  };
  
  gameParty.forceFormationChanged = function () {
    return this._forceFormationChanged;
  };
  
  gameParty.resetForceFormationChanged = function () {
    this._forceFormationChanged = false;
  };
}

Game_Party_ForceFormationMixIn(Game_Party.prototype);

function Window_BattleLog_ForceFormationMixIn(windowClass: Window_BattleLog) {
  /**
   * 強制的に入れ替わった際にメッセージを表示する
   */
  windowClass.displayForceChangedFormation = function () {
    this.push('addText', settings.forceFormationMessage);
    this.push('wait');
    this.push('clear');
  };
}

Window_BattleLog_ForceFormationMixIn(Window_BattleLog.prototype);
