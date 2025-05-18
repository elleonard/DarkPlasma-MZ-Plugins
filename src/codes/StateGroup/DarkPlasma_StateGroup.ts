/// <reference path="./StateGroup.d.ts" />

import { settings } from './_build/DarkPlasma_StateGroup_parameters';
import { isState } from '../../common/data/isState';

class StateAndPriority {
  _stateId: number;
  _priority: number;

  constructor(stateId: number, priority: number) {
    this._stateId = stateId;
    this._priority = priority;
  }

  /**
   * @return {number}
   */
  get id(): number {
    return this._stateId;
  }

  /**
   * @return {number}
   */
  get priority(): number {
    return this._priority;
  }

  /**
   * @param {number} priority
   */
  setPriority(priority: number) {
    this._priority = priority;
  }

  hasHigherPriority(other: StateAndPriority) {
    return this.priority > other.priority;
  }
}

class StateGroup {
  _name: string;
  _states: StateAndPriority[];

  constructor(name: string) {
    this._name = name;
    this._states = [];
  }

  /**
   * @return {string}
   */
  get name(): string {
    return this._name;
  }

  /**
   * @return {StateAndPriority[]}
   */
  get states(): StateAndPriority[] {
    return this._states;
  }

  /**
   * @param {number} stateId
   * @param {number} priority
   */
  addState(stateId: number, priority: number) {
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
  hasState(stateId: number): boolean {
    return this.states.some((state) => state.id === stateId);
  }

  /**
   * @param {number} stateId
   * @return {number[]}
   */
  higherOrEqualPriorityStateIds(stateId: number): number[] {
    const priority = this.priorityOf(stateId);
    return priority === null ? [] : this.states.filter((state) => state.priority >= priority).map((state) => state.id);
  }

  /**
   * @param {number} stateId
   * @return {number[]}
   */
  lowerPriorityStateIds(stateId: number): number[] {
    const priority = this.priorityOf(stateId);
    return priority === null ? [] : this.states.filter((state) => state.priority < priority).map((state) => state.id);
  }

  higherPriorityStateIdIn(a: number, b: number) {
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
  highestPriorityStateIdIn(stateIds: number[]) {
    return stateIds.reduce((result, current) => {
      return this.higherPriorityStateIdIn(result, current) || 0;
    }, 0);
  }

  /**
   * @param {number} stateId
   * @return {number|null}
   */
  priorityOf(stateId: number): number | null {
    const targetState = this.states.find((state) => state.id === stateId);
    return targetState ? targetState.priority : null;
  }

  /**
   * @param {number} stateId
   * @param {number} priority
   */
  setPriorityOf(stateId: number, priority: number) {
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
  static initialStateGroup(): StateGroup[] {
    return settings.groups.map((group: StateGroupSetting) => {
      const stateGroup = new StateGroup(group.name);
      group.states.forEach((stateId, priority) => stateGroup.addState(stateId, priority));
      return stateGroup;
    });
  }

  static newGroup(name: string) {
    const result = new StateGroup(name);
    $dataStateGroups.push(result);
    return result;
  }

  /**
   * @param {string} groupName
   * @param {number} stateId
   * @param {number} priority
   */
  static addStateToGroup(groupName: string, stateId: number, priority: number) {
    const targetGroup = this.groupByName(groupName) || this.newGroup(groupName);
    targetGroup.addState(stateId, priority);
  }

  /**
   * @param {number} stateId
   * @return {StateGroup[]}
   */
  static groupListByState(stateId: number): StateGroup[] {
    return $dataStateGroups.filter((group) => group.hasState(stateId));
  }

  /**
   * @param {string} name
   * @return {StateGroup}
   */
  static groupByName(name: string): StateGroup | null {
    return $dataStateGroups.find((group) => group.name === name) || null;
  }

  /**
   * ステート同士の優先度を比較する際に用いるグループ
   */
  static groupForComparePriority(stateIdA: number, stateIdB: number) {
    return this.groupListByState(stateIdA).find(group => group.hasState(stateIdB));
  }
}

/**
 * @type {StateGroup[]}
 */
const $dataStateGroups: StateGroup[] = StateGroupManager.initialStateGroup();

/**
 * @param {typeof DataManager} dataManager
 */
function DataManager_StateGroupMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (isState(data)) {
      if (data.meta.StateGroup) {
        StateGroupManager.addStateToGroup(String(data.meta.StateGroup), data.id, Number(data.meta.StatePriority || 0));
      }
    }
  };
}

DataManager_StateGroupMixIn(DataManager);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_StateGroupMixIn(gameBattler: Game_Battler) {
  const _addState = gameBattler.addState;
  gameBattler.addState = function (this: Game_Battler, stateId) {
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
  gameBattler.isHigherOrEqualPriorityStateAffected = function (this: Game_Battler, stateId) {
    return StateGroupManager.groupListByState(stateId).some((group) => {
      return group.higherOrEqualPriorityStateIds(stateId).some((id) => this.states().some((state) => state.id === id));
    });
  };

  /**
   * かかっているステートの中で、
   * 指定したステートIDと同じグループに属する、優先度の低いステートID一覧を返す
   * @param {number} stateId
   * @return {number[]}
   */
  gameBattler.lowerPriorityStateIds = function (this: Game_Battler, stateId: number): number[] {
    return StateGroupManager.groupListByState(stateId)
      .map((group) => {
        return group.lowerPriorityStateIds(stateId).filter((id) => this.states().some((state) => state.id === id));
      })
      .flat();
  };

  const _statesOnBattleStart = gameBattler.statesOnBattleStart;
  gameBattler.statesOnBattleStart = function () {
    const statesOnBattleStart = _statesOnBattleStart.call(this);
    return statesOnBattleStart.filter(stateOnBattleStart => {
      const groupA = StateGroupManager.groupByName(String($dataStates[stateOnBattleStart.stateId].meta.OverwriteStateGroup));
      if (groupA) {
        /**
         * ステートAはステートBの属するグループAを上書きする
         * ステートAの属するグループBを上書きするようなステートBが同時にかかる場合、
         * - ステートAとBが同一グループに属していれば、その中で優先度の高いほうのみをかける (両方とも複数の同一グループに属している場合、先に定義されたグループの優先度を用いる)
         * - ステートAとBが同一グループに属していなければ、実装依存で片方のみかける (後で処理するほうが上書きする)
         */
        const groupBList = StateGroupManager.groupListByState(stateOnBattleStart.stateId);
        return statesOnBattleStart
          .filter(s => {
            const overWriteGroup = StateGroupManager.groupByName(String($dataStates[s.stateId].meta.OverwriteStateGroup));
            return overWriteGroup && groupBList.includes(overWriteGroup);
          })
          .map(s => s.stateId)
          .every(stateB => {
            const group = StateGroupManager.groupForComparePriority(stateOnBattleStart.stateId, stateB);
            return !group || group.higherPriorityStateIdIn(stateOnBattleStart.stateId, stateB) === stateOnBattleStart.stateId;
          });
      }
      return true;
    });
  };
}

Game_Battler_StateGroupMixIn(Game_Battler.prototype);
