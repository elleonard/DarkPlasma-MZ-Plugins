/// <reference path="../../typings/rmmz.d.ts" />

declare interface Game_Interpreter {
  iterateBattlerCallback(skillId: number, targetIndex: number, battler: Game_Battler): void;
}
