// DarkPlasma_StateWithDeath 1.0.1
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/05/29 1.0.1 戦闘時にエラーになる不具合を修正
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc 戦闘不能になっても消えないステート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param statesWithDeath
 * @text 消えないステート
 * @type state[]
 * @default []
 *
 * @help
 * version: 1.0.1
 * 指定したステートは戦闘不能になっても解除されません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    statesWithDeath: JSON.parse(pluginParameters.statesWithDeath || '[]').map((e) => {
      return Number(e || 0);
    }),
  };

  /**
   * @param {Game_BattlerBase.prototype} gameBattlerBase
   */
  function Game_BattlerBase_StateWithDeathMixIn(gameBattlerBase) {
    const _die = gameBattlerBase.die;
    gameBattlerBase.die = function () {
      const continueStates = this._states.filter((stateId) => settings.statesWithDeath.includes(stateId));
      const continueStateTurns = {};
      continueStates.forEach((stateId) => (continueStateTurns[stateId] = this._stateTurns[stateId]));
      _die.call(this);
      this._states = continueStates;
      this._stateTurns = continueStateTurns;
    };
  }

  Game_BattlerBase_StateWithDeathMixIn(Game_BattlerBase.prototype);
})();
