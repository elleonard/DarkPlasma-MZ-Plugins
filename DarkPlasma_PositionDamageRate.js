// DarkPlasma_PositionDamageRate 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/10/24 1.0.1 まともに動かない不具合を修正
 * 2020/10/23 1.0.0 公開
 */

/*:ja
 * @plugindesc 前衛アクターの立ち位置で被ダメ倍率を変える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param physicalDamageRates
 * @desc 物理被ダメージ倍率。先頭から順に隊列位置に対応。1つも指定なしで100、2つ目以降指定なしで最後に指定した値。
 * @text 物理ダメージ倍率（％）
 * @type number[]
 * @default ["100"]
 *
 * @param magicalDamageRates
 * @desc 魔法被ダメージ倍率。先頭から順に隊列位置に対応。1つも指定なしで100、2つ目以降指定なしで最後に指定した値。
 * @text 魔法ダメージ倍率（％）
 * @type number[]
 * @default ["100"]
 *
 * @help
 * version: 1.0.3
 * 前衛アクターの立ち位置（先頭から何番目か）で
 * 受けるダメージの倍率を変更します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    physicalDamageRates: JSON.parse(pluginParameters.physicalDamageRates || '["100"]').map((e) => {
      return Number(e || 0);
    }),
    magicalDamageRates: JSON.parse(pluginParameters.magicalDamageRates || '["100"]').map((e) => {
      return Number(e || 0);
    }),
  };

  const SPARAM_ID = {
    PHYSICAL_DAMAGE_RATE: 6,
    MAGICAL_DAMAGE_RATE: 7,
  };

  const _Game_Actor_sparam = Game_Actor.prototype.sparam;
  Game_Actor.prototype.sparam = function (sparamId) {
    const value = _Game_Actor_sparam.call(this, sparamId);
    if (sparamId === SPARAM_ID.PHYSICAL_DAMAGE_RATE) {
      return value * this.physicalDamageRateByPosition();
    }
    if (sparamId === SPARAM_ID.MAGICAL_DAMAGE_RATE) {
      return value * this.magicalDamageRateByPosition();
    }
    return value;
  };

  Game_Actor.prototype.physicalDamageRateByPosition = function () {
    const index = this.index();
    return (
      (settings.physicalDamageRates.length > index
        ? settings.physicalDamageRates[index]
        : settings.physicalDamageRates[settings.physicalDamageRates.length - 1]) / 100
    );
  };

  Game_Actor.prototype.magicalDamageRateByPosition = function () {
    const index = this.index();
    return (
      (settings.magicalDamageRates.length > index
        ? settings.magicalDamageRates[index]
        : settings.magicalDamageRates[settings.magicalDamageRates.length - 1]) / 100
    );
  };
})();
