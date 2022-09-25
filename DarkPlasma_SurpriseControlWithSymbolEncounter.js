// DarkPlasma_SurpriseControlWithSymbolEncounter 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/09/25 1.0.0 公開
 */

/*:ja
 * @plugindesc シンボルエンカウントにおける先制・不意打ちを制御する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_SurpriseControl
 *
 * @param preemptiveRate
 * @desc 背後をとった際の先制攻撃率（％）
 * @text 先制攻撃率（％）
 * @type number
 * @default 100
 *
 * @param surpriseRate
 * @desc 背後をとられた際の不意打ち率（％）
 * @text 不意打ち率（％）
 * @type number
 * @default 100
 *
 * @param symbolTags
 * @desc このパラメータのいずれかのメモタグが設定されているイベントを敵シンボルとみなします。
 * @text シンボルメモタグ
 * @type string[]
 * @default ["se"]
 *
 * @help
 * version: 1.0.0
 * シンボルエンカウントシステムにおいて、先制・不意打ちを制御します。
 *
 * 敵シンボルとなるイベントには、
 * プラグインパラメータで指定したメモタグを設定してください。
 * 例: <se>
 *
 * 対象イベントの実行において戦闘の処理があった場合、
 * プレイヤーとそのイベントの向きに応じて先制・不意打ちを発生させます。
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_SurpriseControl
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    preemptiveRate: Number(pluginParameters.preemptiveRate || 100),
    surpriseRate: Number(pluginParameters.surpriseRate || 100),
    symbolTags: JSON.parse(pluginParameters.symbolTags || '["se"]').map((e) => {
      return String(e || '');
    }),
  };

  /**
   * 戦闘開始状況
   */
  const ENCOUNTER_SITUATION = {
    DEFAULT: 0,
    PREEMPTIVE: 1,
    SURPRISE: 2, // 敵による不意打ち
  };
  function BattleManager_SymbolEncounterMixIn(battleManager) {
    const _setup = battleManager.setup;
    battleManager.setup = function (troopId, canEspace, canLose) {
      _setup.call(this, troopId, canEspace, canLose);
      /**
       * 敵シンボルと遭遇した場合は先制・不意打ち判定を行う
       */
      if ($gameTemp.isSymbolEncounter()) {
        this.onEncounter();
      }
    };
    const _ratePreemptive = battleManager.ratePreemptive;
    battleManager.ratePreemptive = function () {
      if ($gameTemp.isSymbolEncounter()) {
        switch ($gameTemp.encounterSituation()) {
          case ENCOUNTER_SITUATION.DEFAULT:
            return _ratePreemptive.call(this);
          case ENCOUNTER_SITUATION.PREEMPTIVE:
            return $gameParty.preemptiveRateByBackAttack();
          case ENCOUNTER_SITUATION.SURPRISE:
            return 0;
        }
      }
      return _ratePreemptive.call(this);
    };
    const _rateSurprise = battleManager.rateSurprise;
    battleManager.rateSurprise = function () {
      if ($gameTemp.isSymbolEncounter()) {
        switch ($gameTemp.encounterSituation()) {
          case ENCOUNTER_SITUATION.DEFAULT:
            return _rateSurprise.call(this);
          case ENCOUNTER_SITUATION.PREEMPTIVE:
            return 0;
          case ENCOUNTER_SITUATION.SURPRISE:
            return $gameParty.surpriseRateByBackAttacked();
        }
      }
      return _rateSurprise.call(this);
    };
  }
  BattleManager_SymbolEncounterMixIn(BattleManager);
  /**
   * 接触パターンはセーブデータに含まない。
   * イベント起動後戦闘までの間にセーブを挟むケースは考慮しない。
   * 戦闘開始前にセーブが挟まれるような重要イベントにおいて、
   * 向きによる先制・不意打ちが発生するのはプレイヤーにとっては直感的でない。
   */
  function Game_Temp_SymbolEncounterMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._encounterSituation = ENCOUNTER_SITUATION.DEFAULT;
      this._isSymbolEncounter = false;
    };
    gameTemp.setEncounterSituation = function (situation) {
      this._encounterSituation = situation;
    };
    gameTemp.encounterSituation = function () {
      return this._encounterSituation;
    };
    gameTemp.setIsSymbolEncounter = function (isSymbolEncounter) {
      this._isSymbolEncounter = isSymbolEncounter;
    };
    gameTemp.isSymbolEncounter = function () {
      return this._isSymbolEncounter;
    };
  }
  Game_Temp_SymbolEncounterMixIn(Game_Temp.prototype);
  /**
   * @param {Game_Event.prototype} gameEvent
   */
  function Game_Event_SymbolEncounterMixIn(gameEvent) {
    /**
     * プレイヤーの前方にいるかどうか
     * シンボルがプレイヤーの前方にいれば、プレイヤー側が先制攻撃する
     * @return {boolean}
     */
    gameEvent.isAheadOfPlayer = function () {
      switch (this._direction) {
        case 2: // 下向き
          return $gamePlayer.y <= this.y;
        case 8: // 上向き
          return $gamePlayer.y >= this.y;
        case 4: // 左向き
          return $gamePlayer.x >= this.x;
        case 6: // 右向き
          return $gamePlayer.x <= this.x;
        default:
          // 不明な状態（本来ここには来ないが、一応偽とする）
          return false;
      }
    };
    /**
     * プレイヤーとの位置関係、向きに応じて先制or不意打ち状況セット
     */
    gameEvent.setupEncounterSituation = function () {
      $gameTemp.setIsSymbolEncounter(true);
      if ($gamePlayer.direction() === this._direction) {
        if (this.isAheadOfPlayer()) {
          $gameTemp.setEncounterSituation(ENCOUNTER_SITUATION.PREEMPTIVE);
        } else {
          $gameTemp.setEncounterSituation(ENCOUNTER_SITUATION.SURPRISE);
        }
      } else {
        $gameTemp.setEncounterSituation(ENCOUNTER_SITUATION.DEFAULT);
      }
    };
    /**
     * シンボル敵であるかどうか（拡張プラグインで上書きする）
     * @return {boolean}
     */
    gameEvent.isSymbolEnemy = function () {
      return settings.symbolTags.some((tag) => !!this.event().meta && !!this.event().meta[tag]);
    };
    /**
     * 先制判定のため、上書き
     */
    gameEvent.lock = function () {
      if (!this._locked) {
        if (this.isSymbolEnemy()) {
          this.setupEncounterSituation();
        }
        this._prelockDirection = this.direction();
        if (!this.isSymbolEnemy()) {
          this.turnTowardPlayer();
        }
        this._locked = true;
      }
    };
  }
  Game_Event_SymbolEncounterMixIn(Game_Event.prototype);
  function Game_Party_SymbolEncounterMixIn(gameParty) {
    gameParty.preemptiveRateByBackAttack = function () {
      return settings.preemptiveRate / 100;
    };
    gameParty.surpriseRateByBackAttacked = function () {
      return settings.surpriseRate / 100;
    };
  }
  Game_Party_SymbolEncounterMixIn(Game_Party.prototype);
  function Scene_Battle_SymbolEncounterMixIn(sceneBattle) {
    const _terminate = sceneBattle.terminate;
    sceneBattle.terminate = function () {
      _terminate.call(this);
      $gameTemp.setIsSymbolEncounter(false);
    };
  }
  Scene_Battle_SymbolEncounterMixIn(Scene_Battle.prototype);
})();
