/// <reference path="./StateGroup2.d.ts" />

import { isState } from '../../../common/data/isState';
import { settings } from '../config/_build/DarkPlasma_StateGroup2_parameters';

let stateGroupId = 1;
const $dataStateGroups: Data_StateGroup[] = [];

function DataManager_StateGroupMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (isState(data)) {
      if (data.meta.stateGroup) {
        this.registerStateToGroup(data.id, String(data.meta.stateGroup).trim());
      }
    }
  };

  dataManager.registerStateToGroup = function (stateId, groupName) {
    const group = this.allocateStateGroup(groupName);
    if (!group.stateIds.includes(stateId)) {
      group.stateIds.push(stateId);
    }
  };

  dataManager.allocateStateGroup = function (groupName) {
    const result = $dataStateGroups.find(group => group.name === groupName);
    if (!result) {
      const newGroup = {
        id: stateGroupId++,
        name: groupName,
        stateIds: [],
      };
      $dataStateGroups.push(newGroup);
      return newGroup;
    }
    return result;
  };

  dataManager.stateGroupByName = function (groupName) {
    return $dataStateGroups.find(group => group.name === groupName);
  };

  dataManager.stateGroup = function (groupId) {
    return $dataStateGroups.find(group => group.id === groupId);
  };
}

DataManager_StateGroupMixIn(DataManager);

settings.groups
  .forEach(group => group.states
    .forEach(stateId => DataManager.registerStateToGroup(stateId, group.name))
  );

function Game_BattlerBase_StateGroupMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.isStateGroupAffected = function (groupId) {
    return DataManager.stateGroup(groupId)
      ?.stateIds.some(stateId => this.isStateAffected(stateId)) || false;
  };
}

Game_BattlerBase_StateGroupMixIn(Game_BattlerBase.prototype);
