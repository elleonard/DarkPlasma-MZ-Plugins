/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueTraitId/AllocateUniqueTraitId.d.ts" />

declare interface Game_Battler {
  healOnBattleStart(): void;
  healHpOnBattleStart(): void;
  healMpOnBattleStart(): void;
  healTpOnBattleStart(): void;
}
