/// <reference path="../../typings/rmmz.d.ts" />
/// <reference path="../AllocateUniqueEffectCode/AllocateUniqueEffectCode.d.ts" />

declare interface Game_Battler {
  /**
   * Game_Enemyは本来レベルを持たないが、
   * プラグインによってレベルを持たせることは可能
   */
  level?: number;
}
