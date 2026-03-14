/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../SharedSaveInfo/plugin/SharedSaveInfo.d.ts" />

type Game_SharedSwitch = {
  id: number;
  value: boolean;
};

type Game_SharedVariable = {
  id: number;
  value: number;
};

declare interface Game_SharedSaveInfo {
  switches: Game_SharedSwitch[];
  variables: Game_SharedVariable[];
}

declare namespace DataManager {
  function sharedSaveSwitches(): Game_SharedSwitch[];
  function sharedSaveVariables(): Game_SharedVariable[];
}
