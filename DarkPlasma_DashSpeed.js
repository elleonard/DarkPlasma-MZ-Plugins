// DarkPlasma_DashSpeed 1.0.5
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/09/28 1.0.5 導入前のセーブデータをロードするとマップ上のプレイヤーキャラクターが消失する不具合を修正
 *            1.0.4 typescript移行
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/10/10 1.0.1 リファクタ
 * 2020/10/02 1.0.0 公開
 */

/*:
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
 * @default 1
 *
 * @help
 * version: 1.0.5
 * ダッシュ速度を変更します。
 *
 * 本プラグインはセーブデータにプレイヤーのダッシュ速度を追加します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const command_changeDashSpeed = 'changeDashSpeed';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    defaultDashSpeed: Number(pluginParameters.defaultDashSpeed || 1),
  };

  PluginManager.registerCommand(pluginName, command_changeDashSpeed, function (args) {
    $gamePlayer.setDashSpeed(Number(args.dashSpeed));
  });
  function Game_Player_DashSpeedMixIn(gamePlayer) {
    const _initMember = gamePlayer.initMembers;
    gamePlayer.initMembers = function () {
      _initMember.call(this);
      this._dashSpeed = settings.defaultDashSpeed;
    };
    gamePlayer.realMoveSpeed = function () {
      return this._moveSpeed + (this.isDashing() ? this.dashSpeed() : 0);
    };
    gamePlayer.dashSpeed = function () {
      if (this._dashSpeed === undefined) {
        this._dashSpeed = settings.defaultDashSpeed;
      }
      return this._dashSpeed;
    };
    gamePlayer.setDashSpeed = function (dashSpeed) {
      this._dashSpeed = dashSpeed;
    };
  }
  Game_Player_DashSpeedMixIn(Game_Player.prototype);
})();
