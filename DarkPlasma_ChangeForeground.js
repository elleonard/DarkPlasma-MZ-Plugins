// DarkPlasma_ChangeForeground 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/12 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 近景画像を切り替える
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base Foreground
 *
 * @command ChangeForeground
 * @text 近景画像を切り替える
 * @desc 近景画像を切り替えます。
 * @arg file
 * @desc 視差ゼロの画像を指定する場合はファイル名を文字列で直接入力してください。
 * @text ファイル
 * @type file
 * @dir img/paralaxes
 * @arg loopX
 * @text X方向ループ
 * @type boolean
 * @default false
 * @arg loopY
 * @text Y方向ループ
 * @type boolean
 * @default false
 * @arg scrollSpeedX
 * @desc X軸方向のスクロール速度を設定します。
 * @text X方向スクロール速度
 * @type number
 * @default 0
 * @arg scrollSpeedY
 * @desc Y軸方向のスクロール速度を設定します。
 * @text Y方向スクロール速度
 * @type number
 * @default 0
 *
 * @command ClearForeground
 * @text 近景画像を消去する
 * @desc 設定された近景画像を消去します。
 *
 * @help
 * version: 1.0.0
 * 準公式プラグインForeground.jsで設定された近景画像を
 * プラグインコマンドで切り替えます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * Foreground version:1.1.0
 */

(() => {
  'use strict';

  function parseArgs_ChangeForeground(args) {
    return {
      file: String(args.file || ``),
      loopX: String(args.loopX || false) === 'true',
      loopY: String(args.loopY || false) === 'true',
      scrollSpeedX: Number(args.scrollSpeedX || 0),
      scrollSpeedY: Number(args.scrollSpeedY || 0),
    };
  }

  const command_ChangeForeground = 'ChangeForeground';

  const command_ClearForeground = 'ClearForeground';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  PluginManager.registerCommand(pluginName, command_ChangeForeground, function (args) {
    $gameMap.setForeground(parseArgs_ChangeForeground(args));
  });
  PluginManager.registerCommand(pluginName, command_ClearForeground, function () {
    $gameMap.clearForeground();
  });
  function Game_Map_ChangeForegroundMixIn(gameMap) {
    gameMap.setForeground = function (foreground) {
      this._foregroundDefined = true;
      this._foregroundName = foreground.file;
      this._foregroundZero = ImageManager.isZeroForeground(this._foregroundName);
      this._foregroundLoopX = foreground.loopX;
      this._foregroundLoopY = foreground.loopY;
      this._foregroundSx = foreground.scrollSpeedX;
      this._foregroundSy = foreground.scrollSpeedY;
      this._foregroundX = 0;
      this._foregroundY = 0;
    };
    gameMap.clearForeground = function () {
      this._foregroundName = '';
    };
  }
  Game_Map_ChangeForegroundMixIn(Game_Map.prototype);
})();
