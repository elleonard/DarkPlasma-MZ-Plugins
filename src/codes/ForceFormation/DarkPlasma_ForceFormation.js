import { settings } from './_build/DarkPlasma_ForceFormation_parameters';

// Window_BattleLog
/**
 * 強制的に入れ替わった際にメッセージを表示する
 */
Window_BattleLog.prototype.displayForceChangedFormation = function () {
  this.push('addText', settings.forceFormationMessage);
  this.push('wait');
  this.push('clear');
};

// BattleManager
const _BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
BattleManager.checkBattleEnd = function () {
  if (_BattleManager_checkBattleEnd.call(this)) {
    return true;
  }
  if (this._phase) {
    // 前衛が全滅していたら後衛と交代して戦闘続行
    if ($gameParty.forwardMembersAreAllDead()) {
      $gameParty.forceFormation();
      this._logWindow.displayForceChangedFormation();
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

// GameParty
const _Game_Party_onBattleStart = Game_Party.prototype.onBattleStart;
Game_Party.prototype.onBattleStart = function (advantageous) {
  _Game_Party_onBattleStart.call(this, advantageous);
  this._forceFormationChanged = false;
};

/**
 * 前衛が全滅しているかどうか
 */
Game_Party.prototype.forwardMembersAreAllDead = function () {
  return (
    this.battleMembers().filter(function (member) {
      return member.isAlive();
    }, this).length === 0
  );
};

/**
 * 前衛後衛両方とも全滅しているかどうか
 */
Game_Party.prototype.isAllDead = function () {
  return (
    this.allMembers().filter(function (member) {
      return member.isAlive();
    }, this).length === 0
  );
};

/**
 * 前衛全滅時に呼び出す
 * 後衛と強制的に入れ替える
 */
Game_Party.prototype.forceFormation = function () {
  this.battleMembers().forEach(function (deadMember) {
    const aliveTarget = this.allMembers().find(function (member) {
      return !member.isBattleMember() && member.isAlive();
    }, this);
    if (aliveTarget) {
      this.swapOrder(deadMember.index(), this.allMembers().indexOf(aliveTarget));
      $gameTemp.requestBattleRefresh();
    }
  }, this);
  this._forceFormationChanged = true;
};

Game_Party.prototype.forceFormationChanged = function () {
  return this._forceFormationChanged;
};

Game_Party.prototype.resetForceFormationChanged = function () {
  this._forceFormationChanged = false;
};
