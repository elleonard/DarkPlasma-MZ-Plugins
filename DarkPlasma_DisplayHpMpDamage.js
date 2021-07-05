// DarkPlasma_DisplayHpMpDamage 1.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/11/17 1.0.0 公開
 */

/*:ja
 * @plugindesc HPとMP両方のダメージ/回復をポップアップ表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param delay
 * @desc HPの表示からMPの表示を何フレーム遅らせるか
 * @text 表示時間差
 * @type number
 * @default 10
 *
 * @param offsetX
 * @desc HPの表示からMPの表示を横にどれだけずらすか
 * @text 横オフセット
 * @type number
 * @default 8
 *
 * @param offsetY
 * @desc HPの表示からMPの表示を縦にどれだけずらすか
 * @text 縦オフセット
 * @type number
 * @default -16
 * @min -300
 *
 * @help
 * version: 1.0.2
 * HPとMP両方にダメージや回復がある場合、
 * その両方をポップアップ表示します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    delay: Number(pluginParameters.delay || 10),
    offsetX: Number(pluginParameters.offsetX || 8),
    offsetY: Number(pluginParameters.offsetY || -16),
  };

  const _Sprite_Battler_createDamageSprite = Sprite_Battler.prototype.createDamageSprite;
  Sprite_Battler.prototype.createDamageSprite = function () {
    _Sprite_Battler_createDamageSprite.call(this);
    const result = this._battler.result();
    if (this._battler.isAlive() && result.hpAffected && result.mpDamage !== 0) {
      const last = this._damages[this._damages.length - 1];
      const sprite = new Sprite_Damage();
      /**
       * HPダメージに関するスプライトがすでに追加されているため、lastは必ず存在する
       */
      sprite.x = last.x + settings.offsetX;
      sprite.y = last.y + settings.offsetY;
      sprite.setupMpChangeWithHp(this._battler);
      this._damages.push(sprite);
      this.parent.addChild(sprite);
    }
  };

  const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
  Sprite_Damage.prototype.initialize = function () {
    _Sprite_Damage_initialize.call(this);
    this._delay = 0;
  };

  Sprite_Damage.prototype.setupMpChangeWithHp = function (target) {
    const result = target.result();
    this._colorType = result.mpDamage >= 0 ? 2 : 3;
    this._delay = settings.delay;
    this.createDigits(result.mpDamage);
  };

  const _Sprite_Damage_update = Sprite_Damage.prototype.update;
  Sprite_Damage.prototype.update = function () {
    if (this._delay > 0) {
      this._delay--;
      return;
    }
    _Sprite_Damage_update.call(this);
  };
})();
