/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_CharacterBase {
  isPatternExpanded(): boolean;
  defaultPattern(): number;
}

declare interface Game_Event {
  _isPatternExpanded: boolean;
  _maxPattern: number;
  _defaultPattern: number;
}

declare interface Game_Actor {
  isCharacterPatternExpanded(): boolean;
  maxCharacterPattern(): number;
  defaultCharacterPattern(): number;
  
  characterPatternYCount(): number;
}

declare interface Window_Base {
  drawActorCharacterWithExpandedPattern(actor: Game_Actor, x: number, y: number): void;
}
