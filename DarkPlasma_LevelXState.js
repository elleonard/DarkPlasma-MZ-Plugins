// DarkPlasma_LevelXState 1.0.1
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/11/26 1.0.1 レベルが特定数値の倍数でない対象にも有効になる不具合を修正
 * 2023/09/16 1.0.0 公開
 */

/*:
 * @plugindesc レベルが特定数値の倍数の対象にのみ有効なステート付加効果
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueEffectCode
 * @orderAfter DarkPlasma_AllocateUniqueEffectCode
 *
 * @help
 * version: 1.0.1
 * スキル・アイテムの使用効果に、
 * レベルが特定の数値の倍数の対象にのみ有効なステート付加を追加します。
 *
 * 対象スキル・アイテムのメモ欄に以下のように記述します。
 * <levelXState:
 *   5:1
 * >
 * これにより、レベルが5の倍数の対象に
 * ステート1(戦闘不能)を付加する効果となります。
 *
 * このステート付加は、対象のステート有効度が0であるか
 * ステート無効フラグを持っている場合には無効になります。
 * ただし、それ以外の場合には必ず有効になります。
 *
 * このステート付加は、対象がレベルを持たない場合には無効になります。
 * 敵キャラは本来レベルを持ちませんが、
 * 敵キャラにレベルを持たせるプラグインを使うことで
 * このステート付加を敵キャラに対しても有効にすることができます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueEffectCode version:1.0.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueEffectCode
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const levelXStateEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  function DataManager_LevelXStateMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.levelXState) {
        String(data.meta.levelXState)
          .split('\n')
          .filter((line) => line.includes(':'))
          .forEach((line) => {
            const e = line.split(':');
            if (e.length === 2) {
              data.effects.push({
                code: levelXStateEffect.code,
                dataId: Number(e[1]),
                value1: Number(e[0]),
                value2: 0,
              });
            }
          });
      }
    };
  }
  DataManager_LevelXStateMixIn(DataManager);
  function Game_Action_LevelXStateMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === levelXStateEffect.code) {
        return !target.isStateAffected(effect.dataId) && !!target.level && target.level % effect.value1 === 0;
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      if (effect.code === levelXStateEffect.code) {
        if (
          !target.isStateResist(effect.dataId) &&
          target.stateRate(effect.dataId) > 0 &&
          target.level &&
          target.level % effect.value1 === 0
        ) {
          target.addState(effect.dataId);
          this.makeSuccess(target);
        }
      }
      _applyItemEffect.call(this, target, effect);
    };
  }
  Game_Action_LevelXStateMixIn(Game_Action.prototype);
})();
