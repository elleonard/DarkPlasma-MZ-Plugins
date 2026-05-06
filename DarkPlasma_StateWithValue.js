// DarkPlasma_StateWithValue 1.1.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/06 1.1.0 特定種別の値合計を取得するインターフェースを追加
 *            1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 値付きステート
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_EvacuateStateAndMeta
 *
 * @help
 * version: 1.1.0
 * ステートに値を持たせる機能を提供します。
 * 本プラグインは単体では動作しません。
 * 本プラグインの機能は拡張プラグインから利用されます。
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_EvacuateStateAndMeta
 */

(() => {
  'use strict';

  function DataManager_StateWithValueMixIn(dataManager) {
    dataManager.maxStateValue = function (stateId, valueType) {
      return Infinity;
    };
    dataManager.minStateValue = function (stateId, valueType) {
      return 0;
    };
  }
  DataManager_StateWithValueMixIn(DataManager);
  function Game_BattlerBase_StateWithValueMixIn(gameBattlerBase) {
    const _clearStates = gameBattlerBase.clearStates;
    gameBattlerBase.clearStates = function () {
      _clearStates.call(this);
      this._stateValues = {};
    };
    const _eraseState = gameBattlerBase.eraseState;
    gameBattlerBase.eraseState = function (stateId) {
      _eraseState.call(this, stateId);
      delete this._stateValues?.[stateId];
    };
    gameBattlerBase.setStateValue = function (stateId, valueType, value) {
      if (!this._stateValues) {
        this._stateValues = {};
      }
      if (!this._stateValues[stateId]) {
        this._stateValues[stateId] = {};
      }
      this._stateValues[stateId][valueType] = value.clamp(
        DataManager.minStateValue(stateId, valueType),
        DataManager.maxStateValue(stateId, valueType),
      );
    };
    gameBattlerBase.addStateValue = function (stateId, valueType, value) {
      this.setStateValue(stateId, valueType, this.stateValue(stateId, valueType) + value);
    };
    gameBattlerBase.stateValue = function (stateId, valueType) {
      return this._stateValues?.[stateId]?.[valueType] || 0;
    };
    gameBattlerBase.totalStateValue = function (valueType) {
      return this.states().reduce((value, state) => value + this.stateValue(state.id, valueType), 0);
    };
    gameBattlerBase.stateValuesForEvacuate = function (stateIds) {
      const result = {};
      stateIds.forEach((stateId) => {
        const values = this._stateValues?.[stateId];
        if (values) {
          result[stateId] = values;
        }
      });
      return result;
    };
    const _statesAndMetaForEvacuate = gameBattlerBase.statesAndMetaForEvacuate;
    gameBattlerBase.statesAndMetaForEvacuate = function (stateIds) {
      return {
        ..._statesAndMetaForEvacuate.call(this, stateIds),
        values: this.stateValuesForEvacuate(stateIds),
      };
    };
    const _restoreStatesAndMeta = gameBattlerBase.restoreStatesAndMeta;
    gameBattlerBase.restoreStatesAndMeta = function (statesAndMeta) {
      _restoreStatesAndMeta.call(this, statesAndMeta);
      if (statesAndMeta.values) {
        this._stateValues = statesAndMeta.values;
      }
    };
  }
  Game_BattlerBase_StateWithValueMixIn(Game_BattlerBase.prototype);
})();
