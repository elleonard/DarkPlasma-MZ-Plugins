// DarkPlasma_DashSpeed 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/10/10 1.0.1 リファクタ
 * 2020/10/02 1.0.0 公開
 */

/*:ja
 * @plugindesc ダッシュ速度を変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param defaultDashSpeed
 * @desc デフォルトのダッシュ速度。大きくするほど早くなります。
 * @text デフォルトダッシュ速度
 * @type number
 * @decimals 1
 * @default 1
 *
 * @command changeDashSpeed
 * @text ダッシュ速度変更
 * @desc ダッシュ速度を変更します。
 * @arg dashSpeed
 * @text ダッシュ速度
 * @type number
 *
 * @help
 * version: 1.0.3
 * ダッシュ速度を変更します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    defaultDashSpeed: Number(pluginParameters.defaultDashSpeed || 1),
  };

  const PLUGIN_COMMAND_NAME = {
    CHANGE_DASH_SPEED: 'changeDashSpeed',
  };

  const _Game_Player_initMember = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function () {
    _Game_Player_initMember.call(this);
    this._dashSpeed = settings.defaultDashSpeed;
  };

  Game_Player.prototype.realMoveSpeed = function () {
    return this._moveSpeed + (this.isDashing() ? this._dashSpeed : 0);
  };

  Game_Player.prototype.dashSpeed = function () {
    return this._dashSpeed === undefined ? settings.defaultDashSpeed : this._dashSpeed;
  };

  Game_Player.prototype.setDashSpeed = function (dashSpeed) {
    this._dashSpeed = dashSpeed;
  };

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_DASH_SPEED, function (args) {
    $gamePlayer.setDashSpeed(Number(args.dashSpeed));
  });
})();
