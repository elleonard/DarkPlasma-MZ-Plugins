/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Character {
  moveRouteListTo(x: number, y: number): MZ.MoveCommand[];
}

declare interface Game_Interpreter {
  moveCharacterTo(characterId: number, x: number, y: number, skip: boolean, wait: boolean): void;
}
