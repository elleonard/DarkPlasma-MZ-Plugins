/// <reference path="../../../typings/rmmz.d.ts" />

declare namespace ColorManager {
  function itemCooldownColor(): string;
}

declare interface Game_Battler {
  setupItemCooldownTurn(): void;
}

declare interface Game_Actor {
  initialItemCommandCooldownTurn(): number;
  itemCommandCooldownTurn(): number;
  itemCommandCooldownTurnPlus(): number;
  canItemCommand(): boolean;
  isInItemCommandCooldown(): boolean;
}

declare interface Window_ActorCommand {
  paddingText(width: number, minLength: number): string;
}
