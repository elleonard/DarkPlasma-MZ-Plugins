// DarkPlasma_DisableShowFastMessage 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.3 MZ 1.3.2に対応
 * 2021/06/22 1.0.2 サブフォルダからの読み込みに対応
 * 2020/10/10 1.0.1 リファクタ
 * 2020/09/26 1.0.0 公開
 */

/*:ja
 * @plugindesc メッセージの高速表示を禁止する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command Enable showFastMessage
 * @text メッセージ高速表示許可
 *
 * @command Disable showFastMessage
 * @text メッセージ高速表示禁止
 *
 * @help
 * version: 1.0.3
 * プラグインコマンドにより、メッセージの高速表示を禁止したり許可したりします。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  PluginManager.registerCommand(pluginName, 'Enable showFastMessage', function () {
    $gameSystem.enableShowFastMessage();
  });

  PluginManager.registerCommand(pluginName, 'Disable showFastMessage', function () {
    $gameSystem.disableShowFastMessage();
  });

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._enableShowFastMessage = true;
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (this._enableShowFastMessage === undefined) {
      this._enableShowFastMessage = true;
    }
  };

  Game_System.prototype.isEnableShowFastMessage = function () {
    return this._enableShowFastMessage;
  };

  Game_System.prototype.enableShowFastMessage = function () {
    this._enableShowFastMessage = true;
  };

  Game_System.prototype.disableShowFastMessage = function () {
    this._enableShowFastMessage = false;
  };

  const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
  Window_Message.prototype.updateShowFast = function () {
    if ($gameSystem.isEnableShowFastMessage()) {
      _Window_Message_updateShowFast.call(this);
    }
  };
})();
