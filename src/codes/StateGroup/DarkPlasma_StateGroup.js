import { settings } from './_build/DarkPlasma_StateGroup_parameters';

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
    return priority === null ? [] : this.states.filter((state) => state.priority >= priority).map((state) => state.id);
  }

  /**
   * @param {number} stateId
   * @return {number[]}
   */
  lowerPriorityStateIds(stateId) {
    const priority = this.priorityOf(stateId);
    return priority === null ? [] : this.states.filter((state) => state.priority < priority).map((state) => state.id);
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
    return $dataStateGroups.find((group) => group.name === name);
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
    if (this.isState(data)) {
      if (data.meta.StateGroup) {
        StateGroupManager.addStateToGroup(data.meta.StateGroup, data.id, Number(data.meta.StatePriority || 0));
      }
    }
  };

  dataManager.isState = function (data) {
    return $dataStates && $dataStates.includes(data);
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
      const group = StateGroupManager.groupByName($dataStates[stateId].meta.OverwriteStateGroup);
      this.states()
        .filter((state) => state.id !== stateId && group.hasState(state.id))
        .forEach((state) => this.eraseState(state.id));
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
      return group.higherOrEqualPriorityStateIds(stateId).some((id) => this.states().some((state) => state.id === id));
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

  /**
   * かかっているステートの中で、同じグループに属するステートを取得する
   * @param {number} stateId
   */
  gameBattler.affectedSameGroupState = function (stateId) {
    return this.states().find((activeState) => activeState.stateGroup === $dataStates[stateId].stateGroup);
  };
}

Game_Battler_StateGroupMixIn(Game_Battler.prototype);
