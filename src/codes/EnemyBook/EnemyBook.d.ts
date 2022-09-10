/// <reference path="../../typings/rmmz/rmmz.d.ts" />
/// <reference path="../../common/scene/battleInputtingWindowInterface.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../../codes/CustomKeyHandler/CustomKeyHandlerExport.d.ts" />

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

declare interface Window_EnemyBookIndex extends Window_Selectable {

}

declare interface Window_EnemyBookStatus extends Window_Base {
  drawPage(): void;
  drawStatus(x: number, y: number): void;
  isExcludedResistState(stateId: number): boolean;
  drawNoEffectElementsAndStates(x: number, y: number, width: number): void;
}

declare interface Window_Command {
  processEnemyBook(): void;
}
