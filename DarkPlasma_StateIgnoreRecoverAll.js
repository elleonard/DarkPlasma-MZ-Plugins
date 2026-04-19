// DarkPlasma_StateIgnoreRecoverAll 1.0.1
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/04/20 1.0.1 全回復すると指定ステートの歩数情報が消えてしまう不具合を修正
 * 2026/01/18 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 全回復で解除されないステート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param states
 * @desc 指定したステートは全回復で解除されません。
 * @text ステート
 * @type state[]
 * @default []
 *
 * @help
 * version: 1.0.1
 * イベントコマンド「全回復」で解除されないステートを実現します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    states: pluginParameters.states
      ? JSON.parse(pluginParameters.states).map((e) => {
          return Number(e || 0);
        })
      : [],
  };

  function Game_Temp_StateIgnoreRecoverAllMixIn(gameTemp) {
    gameTemp.evacuateStatesAndMeta = function (statesAndMeta) {
      this._evacuatedStatesAndMeta = statesAndMeta;
    };
    gameTemp.evacuatedStatesAndMeta = function () {
      return this._evacuatedStatesAndMeta;
    };
    gameTemp.clearEvacuatedStatesAndMeta = function () {
      this._evacuatedStatesAndMeta = undefined;
    };
  }
  Game_Temp_StateIgnoreRecoverAllMixIn(Game_Temp.prototype);
  function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase) {
    const _recoverAll = gameBattlerBase.recoverAll;
    gameBattlerBase.recoverAll = function () {
      $gameTemp.evacuateStatesAndMeta(this.statesAndMetaForIgnoreRecoverAll());
      _recoverAll.call(this);
      const evacuated = $gameTemp.evacuatedStatesAndMeta();
      this.restoreStatesAndMeta(evacuated);
      $gameTemp.clearEvacuatedStatesAndMeta();
    };
    gameBattlerBase.statesAndMetaForIgnoreRecoverAll = function () {
      const stateIds = this.stateIdsIgnoreRecoverAll();
      const stateTurns = {};
      stateIds.forEach((stateId) => {
        stateTurns[stateId] = this._stateTurns[stateId];
      });
      return {
        ids: stateIds,
        turns: stateTurns,
      };
    };
    gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
      return this._states.filter((stateId) => settings.states.includes(stateId));
    };
    gameBattlerBase.restoreStatesAndMeta = function (statesAndMeta) {
      this._states = statesAndMeta.ids;
      this._stateTurns = statesAndMeta.turns;
    };
  }
  Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);
  function Game_Actor_StateIgnoreRecoverAllMixIn(gameActor) {
    const _statesAndMetaForIgnoreRecoverAll = gameActor.statesAndMetaForIgnoreRecoverAll;
    gameActor.statesAndMetaForIgnoreRecoverAll = function () {
      return {
        ..._statesAndMetaForIgnoreRecoverAll.call(this),
        steps: this.stateStepsForIgnoreRecoverAll(),
      };
    };
    gameActor.stateStepsForIgnoreRecoverAll = function () {
      const stateIds = this.stateIdsIgnoreRecoverAll();
      const stateSteps = {};
      stateIds.forEach((stateId) => {
        stateSteps[stateId] = this._stateSteps[stateId];
      });
      return stateSteps;
    };
    const _restoreStatesAndMeta = gameActor.restoreStatesAndMeta;
    gameActor.restoreStatesAndMeta = function (statesAndMeta) {
      _restoreStatesAndMeta.call(this, statesAndMeta);
      if (statesAndMeta.steps) {
        this._stateSteps = statesAndMeta.steps;
      }
    };
  }
  Game_Actor_StateIgnoreRecoverAllMixIn(Game_Actor.prototype);
})();
