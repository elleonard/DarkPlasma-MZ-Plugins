/// <reference path="../../typings/rmmz.d.ts" />

declare namespace MZ {
  interface Enemy {
    typeTags: string[];
  }
}

declare namespace DataManager {
  function enemiesWithTag(tag: string): MZ.Enemy[];
}

declare interface Game_Troop {
  _isRandomTroop: boolean|undefined;

  processRandomTroop(): void;
  randomTroopCommand(): MZ.EventCommand|undefined;
  isRandomTroop(): boolean;
}

declare interface Game_Enemy {
  setScreenPosition(x: number, y: number): void;
}

declare interface Spriteset_Battle {
  repositionEnemies(): void;
  repositionEnemiesForFrontView(): void;
  repositionEnemiesForSideView(): void;
}

declare interface Sprite_Enemy {
  shiftXLeft(shiftX: number): void;
  feedbackPositionToEnemy(): void;
  repositionForSideView(lineCount: number, positionCellIndex: number): void;
}
