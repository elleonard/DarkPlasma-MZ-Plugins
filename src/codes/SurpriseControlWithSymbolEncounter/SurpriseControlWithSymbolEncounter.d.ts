/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Temp {
  _encounterSituation: number;
  _isSymbolEncounter: boolean;

  encounterSituation(): number;
  setEncounterSituation(situation: number): void;
  isSymbolEncounter(): boolean;
  setIsSymbolEncounter(isSymbolEncounter: boolean): void;
}

declare interface Game_Event {
  isAheadOfPlayer(): boolean;
  isSymbolEnemy(): boolean;

  setupEncounterSituation(): void;
}

declare interface Game_Party {
  preemptiveRateByBackAttack(): number;
  surpriseRateByBackAttacked(): number;
}
