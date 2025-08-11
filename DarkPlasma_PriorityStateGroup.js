// DarkPlasma_PriorityStateGroup 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/11 1.0.0 StateGroupから機能分離
 *                  グループに対する優位を廃止
 */

/*:
 * @plugindesc 優先度付きステートグループ
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param groups
 * @text グループ
 * @type struct<StateGroup>[]
 * @default []
 *
 * @help
 * version: 1.0.0
 *
 * ステートを優先度付きのグループに分類します。
 * 同じ優先度付きグループに属するステートは重ねがけできません。
 *
 * グループの定義
 * プラグインパラメータで定義できます。
 *
 * ステートの優先度
 * プラグインパラメータによる設定の順番がそのまま優先度になります。
 * （下にあるほど優先度が高い）
 * あるステートにかかる際、
 * 同じグループのより優先度の低いステートを上書きします。
 *
 * メモ欄による設定
 *
 * グループへの所属
 * <stateGroup: x>
 * <statePriority: y>
 * 対象ステートをあるグループに所属させることができます。
 * （xはグループ名）
 * 複数のグループに所属させる場合は、
 * プラグインパラメータによる設定を利用してください。
 *
 * グループ内での優先度をyに設定します。
 * 数値が大きいほど優先度が高くなります。
 * stateGroupメモタグを指定しない場合、本メモタグの効果はありません。
 * stateGroupメモタグを指定し、本メモタグを指定しなかった場合、
 * 優先度付きグループには所属しません。
 * 複数のステートが同一の優先度を持つ場合、
 * 後に付加されるステートで上書きされます。
 */
/*~struct~StateGroup:
 * @param name
 * @desc グループの名前を指定します。半角スペース及びカンマは無視されます。
 * @text グループ名
 * @type string
 *
 * @param states
 * @desc 所属するステートを優先度順に設定します。下にあるほど優先度が高くなります。
 * @text 所属ステート
 * @type state[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    groups: pluginParameters.groups
      ? JSON.parse(pluginParameters.groups).map((e) => {
          return e
            ? ((parameter) => {
                const parsed = JSON.parse(parameter);
                return {
                  name: String(parsed.name || ``),
                  states: parsed.states
                    ? JSON.parse(parsed.states).map((e) => {
                        return Number(e || 0);
                      })
                    : [],
                };
              })(e)
            : { name: '', states: [] };
        })
      : [],
  };

  function isState(data) {
    return $dataStates && $dataStates.includes(data);
  }

  class PriorityStateGroup {
    constructor(name) {
      this._name = name;
      this._states = [];
    }
    /**
     * @return {string}
     */
    get name() {
      return this._name;
    }
    /**
     * @return {StateAndPriority[]}
     */
    get states() {
      return this._states;
    }
    /**
     * @param {number} stateId
     * @param {number} priority
     */
    addState(stateId, priority) {
      if (this.priorityOf(stateId) === null) {
        this.states.push({ id: stateId, priority });
      } else {
        // 設定済みの場合は上書きする
        this.setPriorityOf(stateId, priority);
      }
    }
    /**
     * @param {number} stateId
     * @return {boolean}
     */
    hasState(stateId) {
      return this.states.some((state) => state.id === stateId);
    }
    /**
     * @param {number} stateId
     * @return {number[]}
     */
    higherOrEqualPriorityStateIds(stateId) {
      const priority = this.priorityOf(stateId);
      return priority === null
        ? []
        : this.states.filter((state) => state.priority >= priority).map((state) => state.id);
    }
    /**
     * @param {number} stateId
     * @return {number[]}
     */
    lowerOrEqualPriorityStateIds(stateId) {
      const priority = this.priorityOf(stateId);
      return priority === null
        ? []
        : this.states.filter((state) => state.priority <= priority).map((state) => state.id);
    }
    higherPriorityStateIdIn(a, b) {
      const priorityOfA = this.priorityOf(a);
      const priorityOfB = this.priorityOf(b);
      if (priorityOfA === null && priorityOfB === null) {
        return null;
      } else if (priorityOfB === null) {
        return a;
      } else if (priorityOfA === null) {
        return b;
      }
      return priorityOfA > priorityOfB ? a : b;
    }
    /**
     * 指定された配列の中で、グループ内で最も優先度の高いステートIDを返す
     * グループ内に所属するステートIDが存在しない場合は0を返す
     */
    highestPriorityStateIdIn(stateIds) {
      return stateIds.reduce((result, current) => {
        return this.higherPriorityStateIdIn(result, current) || 0;
      }, 0);
    }
    /**
     * @param {number} stateId
     * @return {number|null}
     */
    priorityOf(stateId) {
      const targetState = this.states.find((state) => state.id === stateId);
      return targetState ? targetState.priority : null;
    }
    /**
     * @param {number} stateId
     * @param {number} priority
     */
    setPriorityOf(stateId, priority) {
      const targetState = this.states.find((state) => state.id === stateId);
      if (!targetState) {
        throw Error(`グループ ${this.name} にステート ${$dataStates[stateId].name} が存在しません。`);
      }
      targetState.priority = priority;
    }
  }
  class PriorityStateGroupManager {
    static initialStateGroup() {
      return settings.groups.map((group) => {
        const stateGroup = new PriorityStateGroup(group.name);
        group.states.forEach((stateId, priority) => stateGroup.addState(stateId, priority));
        return stateGroup;
      });
    }
    static newGroup(name) {
      const result = new PriorityStateGroup(name);
      $dataPriorityStateGroups.push(result);
      return result;
    }
    static addStateToGroup(groupName, stateId, priority) {
      const targetGroup = this.groupByName(groupName) || this.newGroup(groupName);
      targetGroup.addState(stateId, priority);
    }
    static groupListByState(stateId) {
      return $dataPriorityStateGroups.filter((group) => group.hasState(stateId));
    }
    static groupByName(name) {
      return $dataPriorityStateGroups.find((group) => group.name === name) || null;
    }
    /**
     * ステート同士の優先度を比較する際に用いるグループ
     */
    static groupForComparePriority(stateIdA, stateIdB) {
      return this.groupListByState(stateIdA).find((group) => group.hasState(stateIdB));
    }
  }
  const $dataPriorityStateGroups = PriorityStateGroupManager.initialStateGroup();
  function DataManager_StateGroupMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isState(data)) {
        if (data.meta.stateGroup && data.meta.statePriority) {
          PriorityStateGroupManager.addStateToGroup(
            String(data.meta.stateGroup).trim(),
            data.id,
            Number(data.meta.statePriority || 0),
          );
        }
      }
    };
  }
  DataManager_StateGroupMixIn(DataManager);
  function Game_Battler_StateGroupMixIn(gameBattler) {
    const _addState = gameBattler.addState;
    gameBattler.addState = function (stateId) {
      /**
       * 優先度の低い同グループステートにかかっている場合は上書き
       */
      const lowerPriorityStateIds = this.lowerOrEqualPriorityStateIds(stateId);
      lowerPriorityStateIds.forEach((lowerPriorityStateId) => this.eraseState(lowerPriorityStateId));
      _addState.call(this, stateId);
    };
    const _isStateAddable = gameBattler.isStateAddable;
    gameBattler.isStateAddable = function (stateId) {
      // 優先度の高いか同じ同グループステートにかかっている場合はそのステートにかからない
      return _isStateAddable.call(this, stateId) && !this.isHigherOrEqualPriorityStateAffected(stateId);
    };
    gameBattler.isHigherOrEqualPriorityStateAffected = function (stateId) {
      return PriorityStateGroupManager.groupListByState(stateId).some((group) => {
        return group
          .higherOrEqualPriorityStateIds(stateId)
          .some((id) => this.states().some((state) => state.id === id));
      });
    };
    /**
     * かかっているステートの中で、
     * 指定したステートIDと同じグループに属する、優先度の低いステートID一覧を返す
     */
    gameBattler.lowerOrEqualPriorityStateIds = function (stateId) {
      return PriorityStateGroupManager.groupListByState(stateId)
        .map((group) => {
          return group
            .lowerOrEqualPriorityStateIds(stateId)
            .filter((id) => this.states().some((state) => state.id === id));
        })
        .flat();
    };
  }
  Game_Battler_StateGroupMixIn(Game_Battler.prototype);
})();
