/// <reference path="../../../typings/rmmz.d.ts" />
/// <reference path="../../AllocateUniqueHitType/plugin/AllocateUniqueHitType.d.ts" />

declare interface Game_Battler {
  /**
   * Game_Enemyは本来レベルを持たないが、
   * プラグインによってレベルを持たせることは可能
   */
  level?: number;
}

declare interface Game_Action {
  isLevelXHit(base: number): boolean;
}
