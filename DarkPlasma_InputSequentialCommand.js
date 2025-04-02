// DarkPlasma_InputSequentialCommand 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/04/02 1.0.0 公開
 */

/*:
 * @plugindesc 一連のコマンド入力
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
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
        }
      }
    };
  }
  Input_SequentialCommandMixIn(Input);
})();
