// DarkPlasma_ErasePictures 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/07/03 1.0.0 公開
 */

/*:ja
 * @plugindesc 複数のピクチャを消去する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command erasePictures
 * @text 指定範囲のピクチャを消去する
 * @arg start
 * @text 開始ID
 * @type number
 * @default 1
 * @min 1
 * @arg end
 * @text 終了ID
 * @type number
 * @default 100
 *
 * @help
 * version: 1.0.0
 * 指定したIDの範囲のピクチャを消去するプラグインコマンドを提供します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_erasePictures(args) {
    return {
      start: Number(args.start || 1),
      end: Number(args.end || 100),
    };
  }

  const command_erasePictures = 'erasePictures';

  PluginManager.registerCommand(pluginName, command_erasePictures, function (args) {
    const parsedArgs = parseArgs_erasePictures(args);
    $gameScreen.erasePictures(parsedArgs.start, parsedArgs.end);
  });

  Game_Screen.prototype.erasePictures = function (start, end) {
    this._pictures.fill(null, this.realPictureId(start), this.realPictureId(end) + 1);
  };
})();
