// DarkPlasma_StateGroup 1.2.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/10/15 1.2.0 DarkPlasma_StateBuffOnBattleStartにおけるグループに対する優位の挙動を定義
 * 2022/10/10 1.1.1 typescript移行
 * 2022/06/21 1.1.0 ステートを複数グループに所属させる
 *                  グループに対する優位設定
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc ステートをグルーピングする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_StateBuffOnBattleStart
 *
 * @param groups
 * @text グループ
 * @type struct<StateGroup>[]
 * @default []
 *
 * @help
 * version: 1.2.0
 * ステートをグルーピングします。
 * 同じグループに属するステートは重ねがけできません。
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
 * <StateGroup: x>
 * 対象ステートをあるグループに所属させることができます。
 * （xはグループ名）
 * 同名タグは単一のステートについてひとつずつしか設定できません。
 * StateGroupメモタグで所属させることができるグループは
 * ステートごとにひとつだけです。
 *
 * 優先度の設定
 * <StatePriority: x>
 * StateGroupメモタグによって所属させたグループ内での優先度をxに設定します。
 * 数値が大きいほど優先度が高くなります。
 * StateGroupメモタグを指定しない場合、本メモタグの効果はありません。
 * StateGroupメモタグを指定し、本メモタグを指定しなかった場合、
 * 優先度は0になります。
 *
 * グループに対する優位
 * <OverwriteStateGroup: x>
 * そのステートにかかる際、グループxのステートを無条件で上書きします。
 * DarkPlasma_StateBuffOnBattleStartで戦闘開始時に、
 * 互いを上書きするようなステートA,Bに同時にかかる場合の挙動は以下の通りです。
 * - A,Bが同一グループに属している場合、優先度の高いステートのみかける
 * - A,Bが同一グループに属していない場合、どちらか一方のみかける
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_StateBuffOnBattleStart
 */
/*~struct~StateGroup:
 * @param name
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
    groups: JSON.parse(pluginParameters.groups || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          name: String(parsed.name || ''),
          states: JSON.parse(parsed.states || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
  };

  function isState(data) {
    return $dataStates && $dataStates.includes(data);
  }

  class StateAndPriority {
    constructor(stateId, priority) {
      this._stateId = stateId;
      this._priority = priority;
    }
    /**
     * @return {number}
     */
    get id() {
      return this._stateId;
    }
    /**
     * @return {number}
     */
    get priority() {
      return this._priority;
    }
    /**
     * @param {number} priority
     */
    setPriority(priority) {
      this._priority = priority;
    }
    hasHigherPriority(other) {
      return this.priority > other.priority;
    }
  }
  class StateGroup {
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
        this.states.push(new StateAndPriority(stateId, priority));
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
    lowerPriorityStateIds(stateId) {
      const priority = this.priorityOf(stateId);
      return priority === null ? [] : this.states.filter((state) => state.priority < priority).map((state) => state.id);
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
      targetState.setPriority(priority);
    }
  }
  class StateGroupManager {
    /**
     * @return {StateGroup[]}
     */
    static initialStateGroup() {
      return settings.groups.map((group) => {
        const stateGroup = new StateGroup(group.name);
        group.states.forEach(stateGroup.addState);
        return stateGroup;
      });
    }
    static newGroup(name) {
      const result = new StateGroup(name);
      $dataStateGroups.push(result);
      return result;
    }
    /**
     * @param {string} groupName
     * @param {number} stateId
     * @param {number} priority
     */
    static addStateToGroup(groupName, stateId, priority) {
      const targetGroup = this.groupByName(groupName) || this.newGroup(groupName);
      targetGroup.addState(stateId, priority);
    }
    /**
     * @param {number} stateId
     * @return {StateGroup[]}
     */
    static groupListByState(stateId) {
      return $dataStateGroups.filter((group) => group.hasState(stateId));
    }
    /**
     * @param {string} name
     * @return {StateGroup}
     */
    static groupByName(name) {
      return $dataStateGroups.find((group) => group.name === name) || null;
    }
    /**
     * ステート同士の優先度を比較する際に用いるグループ
     */
    static groupForComparePriority(stateIdA, stateIdB) {
      return this.groupListByState(stateIdA).find((group) => group.hasState(stateIdB));
    }
  }
  /**
   * @type {StateGroup[]}
   */
  const $dataStateGroups = StateGroupManager.initialStateGroup();
  /**
   * @param {typeof DataManager} dataManager
   */
  function DataManager_StateGroupMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isState(data)) {
        if (data.meta.StateGroup) {
          StateGroupManager.addStateToGroup(
            String(data.meta.StateGroup),
            data.id,
            Number(data.meta.StatePriority || 0)
          );
        }
      }
    };
  }
  DataManager_StateGroupMixIn(DataManager);
  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_StateGroupMixIn(gameBattler) {
    const _addState = gameBattler.addState;
    gameBattler.addState = function (stateId) {
      /**
       * 優先度の低い同グループステートにかかっている場合は上書き
       */
      const lowerPriorityStateIds = this.lowerPriorityStateIds(stateId);
      lowerPriorityStateIds.forEach((lowerPriorityStateId) => this.eraseState(lowerPriorityStateId));
      /**
       * グループ上書き設定
       */
      if ($dataStates[stateId].meta.OverwriteStateGroup) {
        const group = StateGroupManager.groupByName(String($dataStates[stateId].meta.OverwriteStateGroup));
        if (group) {
          this.states()
            .filter((state) => state.id !== stateId && group.hasState(state.id))
            .forEach((state) => this.eraseState(state.id));
        }
      }
      _addState.call(this, stateId);
    };
    const _isStateAddable = gameBattler.isStateAddable;
    gameBattler.isStateAddable = function (stateId) {
      // 優先度の高いか同じ同グループステートにかかっている場合はそのステートにかからない
      return _isStateAddable.call(this, stateId) && !this.isHigherOrEqualPriorityStateAffected(stateId);
    };
    /**
     * 同じグループに属する優先度の高いステートにかかっているかどうか
     */
    gameBattler.isHigherOrEqualPriorityStateAffected = function (stateId) {
      return StateGroupManager.groupListByState(stateId).some((group) => {
        return group
          .higherOrEqualPriorityStateIds(stateId)
          .some((id) => this.states().some((state) => state.id === id));
      });
    };
    /**
     * かかっているステートの中で、
     * 指定したステートIDと同じグループに属する、優先度の低いステートID一覧を返す
     * @param {number} stateId
     * @return {number[]}
     */
    gameBattler.lowerPriorityStateIds = function (stateId) {
      return StateGroupManager.groupListByState(stateId)
        .map((group) => {
          return group.lowerPriorityStateIds(stateId).filter((id) => this.states().some((state) => state.id === id));
        })
        .flat();
    };
    const _statesOnBattleStart = gameBattler.statesOnBattleStart;
    gameBattler.statesOnBattleStart = function () {
      const statesOnBattleStart = _statesOnBattleStart.call(this);
      return statesOnBattleStart.filter((stateOnBattleStart) => {
        const groupA = StateGroupManager.groupByName(
          String($dataStates[stateOnBattleStart.stateId].meta.OverwriteStateGroup)
        );
        if (groupA) {
          /**
           * ステートAはステートBの属するグループAを上書きする
           * ステートAの属するグループBを上書きするようなステートBが同時にかかる場合、
           * - ステートAとBが同一グループに属していれば、その中で優先度の高いほうのみをかける (両方とも複数の同一グループに属している場合、先に定義されたグループの優先度を用いる)
           * - ステートAとBが同一グループに属していなければ、実装依存で片方のみかける (後で処理するほうが上書きする)
           */
          const groupBList = StateGroupManager.groupListByState(stateOnBattleStart.stateId);
          return statesOnBattleStart
            .filter((s) => {
              const overWriteGroup = StateGroupManager.groupByName(
                String($dataStates[s.stateId].meta.OverwriteStateGroup)
              );
              return overWriteGroup && groupBList.includes(overWriteGroup);
            })
            .map((s) => s.stateId)
            .every((stateB) => {
              const group = StateGroupManager.groupForComparePriority(stateOnBattleStart.stateId, stateB);
              return (
                !group ||
                group.higherPriorityStateIdIn(stateOnBattleStart.stateId, stateB) === stateOnBattleStart.stateId
              );
            });
        }
        return true;
      });
    };
  }
  Game_Battler_StateGroupMixIn(Game_Battler.prototype);
})();
