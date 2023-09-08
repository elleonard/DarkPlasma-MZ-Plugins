/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../SystemTypeIcon/SystemTypeIcon.d.ts" />

declare namespace MZ {
  declare interface Enemy {
    level?: number;
  }
}

declare interface EnemyBook {
  _pages: (EnemyBookPage|null)[];
  flexPage(): void;
  percentRegisteredEnemy(): number;
  percentRegisteredDropItem(): number;
  isRegistered(enemy: MZ.Enemy): boolean;
  isDropItemRegistered(enemy: MZ.Enemy, index: number): boolean;

  register(enemyId: number): void;
  registerDropItem(enemyId: number, index: number): void;
  unregister(enemyId: number): void;
  complete(): void;
  clear(): void;
}

declare interface EnemyBookPage {
  _isRegistered: boolean;
  _dropItems: boolean[];

  readonly isRegistered: boolean;

  isDropItemRegistered(index: number): boolean;
  registeredDropItemCount(enemy: MZ.Enemy): number;
  register(): void;
  registerDropItem(index: number): void;
  unregister(): void;
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

  readonly indexWindow: Window_EnemyBookIndex;
  readonly statusWindow: Window_EnemyBookStatus;
  readonly percentWindow: Window_EnemyBookPercent;
}

/**
 * TODO: 拡張の時に困ったらちゃんと継承元の型をなんとかする
 */
declare interface Window_EnemyBookPercent extends Window_Base {

}

declare interface Window_EnemyBookIndex extends Window_Selectable {
  _isInBattle: boolean;
  _list: MZ.Enemy[];
  forcusOnFirst(): void;
  mustHighlight(enemy: MZ.Enemy): boolean;
  highlightColorString(enemy: MZ.Enemy): string;
  /**
   * @deprecated use hightlightColorString
   */
  highlightColor(enemy: MZ.Enemy): number;

  makeItemList(): void;

  isEnabled(index: number): boolean;
  isCurrentItemEnabled(): boolean;
  enemy(index: number): MZ.Enemy|undefined;
  currentEnemy(): MZ.Enemy|undefined;
}

declare interface Window_EnemyBookStatus extends Window_Base {
  _enemy: MZ.Enemy|null;
  _enemySprite: Sprite;
  _weakLines: number;
  _resistLines: number;
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
