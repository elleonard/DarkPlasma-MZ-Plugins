// DarkPlasma_StateIgnoreRecoverAll 2.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 2.0.0 ステート情報の退避を別プラグインに分離
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
 * @base DarkPlasma_EvacuateStateAndMeta
 * @orderAfter DarkPlasma_EvacuateStateAndMeta
 *
 * @param states
 * @desc 指定したステートは全回復で解除されません。
 * @text ステート
 * @type state[]
 * @default []
 *
 * @help
 * version: 2.0.0
 * イベントコマンド「全回復」で解除されないステートを実現します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_EvacuateStateAndMeta version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_EvacuateStateAndMeta
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

  const STATE_AND_META_KEY = 'recoverAll';
  function Game_BattlerBase_StateIgnoreRecoverAllMixIn(gameBattlerBase) {
    const _recoverAll = gameBattlerBase.recoverAll;
    gameBattlerBase.recoverAll = function () {
      $gameTemp.evacuateStatesAndMeta(
        STATE_AND_META_KEY,
        this.statesAndMetaForEvacuate(this.stateIdsIgnoreRecoverAll()),
      );
      _recoverAll.call(this);
      const evacuated = $gameTemp.evacuatedStatesAndMeta(STATE_AND_META_KEY);
      this.restoreStatesAndMeta(evacuated);
      $gameTemp.clearEvacuatedStatesAndMeta(STATE_AND_META_KEY);
    };
    gameBattlerBase.stateIdsIgnoreRecoverAll = function () {
      return this._states.filter((stateId) => settings.states.includes(stateId));
    };
  }
  Game_BattlerBase_StateIgnoreRecoverAllMixIn(Game_BattlerBase.prototype);
})();
