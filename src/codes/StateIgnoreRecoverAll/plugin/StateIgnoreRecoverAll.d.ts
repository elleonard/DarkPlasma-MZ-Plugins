/// <reference path="../../../typings/rmmz.d.ts" />

type Game_StatesAndMeta = {
  ids: number[];
  turns: {[stateId: number]: number};
  steps?: {[stateId: number]: number};
};

declare interface Game_Temp {
  _evacuatedStatesAndMeta?: Game_StatesAndMeta;

  evacuateStatesAndMeta(statesAndMeta: Game_StatesAndMeta): void;
  evacuatedStatesAndMeta(): Game_StatesAndMeta | undefined;
  clearEvacuatedStatesAndMeta(): void;
}

declare interface Game_BattlerBase {
  stateIdsIgnoreRecoverAll(): number[];
  stateTurnsForIgnoreRecoverAll(): {[stateId: number]: number};
  statesAndMetaForIgnoreRecoverAll(): Game_StatesAndMeta;
  restoreStatesAndMeta(statesAndMeta: Game_StatesAndMeta): void;
}

declare interface Game_Actor {
  stateStepsForIgnoreRecoverAll(): {[stateId: number]: number};
}
