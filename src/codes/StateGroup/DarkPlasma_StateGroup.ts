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
      group.states.forEach(stateGroup.addState);
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
}

Game_Battler_StateGroupMixIn(Game_Battler.prototype);
