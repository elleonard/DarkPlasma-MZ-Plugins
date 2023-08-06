// DarkPlasma_FormationInBattle 2.1.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/08/06 2.1.1 特定条件下でカーソルの合っていないアクターが選択されてしまう不具合を修正
 * 2023/07/29 2.1.0 DarkPlasma_Formation 2.1.0対応
 * 2023/06/17 2.0.0 DarkPlasma_Formation 2.0.0対応
 *                  TypeScript移行
 * 2022/08/02 1.2.7 リファクタ
 *            1.2.6 リファクタ
 * 2022/08/01 1.2.5 DarkPlasma_Formation 1.3.2に対応
 * 2022/03/31 1.2.4 TemplateEvent.jsと併用すると戦闘テストできない不具合を修正
 * 2021/07/05 1.2.3 MZ 1.3.2に対応
 * 2021/06/22 1.2.2 サブフォルダからの読み込みに対応
 * 2021/05/09 1.2.1 戦闘テスト開始時にエラーが発生する不具合を修正
 * 2021/05/05 1.2.0 特定マップで戦闘中の並び替えを禁止する機能追加
 * 2020/12/30 1.1.4 DarkPlasma_Formation 1.2.0に対応
 * 2020/12/16 1.1.3 DarkPlasma_Formation 1.0.5に対応
 * 2020/12/14 1.1.2 強制入れ替え時にエラーで落ちる不具合を修正
 * 2020/10/19 1.1.1 戦闘開始時の不要な処理を削除
 * 2020/10/13 1.1.0 強制入れ替え時のクールダウン設定を追加
 * 2020/09/21 1.0.1 並び替え確定時にパーティウィンドウがリフレッシュされない不具合を修正
 * 2020/09/13 1.0.0 公開
 */

/*:
 * @plugindesc 戦闘のパーティコマンドに並び替えを追加
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_Formation
 *
 * @param cooldownTurnCount
 * @desc 並び替え後、このターン数が経過するまで再度並び替えできない（0で即時変更可能）
 * @text クールタイム
 * @type number
 * @default 0
 *
 * @param cooldownOnlyWhenSwapForwardAndBenchwarmer
 * @desc 前衛後衛を入れ替えた場合のみクールタイムを有効にする
 * @text 前後入れ替え時のみクール
 * @type boolean
 * @default true
 *
 * @param cooldownFormat
 * @desc クールタイムの表示形式（{turn}がターン数に置き換えられる）
 * @text クールタイム表示形式
 * @type string
 * @default (CT:{turn})
 *
 * @param cooldownWithForceFormation
 * @desc 強制入れ替え時にもクールダウンする
 * @text 強制入れ替え時クールダウン
 * @type boolean
 * @default true
 *
 * @help
 * version: 2.1.1
 * 戦闘シーンで並び替えできるようになります。
 *
 * マップのメモ欄に<disableFormationInBattle>と記述することで、
 * 対象マップでの戦闘中に並び替えを選択できなくなります。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_Formation version:2.0.0
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

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    cooldownTurnCount: Number(pluginParameters.cooldownTurnCount || 0),
    cooldownOnlyWhenSwapForwardAndBenchwarmer:
      String(pluginParameters.cooldownOnlyWhenSwapForwardAndBenchwarmer || true) === 'true',
    cooldownFormat: String(pluginParameters.cooldownFormat || `(CT:{turn})`),
    cooldownWithForceFormation: String(pluginParameters.cooldownWithForceFormation || true) === 'true',
  };

  /**
   * 隊列変更のクールタイム
   */
  class FormationCooldown {
    constructor() {
      this._cooldownTurn = 0;
      this._membersAtTurnStart = [];
    }
    /**
     * 戦闘開始時の初期化
     */
    initCooldown() {
      this._cooldownTurn = 0;
      this.storeMembersAtTurnStart();
    }
    /**
     * ターン開始時のメンバー隊列を保持する
     */
    storeMembersAtTurnStart() {
      this._membersAtTurnStart = settings.cooldownOnlyWhenSwapForwardAndBenchwarmer
        ? $gameParty.battleMembers().map((actor) => actor.actorId())
        : $gameParty.allMembers().map((actor) => actor.actorId());
    }
    /**
     * クールダウン開始の必要があるかどうか
     * @return {boolean}
     */
    needCooldown() {
      /**
       * 強制入れ替え時にクールダウンしない
       */
      if (
        !settings.cooldownWithForceFormation &&
        $gameParty.forceFormationChanged &&
        $gameParty.forceFormationChanged()
      ) {
        $gameParty.resetForceFormationChanged();
        return false;
      }
      if (settings.cooldownOnlyWhenSwapForwardAndBenchwarmer) {
        // 前衛後衛が入れ替わっている場合のみ
        const battleMembers = $gameParty.battleMembers().map((actor) => actor.actorId());
        return battleMembers.some((actorId) => {
          return !this._membersAtTurnStart.includes(actorId);
        });
      } else {
        // メンバーの順番がいずれか変わっていれば
        const members = $gameParty.allMembers().map((actor) => actor.actorId());
        return this._membersAtTurnStart.some((actorId, index) => {
          return actorId !== members[index];
        });
      }
    }
    /**
     * クールダウンが必要なら開始する
     */
    triggerCooldown() {
      if (this.needCooldown()) {
        this.startCooldown();
      }
      this.storeMembersAtTurnStart();
    }
    /**
     * クールダウン中かどうか
     */
    isDuringCooldown() {
      return this._cooldownTurn > 0;
    }
    startCooldown() {
      this._cooldownTurn = settings.cooldownTurnCount + 1;
    }
    /**
     * クールダウンターン経過
     */
    decreaseCooldownTurn() {
      this._cooldownTurn--;
    }
    cooldownTurnCount() {
      return this._cooldownTurn;
    }
  }
  const formationCooldown = new FormationCooldown();
  function BattleManager_FormationInBattleMixIn(battleManager) {
    const _startTurn = battleManager.startTurn;
    battleManager.startTurn = function () {
      _startTurn.call(this);
      formationCooldown.triggerCooldown();
    };
    const _endTurn = battleManager.endTurn;
    battleManager.endTurn = function () {
      _endTurn.call(this);
      /**
       * 強制入れ替えがあった場合
       */
      if (
        !formationCooldown.isDuringCooldown() &&
        settings.cooldownWithForceFormation &&
        $gameParty.forceFormationChanged &&
        $gameParty.forceFormationChanged()
      ) {
        formationCooldown.triggerCooldown();
      }
      formationCooldown.decreaseCooldownTurn();
    };
  }
  BattleManager_FormationInBattleMixIn(BattleManager);
  function Game_Party_FormationInBattleMixIn(gameParty) {
    const _onBattleStart = gameParty.onBattleStart;
    gameParty.onBattleStart = function (advantageous) {
      _onBattleStart.call(this, advantageous);
      formationCooldown.initCooldown();
    };
  }
  Game_Party_FormationInBattleMixIn(Game_Party.prototype);
  function Game_Map_FormationInBattleMixIn(gameMap) {
    gameMap.isFormationInBattleEnabled = function () {
      return !isMapMetaDataAvailable() || !$dataMap?.meta.disableFormationInBattle;
    };
  }
  Game_Map_FormationInBattleMixIn(Game_Map.prototype);
  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_FormationMixIn(sceneBattle) {
    const baseClass = Scene_FormationMixIn(Scene_Base).prototype;
    const _createAllWindows = sceneBattle.createAllWindows;
    sceneBattle.createAllWindows = function () {
      _createAllWindows.call(this);
      this.createFormationWindows();
    };
    const _createPartyCommandWindow = sceneBattle.createPartyCommandWindow;
    sceneBattle.createPartyCommandWindow = function () {
      _createPartyCommandWindow.call(this);
      this._partyCommandWindow.setHandler('formation', this.commandFormation.bind(this));
    };
    sceneBattle.createFormationWindows = function () {
      this.createFormationHelpWindow();
      this.createFormationBattleMemberWindow();
      this.createFormationWaitingMemberWindow();
      this.createFormationStatusWindow();
      this.setupFormationWindows();
      this.hideFormationWindows();
      this._pendingWindow = undefined;
      this._currentWindow = this.formationBattleMemberWindow();
    };
    sceneBattle.pendingWindow = function () {
      return baseClass.pendingWindow.call(this);
    };
    sceneBattle.currentActiveWindow = function () {
      return baseClass.currentActiveWindow.call(this);
    };
    sceneBattle.setupFormationWindows = function () {
      baseClass.setupFormationWindows.call(this);
    };
    sceneBattle.createFormationHelpWindow = function () {
      this._formationHelpWindow = new Window_Help(this.formationHelpWindowRect());
      this._formationHelpWindow.setText(TextManager.formation);
      this.addWindow(this._formationHelpWindow);
    };
    sceneBattle.formationHelpWindowRect = function () {
      return baseClass.helpWindowRect.call(this);
    };
    sceneBattle.formationHelpWindow = function () {
      return this._formationHelpWindow;
    };
    sceneBattle.cancelButtonWidth = function () {
      /**
       * 戦闘シーンではウィンドウ生成後にキャンセルボタンが生成されるため、
       * サイズ計算のために一時的にインスタンスを作る
       */
      const cancelButton = new Sprite_Button('cancel');
      return cancelButton.width;
    };
    sceneBattle.createFormationStatusWindow = function () {
      this._formationStatusWindow = new Window_FormationStatus(this.formationStatusWindowRect());
      this.addWindow(this._formationStatusWindow);
    };
    sceneBattle.formationStatusWindowRect = function () {
      return baseClass.statusWindowRect.call(this);
    };
    sceneBattle.formationStatusWindowWidth = function () {
      return baseClass.formationStatusWindowWidth.call(this);
    };
    sceneBattle.formationStatusWindowHeight = function () {
      return baseClass.formationStatusWindowHeight.call(this);
    };
    sceneBattle.formationStatusWindow = function () {
      return this._formationStatusWindow;
    };
    sceneBattle.createFormationBattleMemberWindow = function () {
      this._formationBattleMemberWindow = new Window_FormationBattleMember(this.formationBattleMemberWindowRect());
      this.addWindow(this._formationBattleMemberWindow);
    };
    sceneBattle.formationBattleMemberWindowRect = function () {
      return baseClass.battleMemberWindowRect.call(this);
    };
    sceneBattle.battleMemberWindowWidth = function () {
      return baseClass.battleMemberWindowWidth.call(this);
    };
    sceneBattle.formationBattleMemberWindow = function () {
      return this._formationBattleMemberWindow;
    };
    sceneBattle.createFormationWaitingMemberWindow = function () {
      this._formationWaitingMemberWindow = new Window_FormationWaitingMember(this.formationWaitingMemberWindowRect());
      this.addWindow(this._formationWaitingMemberWindow);
    };
    sceneBattle.formationWaitingMemberWindowRect = function () {
      return baseClass.waitingMemberWindowRect.call(this);
    };
    sceneBattle.waitingMemberWindowHeight = function () {
      return baseClass.waitingMemberWindowHeight.call(this);
    };
    sceneBattle.formationWaitingMemberWindow = function () {
      return this._formationWaitingMemberWindow;
    };
    sceneBattle.formationStatusParamsWindowHeight = function () {
      return 0;
    };
    sceneBattle.formationStatusParamsWindow = function () {
      return null;
    };
    sceneBattle.formationEquipStatusWindow = function () {
      return null;
    };
    sceneBattle.moveCancelButtonToEdge = function () {
      if (this._cancelButton) {
        this._cancelButton.y = Math.floor((this.buttonAreaHeight() - 48) / 2);
      }
    };
    sceneBattle.returnCancelButton = function () {
      if (this._cancelButton) {
        this._cancelButton.y = this.buttonY();
      }
    };
    sceneBattle.showFormationWindows = function () {
      this._formationHelpWindow.show();
      this._formationStatusWindow.show();
      this._formationBattleMemberWindow.show();
      this._formationWaitingMemberWindow.show();
      this._formationBattleMemberWindow.select(0);
      this._formationBattleMemberWindow.activate();
      this.moveCancelButtonToEdge();
      this._currentWindow = this._formationBattleMemberWindow;
    };
    sceneBattle.hideFormationWindows = function () {
      this._formationHelpWindow.hide();
      this._formationStatusWindow.hide();
      this._formationBattleMemberWindow.hide();
      this._formationWaitingMemberWindow.hide();
    };
    sceneBattle.commandFormation = function () {
      this.showFormationWindows();
    };
    sceneBattle.onFormationOk = function () {
      baseClass.onFormationOk.call(this);
      $gameTemp.requestBattleRefresh();
    };
    sceneBattle.onFormationCancel = function () {
      baseClass.onFormationCancel.call(this);
    };
    sceneBattle.quitFromFormation = function () {
      this.hideFormationWindows();
      this.startPartyCommandSelection();
      /**
       * コマンド入力情報初期化
       */
      $gameParty.makeActions();
    };
    sceneBattle.activateBattleMemberWindow = function () {
      baseClass.activateBattleMemberWindow.call(this);
    };
    sceneBattle.activateWaitingMemberWindow = function () {
      baseClass.activateWaitingMemberWindow.call(this);
    };
    sceneBattle.targetIndexOfActivateBattleMember = function () {
      return baseClass.targetIndexOfActivateBattleMember.call(this);
    };
    sceneBattle.targetIndexOfActivateWaitingMember = function () {
      return baseClass.targetIndexOfActivateWaitingMember.call(this);
    };
    const _updateCancelButton = sceneBattle.updateCancelButton;
    sceneBattle.updateCancelButton = function () {
      _updateCancelButton.call(this);
      if (this._cancelButton && !this._cancelButton.visible) {
        /**
         * 非表示になってから元の位置に戻す
         */
        this.returnCancelButton();
      }
    };
  }
  Scene_Battle_FormationMixIn(Scene_Battle.prototype);
  function Window_PartyCommand_FormationMixIn(windowClass) {
    windowClass.addCommandAt = function (index, name, symbol, enabled = true, ext = null) {
      this._list.splice(index, 0, {
        name: name,
        symbol: symbol,
        enabled: enabled,
        ext: ext,
      });
    };
    const _makeCommandList = windowClass.makeCommandList;
    windowClass.makeCommandList = function () {
      _makeCommandList.call(this);
      let commandName = TextManager.formation;
      if (!this.isFormationEnabled() && formationCooldown.isDuringCooldown()) {
        commandName += settings.cooldownFormat.replace(/\{turn\}/gi, `${formationCooldown.cooldownTurnCount()}`);
      }
      this.addCommandAt(1, commandName, 'formation', this.isFormationEnabled());
    };
    windowClass.isFormationEnabled = function () {
      return (
        $gameParty.size() >= 2 &&
        $gameSystem.isFormationEnabled() &&
        !formationCooldown.isDuringCooldown() &&
        $gameMap.isFormationInBattleEnabled()
      );
    };
  }
  Window_PartyCommand_FormationMixIn(Window_PartyCommand.prototype);
})();
