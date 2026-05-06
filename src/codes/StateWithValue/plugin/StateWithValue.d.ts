/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../EvacuateStateAndMeta/plugin/EvacuateStateAndMeta.d.ts" />

type StateValue = {[valueType: string]: value};

declare namespace DataManager {
  function maxStateValue(stateId: number, valueType: string): number;
  function minStateValue(stateId: number, valueType: string): number;
}

declare interface Game_BattlerBase {
  _stateValues?: {[stateId: number]: StateValue};

  setStateValue(stateId: number, valueType: string, value: number): void;
  addStateValue(stateId: number, valueType: string, value: number): void;
  stateValue(stateId: number, valueType: string): number;

  stateValuesForEvacuate(stateIds: number[]): {[stateId: number]: StateValue}|undefined;
}
