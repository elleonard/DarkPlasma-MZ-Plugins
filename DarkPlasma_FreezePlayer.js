// DarkPlasma_FreezePlayer 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/04/10 1.0.0 公開
 */

/*:ja
 * @plugindesc プレイヤーの移動を禁止する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param switchId
 * @desc このスイッチがONの間、プレイヤーは移動できません。
 * @text スイッチ
 * @type switch
 *
 * @help
 * version: 1.0.0
 * スイッチがONの間、プレイヤーの移動を禁止します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    switchId: Number(pluginParameters.switchId || 0),
  };

  /**
   * @param {Game_Player.prototype} gamePlayer
   */
  function Game_Player_FreezeMixIn(gamePlayer) {
    const _canMove = gamePlayer.canMove;
    gamePlayer.canMove = function () {
      return _canMove.call(this) && (!settings.switchId || !$gameSwitches.value(settings.switchId));
    };
  }

  Game_Player_FreezeMixIn(Game_Player.prototype);
})();
