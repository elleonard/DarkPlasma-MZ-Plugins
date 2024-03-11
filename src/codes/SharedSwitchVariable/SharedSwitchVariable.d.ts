/// <reference path="../../typings/rmmz.d.ts" />

type SharedSwitch = {
  id: number;
  value: boolean;
};

type SharedVariable = {
  id: number;
  value: number;
};

type SharedSwitchesAndVariables = {
  switches: SharedSwitch[];
  variables: SharedVariable[];
};

declare namespace DataManager {
  var _isSharedInfoLoaded: boolean;

  function saveSharedInfo(): void;
  function loadSharedInfo(): void;
  function isSharedInfoLoaded(): boolean;
  function makeSharedInfo(): SharedSwitchesAndVariables;
  function sharedSaveSwitches(): SharedSwitch[];
  function sharedSaveVariables(): SharedVariable[];
}
