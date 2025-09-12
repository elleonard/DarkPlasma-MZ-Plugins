// DarkPlasma_DualWieldDamageRateTrait 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/09/13 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 二刀流連撃行動のダメージ倍率特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_DualWieldRepeats
 * @base DarkPlasma_AllocateUniqueTraitId
 *
 * @help
 * version: 1.0.0
 * 二刀流連撃ダメージ倍率を変更する特徴を設定します。
 * バトラーの二刀流連撃ダメージ倍率はデフォルトで100％です。
 *
 * 二刀流連撃ダメージ倍率:
 * DarkPlasma_DualWieldRepeatsで設定した二刀流連撃行動について
 * バトラーが二刀流特徴を持つ場合にダメージに乗算されます。
 *
 * <dualWieldRepeatsDamageRate:n>
 * 二刀流連撃ダメージ倍率をn％乗算します。
 *
 * <dualWieldRepeatsDamageRatePlus:n>
 * 二刀流連撃ダメージ倍率をn％加算します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_DualWieldRepeats version:1.0.0
 * DarkPlasma_AllocateUniqueTraitId version:1.0.2
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const dualWieldRepeatsDamageRateTrait = uniqueTraitIdCache.allocate(pluginName, 0, '二刀流連撃ダメージ倍率');
  const dualWieldRepeatsDamageRatePlusTrait = uniqueTraitIdCache.allocate(pluginName, 1, '二刀流連撃ダメージ倍率加算');
  function DataManager_DualWieldDamageRateTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        if (data.meta.dualWieldRepeatsDamageRate) {
          data.traits.push({
            code: dualWieldRepeatsDamageRateTrait.id,
            dataId: 0,
            value: Number(data.meta.dualWieldRepeatsDamageRate) / 100,
          });
        }
        if (data.meta.dualWieldRepeatsDamageRatePlus) {
          data.traits.push({
            code: dualWieldRepeatsDamageRatePlusTrait.id,
            dataId: 0,
            value: Number(data.meta.dualWieldRepeatsDamageRatePlus) / 100,
          });
        }
      }
    };
  }
  DataManager_DualWieldDamageRateTraitMixIn(DataManager);
  function Game_BattlerBase_DualWieldDamageRateTraitMixIn(gameBattlerBase) {
    gameBattlerBase.dualWieldRepeatsDamageRate = function () {
      return (
        this.traitsPi(dualWieldRepeatsDamageRateTrait.id, 0) + this.traitsSum(dualWieldRepeatsDamageRatePlusTrait.id, 0)
      );
    };
  }
  Game_BattlerBase_DualWieldDamageRateTraitMixIn(Game_BattlerBase.prototype);
  function Game_Action_DualWieldDamageRateTraitMixIn(gameAction) {
    const _makeDamageValue = gameAction.makeDamageValue;
    gameAction.makeDamageValue = function (target, critical) {
      let value = _makeDamageValue.call(this, target, critical);
      if (this.subject().isDualWield() && this.isDualWieldRepeats()) {
        value *= this.subject().dualWieldRepeatsDamageRate();
      }
      return Math.floor(value);
    };
  }
  Game_Action_DualWieldDamageRateTraitMixIn(Game_Action.prototype);
})();
