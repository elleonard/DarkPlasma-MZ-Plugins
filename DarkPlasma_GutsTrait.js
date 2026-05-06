// DarkPlasma_GutsTrait 1.0.1
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 1.0.1 ステートが解除されても食いしばり回数が残り続ける不具合を修正
 *            1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 食いしばり特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 * @base DarkPlasma_StateWithValue
 *
 * @help
 * version: 1.0.1
 * 特徴「食いしばり」を提供します。
 *
 * 食いしばり特徴を持つバトラーは、戦闘中にHPが0になる際に
 * 戦闘不能になる代わりにHPを1にし、食いしばり回数を1消費します。
 *
 * 食いしばり回数は以下のタイミングで特徴に応じて獲得します。
 * - 戦闘開始時(装備などですでに得ていた特徴)
 * - ステート付加(ステートの特徴)
 *
 * ステートの持つ食いしばり回数は個別に管理されます。
 * 残り回数の少ないステートの持つ回数を優先して消費します。
 *
 * <guts:1>
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に記述すると、
 * 食いしばり回数1の食いしばり特徴を設定します。
 *
 * <removeByGutsZero>
 * ステートのメモ欄に記述すると
 * 解除条件「食いしばり発動後、ステートの食いしばり回数が0になった時に解除」を設定します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.2
 * DarkPlasma_StateWithValue version:1.0.0
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  function isState(data) {
    return $dataStates && $dataStates.includes(data);
  }

  const gutsTrait = uniqueTraitIdCache.allocate(pluginName, 0, '食いしばり');
  function DataManager_GutsTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data) && data.meta.guts) {
        data.traits.push({
          code: gutsTrait.id,
          dataId: 0,
          value: Number(data.meta.guts || 0),
        });
      }
      if (isState(data) && data.meta.removeByGutsZero) {
        data.removeByGutsZero = true;
      }
    };
  }
  DataManager_GutsTraitMixIn(DataManager);
  function Game_BattlerBase_GutsTraitMixIn(gameBattlerBase) {
    const _refresh = gameBattlerBase.refresh;
    gameBattlerBase.refresh = function () {
      _refresh.call(this);
      if ($gameParty.inBattle() && this.hp === 0 && this.gutsCount() > 0) {
        this._hp = 1;
        this.decreaseGuts();
      }
    };
    gameBattlerBase.initializeGuts = function () {
      this._gutsCount = this.initialGutsCountWithoutState();
    };
    gameBattlerBase.initialGutsCountWithoutState = function () {
      return this.traitsSum(gutsTrait.id, 0) - this.totalStateValue('guts');
    };
    gameBattlerBase.gutsCount = function () {
      return (this._gutsCount || 0) + this.totalStateValue('guts');
    };
    gameBattlerBase.addGutsCount = function (count) {
      if (!this._gutsCount) {
        this._gutsCount = this.initialGutsCountWithoutState();
      }
      this._gutsCount += count;
    };
    gameBattlerBase.decreaseGuts = function () {
      if (this.gutsCount() > 0) {
        const minimumGutsCountState = this.minimumGutsCountState();
        if (minimumGutsCountState) {
          this.addStateValue(minimumGutsCountState.id, 'guts', -1);
          if (this.stateValue(minimumGutsCountState.id, 'guts') === 0) {
            this.onGutsZero(minimumGutsCountState.id);
          }
        } else if (this._gutsCount) {
          this._gutsCount--;
        }
      }
    };
    gameBattlerBase.onGutsZero = function () {};
    const _addNewState = gameBattlerBase.addNewState;
    gameBattlerBase.addNewState = function (stateId) {
      _addNewState.call(this, stateId);
      const gutsCount = Number($dataStates[stateId].meta.guts || 0);
      if (gutsCount) {
        this.addStateValue(stateId, 'guts', gutsCount);
      }
    };
    gameBattlerBase.minimumGutsCountState = function () {
      return this.states()
        .filter((state) => this.stateValue(state.id, 'guts') > 0)
        .reduce((prev, current) => {
          if (!prev) {
            return current;
          }
          const prevGuts = this.stateValue(prev.id, 'guts');
          const currentGuts = this.stateValue(current.id, 'guts');
          if (prevGuts > currentGuts) {
            return prev;
          } else {
            return current;
          }
        }, undefined);
    };
  }
  Game_BattlerBase_GutsTraitMixIn(Game_BattlerBase.prototype);
  function Game_Battler_GutsTraitMixIn(gameBattler) {
    const _onBattleStart = gameBattler.onBattleStart;
    gameBattler.onBattleStart = function (advantageous) {
      _onBattleStart.call(this, advantageous);
      this.initializeGuts();
    };
    gameBattler.onGutsZero = function (stateId) {
      if ($dataStates[stateId].removeByGutsZero) {
        this.removeState(stateId);
      }
    };
  }
  Game_Battler_GutsTraitMixIn(Game_Battler.prototype);
})();
