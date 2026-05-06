// DarkPlasma_StateWithDeath 2.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 2.0.0 ステート情報の退避を別プラグインに分離
 *                  戦闘不能を挟むとステート解除までの歩数情報が消えてしまう不具合を修正
 * 2023/11/18 1.1.0 TypeScript移行
 *                  戦闘不能後も継続するステート一覧を取得するインターフェース追加
 * 2022/05/29 1.0.1 戦闘時にエラーになる不具合を修正
 *            1.0.0 公開
 */

/*:
 * @plugindesc 戦闘不能になっても消えないステート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_EvacuateStateAndMeta
 * @orderAfter DarkPlasma_EvacuateStateAndMeta
 *
 * @param statesWithDeath
 * @text 消えないステート
 * @type state[]
 * @default []
 *
 * @help
 * version: 2.0.0
 * 指定したステートは戦闘不能になっても解除されません。
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
    statesWithDeath: pluginParameters.statesWithDeath
      ? JSON.parse(pluginParameters.statesWithDeath).map((e) => {
          return Number(e || 0);
        })
      : [],
  };

  const STATE_AND_META_KEY = 'withDeath';
  function Game_BattlerBase_StateWithDeathMixIn(gameBattlerBase) {
    const _die = gameBattlerBase.die;
    gameBattlerBase.die = function () {
      $gameTemp.evacuateStatesAndMeta(
        STATE_AND_META_KEY,
        this.statesAndMetaForEvacuate(this.continueStateIdsAfterDeath()),
      );
      _die.call(this);
      this.restoreStatesAndMeta($gameTemp.evacuatedStatesAndMeta(STATE_AND_META_KEY));
      $gameTemp.clearEvacuatedStatesAndMeta(STATE_AND_META_KEY);
    };
    gameBattlerBase.continueStateIdsAfterDeath = function () {
      return this._states.filter((stateId) => settings.statesWithDeath.includes(stateId));
    };
  }
  Game_BattlerBase_StateWithDeathMixIn(Game_BattlerBase.prototype);
})();
