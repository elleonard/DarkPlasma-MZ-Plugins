// DarkPlasma_ShutdownGame 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/04/11 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc タイトルとゲーム終了メニューにシャットダウンを追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param menuText
 * @desc シャットダウンメニューとして表示する名前
 * @text メニューテキスト
 * @type string
 * @default シャットダウン
 *
 * @help
 * version: 1.0.0
 * タイトルとゲーム終了メニューにシャットダウンを追加します。
 * 本プラグインはブラウザプレイ用のゲームでは利用できません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    menuText: String(pluginParameters.menuText || `シャットダウン`),
  };

  function Scene_ShutdownMixIn(sceneClass) {
    const _createCommandWindow = sceneClass.createCommandWindow;
    sceneClass.createCommandWindow = function () {
      _createCommandWindow.call(this);
      this._commandWindow.setHandler('shutdown', () => SceneManager.terminate());
      this.adjustCommandWindowHeight();
    };
    sceneClass.adjustCommandWindowHeight = function () {
      const targetHeight = this.calcWindowHeight(this._commandWindow.commandCount(), true);
      if (this._commandWindow.height < targetHeight && this._commandWindow.height > 0) {
        this._commandWindow.height = targetHeight;
      }
    };
  }
  Scene_ShutdownMixIn(Scene_GameEnd.prototype);
  Scene_ShutdownMixIn(Scene_Title.prototype);
  function Window_Command_CommandCountMixIn(windowCommand) {
    windowCommand.commandCount = function () {
      return this._list.length;
    };
  }
  Window_Command_CommandCountMixIn(Window_Command.prototype);
  function Window_TitleCommand_ShutdownMixIn(windowTitleCommand) {
    const _makeCommandList = windowTitleCommand.makeCommandList;
    windowTitleCommand.makeCommandList = function () {
      _makeCommandList.call(this);
      this.addCommand(settings.menuText, 'shutdown');
    };
  }
  Window_TitleCommand_ShutdownMixIn(Window_TitleCommand.prototype);
  function Window_GameEnd_ShutdownMixIn(windowGameEnd) {
    const _makeCommandList = windowGameEnd.makeCommandList;
    windowGameEnd.makeCommandList = function () {
      _makeCommandList.call(this);
      this.addShutdownCommand();
    };
    windowGameEnd.addShutdownCommand = function () {
      this._list.splice(this._list.findIndex((c) => c.symbol === 'toTitle') + 1, 0, {
        name: settings.menuText,
        symbol: 'shutdown',
        enabled: true,
        ext: null,
      });
    };
  }
  Window_GameEnd_ShutdownMixIn(Window_GameEnd.prototype);
})();
