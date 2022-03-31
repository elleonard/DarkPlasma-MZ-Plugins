// DarkPlasma_ForceFormation 2.3.4
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/03/31 2.3.4 TemplateEvent.jsと併用すると戦闘テストできない不具合を修正
 * 2021/07/05 2.3.3 MZ 1.3.2に対応
 * 2021/06/22 2.3.2 サブフォルダからの読み込みに対応
 * 2021/05/09 2.3.1 戦闘テスト開始時にエラーが発生する不具合を修正
 * 2021/05/07 2.3.0 特定マップで強制入れ替えを無効化する機能を追加
 * 2021/01/04 2.2.4 正しく動作しない不具合を修正
 *            2.2.3 null合体演算子が動作しないブラウザに対応
 *            2.2.2 全滅判定を飛ばした場合にも入れ替え無効スイッチを判定するよう修正
 * 2021/01/01 2.2.1 戦闘外の全滅判定に影響していた不具合を修正
 * 2020/12/31 2.2.0 強制入れ替え無効スイッチ設定を追加
 * 2020/11/23 2.1.1 リファクタ
 * 2020/10/13 2.1.0 戦闘中の入れ替えクールダウン用のコード追加
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/28 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 全滅時に後衛と強制的に入れ替える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
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
 * @param disableSwitchId
 * @desc ONにすると強制入れ替えを無効にするスイッチ
 * @text 無効スイッチ
 * @type switch
 * @default 0
 *
 * @help
 * version: 2.3.4
 * 戦闘時 前衛が全滅したら強制的に後衛と入れ替えます。
 *
 * マップのメモ欄に<disableForceFormation>と書くことで、
 * そのマップでの戦闘時に強制入れ替えしなくなります。
 */

(() => {
  'use strict';

  /**
   * マップのメタデータを取得できるか
   * @return {boolean}
   */
  function isMapMetaDataAvailable() {
    return $dataMap && $dataMap.meta;
  }

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
    disableSwitchId: Number(pluginParameters.disableSwitchId || 0),
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
      if ($gameParty.forwardMembersAreAllDead() && $gameParty.isForceFormationEnabled()) {
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

  Game_Map.prototype.isForceFormationEnabled = function () {
    return !isMapMetaDataAvailable() || !$dataMap.meta.disableForceFormation;
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
    return this.battleMembers().every((member) => member.isDead());
  };

  /**
   * 全滅判定
   * - 戦闘外は元々の処理
   * - 強制入れ替えが有効の場合は、前衛後衛両方が全滅している
   * - 戦闘中かつ強制入れ替えが無効の場合は、前衛のみ全滅している
   */
  const _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
  Game_Party.prototype.isAllDead = function () {
    if (!this.inBattle()) {
      return _Game_Party_isAllDead.call(this);
    }
    return this.isForceFormationEnabled()
      ? this.allMembers().every((actor) => actor.isDead())
      : this.forwardMembersAreAllDead();
  };

  Game_Party.prototype.isForceFormationEnabled = function () {
    return (
      (settings.disableSwitchId === 0 || !$gameSwitches.value(settings.disableSwitchId)) &&
      $gameMap.isForceFormationEnabled()
    );
  };

  /**
   * 前衛全滅時に呼び出す
   * 後衛と強制的に入れ替える
   */
  Game_Party.prototype.forceFormation = function () {
    const aliveMemberIndexes = this.allMembers().reduce((result, member) => {
      return !member.isBattleMember() && member.isAlive() ? result.concat([this.allMembers().indexOf(member)]) : result;
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

  Game_Party.prototype.forceFormationChanged = function () {
    return this._forceFormationChanged;
  };

  Game_Party.prototype.resetForceFormationChanged = function () {
    this._forceFormationChanged = false;
  };
})();
