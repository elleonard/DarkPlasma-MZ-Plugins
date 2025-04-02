// DarkPlasma_InputSequentialCommand 1.1.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/04/02 1.1.0 バッファサイズ設定を追加
 *            1.0.0 公開
 */

/*:
 * @plugindesc 一連のコマンド入力
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param bufferSize
 * @desc 記憶するコマンドバッファのサイズを指定します。
 * @text コマンドバッファサイズ
 * @type number
 * @default 10
 *
 * @help
 * version: 1.1.0
 * 一連のコマンド入力をチェックできます。
 *
 * Input.clearBuffer(): void
 * コマンド入力バッファを初期化します。
 *
 * Input.isSequentialInputted(command: string[]): boolean
 * コマンド列が最後に入力されたかどうかを判定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    bufferSize: Number(pluginParameters.bufferSize || 10),
  };

  function Input_SequentialCommandMixIn(input) {
    const _initialize = input.initialize;
    input.initialize = function () {
      _initialize.call(this);
      this.clearBuffer();
    };
    input.clearBuffer = function () {
      this._commandBuffer = [];
    };
    input.isSequentialInputted = function (command) {
      const lastInputted = this._commandBuffer.slice(-command.length);
      if (lastInputted.length !== command.length) {
        return false;
      }
      for (let i = 0; i < command.length; i++) {
        if (lastInputted[i] !== command[i]) {
          return false;
        }
      }
      return true;
    };
    const _update = input.update;
    input.update = function () {
      _update.call(this);
      for (const name in this._currentState) {
        if (this._currentState[name] && this._pressedTime === 0) {
          this._commandBuffer.push(name);
          if (this._commandBuffer.length > settings.bufferSize) {
            this._commandBuffer.splice(-settings.bufferSize);
          }
        }
      }
    };
  }
  Input_SequentialCommandMixIn(Input);
})();
