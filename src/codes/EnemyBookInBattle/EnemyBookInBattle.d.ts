/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../../common/scene/battleInputtingWindowInterface.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandler.d.ts" />
/// <reference path="../CustomKeyHandler/CustomKeyHandlerExport.d.ts" />
/// <reference path="../EnemyBook/plugin/EnemyBook.d.ts" />

declare class EnemyBookWindows {
  constructor(
    cancelHandler: () => void,
    parentLayer: WindowLayer,
    percentWindowRect: Rectangle,
    indexWindowRect: Rectangle,
    statusWindowRect: Rectangle,
    isInBattle: boolean
  );

  close(): void;
  open(): void;
  isActive(): boolean;
}

declare class Scene_EnemyBook {

}

declare class Window_EnemyBookIndex {
  _battlerEnemyIndexes: number[];
  battlerEnemyIsInBook(): boolean;
  selectNextBattlerEnemy(): void;
  selectPreviousBattlerEnemy(): void;
}
