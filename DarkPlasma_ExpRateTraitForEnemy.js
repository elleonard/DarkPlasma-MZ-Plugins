// DarkPlasma_ExpRateTraitForEnemy 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/12/29 1.0.0 公開
 */

/*:
 * @plugindesc 敵キャラ用 経験値倍率特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitId
 *
 * @help
 * version: 1.0.0
 * 敵キャラ用の経験値倍率特徴を設定します。
 *
 * この特徴を持つ敵キャラは倒された場合に
 * 自身の経験値を倍率にしたがって変動させます。
 *
 * <expRateForEnemy:150>
 * 例えば、こう記述すると経験値が1.5倍になります。
 *
 * 戦闘不能になっても解除されないステートにこの特徴を追加して、
 * 付加されている間に倒すと経験値が増加するステートを作成できます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitId version:1.0.2
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const expRateTrait = uniqueTraitIdCache.allocate(pluginName, 1, '経験値倍率');
  function DataManager_ExpRateTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.expRateForEnemy) {
          data.traits.push({
            code: expRateTrait.id,
            dataId: 0,
            value: Number(data.meta.expRateForEnemy) / 100,
          });
        }
      }
    };
  }
  DataManager_ExpRateTraitMixIn(DataManager);
  function Game_Enemy_ExpRateTraitMixIn(gameEnemy) {
    const _exp = gameEnemy.exp;
    gameEnemy.exp = function () {
      return _exp.call(this) * this.traitsPi(expRateTrait.id, 0);
    };
  }
  Game_Enemy_ExpRateTraitMixIn(Game_Enemy.prototype);
})();
