/// <reference path="../../../typings/rmmz.d.ts" />

declare interface Game_System {
  _medalRewardsCompletion: {[key: string]: boolean};

  initializeMedalRewardsCompletion(): void;
  completeMedalReward(rewardKey: string): void;
  isMedalRewardCompleted(rewardKey: string): boolean;
  processTinyMedal(): void;
}

declare interface Game_Party {
  numMedalItems(): number;
  hasMedalItem(): boolean;
  loseAllMedalItem(): void;
}

declare interface Game_Interpreter {
  processReservedRewardMessages(): void;
}
