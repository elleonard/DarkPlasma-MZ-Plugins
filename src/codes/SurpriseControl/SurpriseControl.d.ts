/// <reference path="../../typings/rmmz.d.ts" />

declare interface BattleManager {
  forcePreemptive(): boolean;
  noPreemptive(): boolean;
  forceSurprise(): boolean;
  noSurprise(): boolean;
}

declare interface Game_Troop {
  hasForcePreemptiveFlag(): boolean;
  hasNoPreemptiveFlag(): boolean;
  hasForceSurpriseFlag(): boolean;
  hasNoSurpriseFlag(): boolean;
}

declare interface Game_Enemy {
  hasForcePreemptiveFlag(): boolean;
  hasNoPreemptiveFlag(): boolean;
  hasForceSurpriseFlag(): boolean;
  hasNoSurpriseFlag(): boolean;
}
