/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../EvacuateStateAndMeta/plugin/EvacuateStateAndMeta.d.ts" />

type StateValue = {[valueType: string]: value};

declare namespace DataManager {
  function maxStateValue(stateId: number, valueType: string, battler: Game_BattlerBase): number;
  function minStateValue(stateId: number, valueType: string, battler: Game_BattlerBase): number;
}

declare interface Game_BattlerBase {
  _stateValues?: {[stateId: number]: StateValue};

  setStateValue(stateId: number, valueType: string, value: number): void;
  addStateValue(stateId: number, valueType: string, value: number): void;
  stateValue(stateId: number, valueType: string): number;
  totalStateValue(valueType: string): number;

  stateValuesForEvacuate(stateIds: number[]): {[stateId: number]: StateValue}|undefined;
}
