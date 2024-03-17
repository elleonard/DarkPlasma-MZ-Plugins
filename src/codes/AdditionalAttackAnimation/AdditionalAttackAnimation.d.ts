/// <reference path="../../typings/rmmz.d.ts" />

type AdditionalAnimation = {
  animation: number;
  onlyForSomeEnemies: boolean;
  enemies: number[];
  onlyForSomeStates: boolean;
  states: number[];
};

declare interface Game_Battler {
  isAdditionalAnimationTarget(additionalAnimation: AdditionalAnimation): boolean;
}

declare interface Window_BattleLog {
  showAdditionalAnimation(subject: Game_Battler, targets: Game_Battler[]): void;
}
