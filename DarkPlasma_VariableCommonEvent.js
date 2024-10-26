// DarkPlasma_VariableCommonEvent 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/10/27 1.0.0 公開
 */

/*:
 * @plugindesc 変数によって指定したIDのコモンイベントを呼び出す
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command variableCommonEvent
 * @text 可変コモンイベント
 * @desc 変数を指定し、その値をIDとして持つコモンイベントを呼び出します。
 * @arg variableId
 * @desc 指定した変数の値をIDとして持つコモンイベントを呼び出します。
 * @text 変数
 * @type variable
 * @default 0
 *
 * @help
 * version: 1.0.0
 * 変数を指定し、その値をIDとして持つコモンイベントを
 * 呼び出すプラグインコマンドを提供します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_variableCommonEvent(args) {
    return {
      variableId: Number(args.variableId || 0),
    };
  }

  const command_variableCommonEvent = 'variableCommonEvent';

  PluginManager.registerCommand(pluginName, command_variableCommonEvent, function (args) {
    const parsedArgs = parseArgs_variableCommonEvent(args);
    const commonEvent = $dataCommonEvents[$gameVariables.value(parsedArgs.variableId)];
    if (commonEvent) {
      const eventId = this.isOnCurrentMap() ? this._eventId : 0;
      this.setupChild(commonEvent.list, eventId);
    }
  });
})();
