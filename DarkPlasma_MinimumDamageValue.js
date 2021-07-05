// DarkPlasma_MinimumDamageValue 2.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 攻撃命中時のダメージの最低値を設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param minimumPhysicalDamage
 * @text 物理最低ダメージ
 * @type number
 * @default 1
 *
 * @param minimumMagicalDamage
 * @text 魔法最低ダメージ
 * @type number
 * @default 0
 *
 * @param ignoreIfRateLEZero
 * @desc 属性有効度0以下の場合に最低ダメージ設定を無視するかどうか
 * @text 有効度0以下優先
 * @type boolean
 * @default true
 *
 * @param randomMinimumDamage
 * @desc 最低ダメージを0から設定値の間のランダムにするかどうか
 * @text ランダム最低ダメージ
 * @type boolean
 * @default false
 *
 * @help
 * version: 2.0.2
 * 攻撃が命中したときのダメージの最低値を設定します。
 *
 * 最低ダメージ保証と呼んでいますが、実際はダメージに設定値を加算するシステムです。
 * 属性耐性など種々のダメージ計算の後、設定した値をダメージに加算します。
 *
 * 有効度0以下優先がONの場合、属性有効度が0以下なら最低ダメージの設定を無視します。
 * 有効度1％の敵に確定で通るダメージを設定したいが、
 * 有効度0以下の敵にはダメージを通したくない。
 * そんな場合にはONにしておくと良いでしょう。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    minimumPhysicalDamage: Number(pluginParameters.minimumPhysicalDamage || 1),
    minimumMagicalDamage: Number(pluginParameters.minimumMagicalDamage || 0),
    ignoreIfRateLEZero: String(pluginParameters.ignoreIfRateLEZero || true) === 'true',
    randomMinimumDamage: String(pluginParameters.randomMinimumDamage || false) === 'true',
  };

  const _GameAction_makeDamageValue = Game_Action.prototype.makeDamageValue;
  Game_Action.prototype.makeDamageValue = function (target, critical) {
    return _GameAction_makeDamageValue.call(this, target, critical) + this.minimumDamageValue(target);
  };

  Game_Action.prototype.minimumDamageValue = function (target) {
    let value = 0;
    if (settings.ignoreIfRateLEZero && this.calcElementRate(target) <= 0) {
      return 0;
    }
    if (this.isPhysical()) {
      value = settings.minimumPhysicalDamage;
    }
    if (this.isMagical()) {
      value = settings.minimumMagicalDamage;
    }
    return settings.randomMinimumDamage ? Math.floor(Math.random() * (value + 1)) : value;
  };
})();
