/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../SystemTypeIcon/SystemTypeIcon.d.ts" />

declare namespace MZ {
  declare interface Enemy {
    level?: number;
  }
}

declare interface Game_System {
  _enemyBook: EnemyBook;
  addToEnemyBook(enemyId: number): void;
  addDropItemToEnemyBook(enemyId: number, dropIndex: number): void;
  removeFromEnemyBook(enemyId: number): void;
  completeEnemyBook(): void;
  clearEnemyBook(): void;
  percentCompleteEnemy(): number;
  percentCompleteDrop(): number;
  isInEnemyBook(enemy: MZ.Enemy): boolean;
  isInEnemyBookDrop(enemy: MZ.Enemy, dropIndex: number): boolean;
}

declare interface Game_Enemy {
  dropItemLots(dropItem: MZ.Enemy.DropItem): boolean;
}

type Scene_BookLayoutMixIn = import("../../common/scene/bookLayoutMixIn").Scene_BookLayoutMixInClass;

declare interface Scene_EnemyBook extends Scene_BookLayoutMixIn {
  _enemyBookWindows: EnemyBookWindows;
  createEnemyBookWindows(): void;
}

declare interface Scene_Battle extends Scene_BookLayoutMixIn {
  _enemyBookLayer: WindowLayer;
  _enemyBookWindows: EnemyBookWindows;
  _returnFromEnemyBook: Window_Selectable|null;
  createEnemyBookWindowLayer(): void;
  createEnemyBookWindows(): void;
  openEnemyBook(): void;
  closeEnemyBook(): void;
}

declare interface EnemyBookWindows {
  new(
    cancelHandler: () => void,
    parentLayer: WindowLayer,
    percentWindowRect: Rectangle,
    indexWindowRect: Rectangle,
    statusWindowRect: Rectangle,
    isInBattle: boolean
  );
}

declare interface Window_EnemyBookIndex extends Window_Selectable {
  _isInBattle: boolean;
  _list: MZ.Enemy[];
  forcusOnFirst(): void;
  mustHighlight(enemy: MZ.Enemy): boolean;
  makeItemList(): void;
}

declare interface Window_EnemyBookStatus extends Window_Base {
  _enemy: MZ.Enemy|null;
  _enemySprite: Sprite;
  drawPage(): void;
  drawStatus(x: number, y: number): void;
  isExcludedResistState(stateId: number): boolean;
  stateRate(stateId: number): number;
  drawNoEffectElementsAndStates(x: number, y: number, width: number): void;
  drawNoEffectsLabel(x: number, y: number, width: number): void;

  descriptionX(): number;
  descriptionY(): number;
}

declare interface Window_Command {
  processEnemyBook(): void;
}
