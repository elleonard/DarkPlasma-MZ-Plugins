// DarkPlasma_EvacuateStateAndMeta 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 現在のステートに関する情報を退避する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 現在のステートに関する情報を一時的に退避しておく機能を提供します。
 * 本プラグインは単体では動作しません。
 * 本プラグインの機能は拡張プラグインから利用されます。
 */

(() => {
  'use strict';

  function Game_Temp_EvacuateStateAndMetaMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._evacuatedStatesAndMeta = {};
    };
    gameTemp.evacuateStatesAndMeta = function (key, statesAndMeta) {
      this._evacuatedStatesAndMeta[key] = statesAndMeta;
    };
    gameTemp.evacuatedStatesAndMeta = function (key) {
      return this._evacuatedStatesAndMeta[key];
    };
    gameTemp.clearEvacuatedStatesAndMeta = function (key) {
      delete this._evacuatedStatesAndMeta[key];
    };
  }
  Game_Temp_EvacuateStateAndMetaMixIn(Game_Temp.prototype);
  function Game_BattlerBase_EvacuateStateAndMetaMixIn(gameBattlerBase) {
    gameBattlerBase.statesAndMetaForEvacuate = function (stateIds) {
      const stateTurns = {};
      stateIds.forEach((stateId) => {
        stateTurns[stateId] = this._stateTurns[stateId];
      });
      return {
        ids: stateIds,
        turns: stateTurns,
      };
    };
    gameBattlerBase.restoreStatesAndMeta = function (statesAndMeta) {
      this._states = statesAndMeta.ids;
      this._stateTurns = statesAndMeta.turns;
    };
  }
  Game_BattlerBase_EvacuateStateAndMetaMixIn(Game_BattlerBase.prototype);
  function Game_Actor_EvacuateStateAndMetaMixIn(gameActor) {
    gameActor.statesAndMetaForEvacuate = function (stateIds) {
      return {
        ...Game_BattlerBase.prototype.statesAndMetaForEvacuate.call(this, stateIds),
        steps: this.stateStepsForEvacuate(stateIds),
      };
    };
    gameActor.stateStepsForEvacuate = function (stateIds) {
      const stateSteps = {};
      stateIds.forEach((stateId) => {
        stateSteps[stateId] = this._stateSteps[stateId];
      });
      return stateSteps;
    };
    gameActor.restoreStatesAndMeta = function (statesAndMeta) {
      Game_BattlerBase.prototype.restoreStatesAndMeta.call(this, statesAndMeta);
      if (statesAndMeta.steps) {
        this._stateSteps = statesAndMeta.steps;
      }
    };
  }
  Game_Actor_EvacuateStateAndMetaMixIn(Game_Actor.prototype);
})();
