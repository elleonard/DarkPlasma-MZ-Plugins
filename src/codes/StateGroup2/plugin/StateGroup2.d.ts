/// <reference path="../../../typings/rmmz.d.ts" />

type Data_StateGroup = {
  id: number;
  name: string;
  stateIds: number[];
};

declare namespace DataManager {
  function registerStateToGroup(stateId: number, groupName: string): void;
  function allocateStateGroup(groupName: string): Data_StateGroup;
  function stateGroupByName(groupName: string): Data_StateGroup|undefined;
  function stateGroup(groupId: number): Data_StateGroup|undefined;
}

declare interface Game_BattlerBase {
  isStateGroupAffected(groupId: number): boolean;
}
