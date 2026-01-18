// DarkPlasma_StateIgnoreRecoverAll 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * version: 1.0.0
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

  function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase) {
    const _recoverAll = gameBattlerBase.recoverAll;
    gameBattlerBase.recoverAll = function () {
      const continueStates = this.stateIdsIgnoreRecoverAll();
      const continueStateTurns = {};
      continueStates.forEach((stateId) => (continueStateTurns[stateId] = this._stateTurns[stateId]));
      _recoverAll.call(this);
      this._states = continueStates;
      this._stateTurns = continueStateTurns;
    };
    gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
      return this._states.filter((stateId) => settings.states.includes(stateId));
    };
  }
  Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);
})();
