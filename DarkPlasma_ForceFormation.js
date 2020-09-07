// DarkPlasma_ForceFormation 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/08/28 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 全滅時に後衛と強制的に入れ替える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @param forceFormationMessage
 * @desc 強制的に入れ替える際のメッセージ
 * @text 強制入れ替えのメッセージ
 * @type string
 * @default 倒れた前衛に代わって後衛が戦闘に加わった！
 *
 * @param forceFormationCommonEvent
 * @desc 強制的に入れ替える際に実行するコモンイベントID
 * @text 強制入れ替え時のコモンイベント
 * @type common_event
 * @default 0
 *
 * @param forceTurnChange
 * @desc 強制的に入れ替える際に次のターンへ移行する
 * @text 強制入れ替え時に次ターンへ
 * @type boolean
 * @default false
 *
 * @help
 * 戦闘時 前衛が全滅したら強制的に後衛と入れ替えます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    forceFormationMessage: String(
      pluginParameters.forceFormationMessage || '倒れた前衛に代わって後衛が戦闘に加わった！'
    ),
    forceFormationCommonEvent: Number(pluginParameters.forceFormationCommonEvent || 0),
    forceTurnChange: String(pluginParameters.forceTurnChange || false) === 'true',
  };

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
  };
})();
