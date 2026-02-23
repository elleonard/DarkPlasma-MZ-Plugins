/// <reference path="./PriorityStateGroup.d.ts" />

import { PriorityStateGroup_StateGroup, settings } from '../config/_build/DarkPlasma_PriorityStateGroup_parameters';
import { isState } from '../../../common/data/isState';

type StateAndPriority = {
  id: number;
  priority: number;
};

class PriorityStateGroup {
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
      this.states.push({id: stateId, priority});
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
    return priority === null
      ? []
      : this.states.filter((state) => state.priority >= priority).map((state) => state.id);
  }

  /**
   * @param {number} stateId
   * @return {number[]}
   */
  lowerOrEqualPriorityStateIds(stateId: number): number[] {
    const priority = this.priorityOf(stateId);
    return priority === null
      ? []
      : this.states.filter((state) => state.priority <= priority).map((state) => state.id);
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
    targetState.priority = priority;
  }
}

class PriorityStateGroupManager {
  static initialStateGroup(): PriorityStateGroup[] {
    return settings.groups.map((group: PriorityStateGroup_StateGroup) => {
      const stateGroup = new PriorityStateGroup(group.name);
      group.states.forEach((stateId, priority) => stateGroup.addState(stateId, priority));
      return stateGroup;
    });
  }

  static newGroup(name: string) {
    const result = new PriorityStateGroup(name);
    $dataPriorityStateGroups.push(result);
    return result;
  }

  static addStateToGroup(groupName: string, stateId: number, priority: number) {
    const targetGroup = this.groupByName(groupName) || this.newGroup(groupName);
    targetGroup.addState(stateId, priority);
  }

  static groupListByState(stateId: number): PriorityStateGroup[] {
    return $dataPriorityStateGroups.filter((group) => group.hasState(stateId));
  }

  static groupByName(name: string): PriorityStateGroup | null {
    return $dataPriorityStateGroups.find((group) => group.name === name) || null;
  }

  /**
   * ステート同士の優先度を比較する際に用いるグループ
   */
  static groupForComparePriority(stateIdA: number, stateIdB: number) {
    return this.groupListByState(stateIdA).find(group => group.hasState(stateIdB));
  }
}

const $dataPriorityStateGroups: PriorityStateGroup[] = PriorityStateGroupManager.initialStateGroup();

function DataManager_StateGroupMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (isState(data)) {
      if (data.meta.stateGroup && data.meta.statePriority) {
        PriorityStateGroupManager.addStateToGroup(
          String(data.meta.stateGroup).trim(),
          data.id,
          Number(data.meta.statePriority || 0)
        );
      }
    }
  };
}

DataManager_StateGroupMixIn(DataManager);

function Game_Battler_StateGroupMixIn(gameBattler: Game_Battler) {
  const _addState = gameBattler.addState;
  gameBattler.addState = function (this: Game_Battler, stateId) {
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

  gameBattler.isHigherOrEqualPriorityStateAffected = function (this: Game_Battler, stateId) {
    return PriorityStateGroupManager.groupListByState(stateId).some((group) => {
      return group.higherOrEqualPriorityStateIds(stateId).some((id) => this.states().some((state) => state.id === id));
    });
  };

  /**
   * かかっているステートの中で、
   * 指定したステートIDと同じグループに属する、優先度の低いステートID一覧を返す
   */
  gameBattler.lowerOrEqualPriorityStateIds = function (this: Game_Battler, stateId: number): number[] {
    return PriorityStateGroupManager.groupListByState(stateId)
      .map((group) => {
        return group.lowerOrEqualPriorityStateIds(stateId)
          .filter((id) => this.states().some((state) => state.id === id));
      })
      .flat();
  };
}

Game_Battler_StateGroupMixIn(Game_Battler.prototype);
