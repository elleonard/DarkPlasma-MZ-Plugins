// DarkPlasma_FloorDamageFlash 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/01/22 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 床ダメージ発生時のフラッシュの色・不透明度・フレーム数を設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param red
 * @text 赤
 * @type number
 * @max 255
 * @default 255
 *
 * @param green
 * @text 緑
 * @type number
 * @max 255
 * @default 0
 *
 * @param blue
 * @text 青
 * @type number
 * @max 255
 * @default 0
 *
 * @param opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @default 128
 *
 * @param duration
 * @text フレーム数
 * @type number
 * @default 8
 *
 * @help
 * version: 1.0.0
 * 床ダメージが発生した際のフラッシュの色・不透明度・フレーム数を設定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    red: Number(pluginParameters.red || 255),
    green: Number(pluginParameters.green || 0),
    blue: Number(pluginParameters.blue || 0),
    opacity: Number(pluginParameters.opacity || 128),
    duration: Number(pluginParameters.duration || 8),
  };

  function Game_Screen_FloorDamageFlashMixIn(gameScreen) {
    gameScreen.floorDamageFlashDuration = function () {
      return settings.duration;
    };
    gameScreen.floorDamageFlashColor = function () {
      return [settings.red, settings.green, settings.blue, settings.opacity];
    };
    gameScreen.startFlashForDamage = function () {
      this.startFlash(this.floorDamageFlashColor(), this.floorDamageFlashDuration());
    };
  }
  Game_Screen_FloorDamageFlashMixIn(Game_Screen.prototype);
})();
