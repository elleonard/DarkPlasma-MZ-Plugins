/// <reference path="../../../typings/rmmz.d.ts" />

type Game_StatesAndMeta = {
  ids: number[];
  turns: {[stateId: number]: number};
  steps?: {[stateId: number]: number};
  values?: {[stateId: number]: StateValue}
};

declare interface Game_Temp {
  _evacuatedStatesAndMeta: {[key: string]: Game_StatesAndMeta};

  evacuateStatesAndMeta(key: string, statesAndMeta: Game_StatesAndMeta): void;
  evacuatedStatesAndMeta(key: string): Game_StatesAndMeta | undefined;
  clearEvacuatedStatesAndMeta(key: string): void;
}

declare interface Game_BattlerBase {
  statesAndMetaForEvacuate(stateIds: number[]): Game_StatesAndMeta;
  stateStepsForEvacuate(stateIds: number[]): {[stateId: number]: number};
  restoreStatesAndMeta(statesAndMeta: Game_StatesAndMeta): void;
}
