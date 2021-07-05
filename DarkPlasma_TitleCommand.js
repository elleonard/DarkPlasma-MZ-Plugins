// DarkPlasma_TitleCommand 1.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.1 MZ 1.3.2に対応
 * 2021/06/27 1.0.0 公開
 */

/*:ja
 * @plugindesc タイトルコマンドを設定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param additionalCommands
 * @desc 追加のタイトルコマンド一覧を設定します。
 * @text 追加コマンド
 * @type struct<TitleCommand>[]
 * @default []
 *
 * @help
 * version: 1.0.1
 * タイトルコマンドを設定します。
 */
/*~struct~TitleCommand:
 * @param commandType
 * @desc コマンドの種別を設定します。
 * @text コマンド種別
 * @type select
 * @option シーン遷移
 * @value 1
 * @option シャットダウン
 * @value 2
 *
 * @param position
 * @desc 追加位置を数値インデックスで指定します。0で最上部（ニューゲームの上）、3でオプションの下に追加されます。
 * @text 追加位置
 * @type number
 * @default 3
 *
 * @param text
 * @desc タイトルコマンドのテキストを指定します。
 * @text テキスト
 * @type string
 *
 * @param symbol
 * @desc コマンドを一意に識別する文字列を指定します。
 * @text 識別子
 * @type string
 *
 * @param scene
 * @desc 遷移先のシーン名を指定します。コマンド種別がシーン遷移の場合のみ有効です。
 * @text シーン名
 * @type string
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    additionalCommands: JSON.parse(pluginParameters.additionalCommands || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          commandType: Number(parsed.commandType || 0),
          position: Number(parsed.position || 3),
          text: String(parsed.text || ''),
          symbol: String(parsed.symbol || ''),
          scene: String(parsed.scene || ''),
        };
      })(e || '{}');
    }),
  };

  function selectedScene(symbol) {
    const command = settings.additionalCommands.find((command) => command.symbol === symbol);
    return window[command.scene] || null;
  }

  const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
  Scene_Title.prototype.createCommandWindow = function () {
    _Scene_Title_createCommandWindow.call(this);
    settings.additionalCommands.forEach((command) => {
      const handler = command.commandType === 1 ? this.commandSceneChange.bind(this) : this.commandShutdown.bind(this);
      this._commandWindow.setHandler(command.symbol, handler);
    });
  };

  const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
  Scene_Title.prototype.commandWindowRect = function () {
    const rect = _Scene_Title_commandWindowRect.call(this);
    return new Rectangle(
      rect.x,
      rect.y,
      rect.width,
      this.calcWindowHeight(3 + settings.additionalCommands.length, true)
    );
  };

  Scene_Title.prototype.commandSceneChange = function () {
    this._commandWindow.close();
    const scene = selectedScene(this._commandWindow.currentSymbol());
    if (!scene) {
      throw `シンボル ${this._commandWindow.currentSymbol()} に無効なシーンが指定されています。`;
    }
    SceneManager.push(scene);
  };

  Scene_Title.prototype.commandShutdown = function () {
    if (StorageManager.isLocalMode()) {
      window.close();
    } else {
      window.open('about:blank', '_self').close();
    }
  };

  const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
  Window_TitleCommand.prototype.makeCommandList = function () {
    _Window_TitleCommand_makeCommandList.call(this);
    settings.additionalCommands.forEach((command) => {
      this.addCommandAt(command.position, command.text, command.symbol);
    });
  };

  Window_TitleCommand.prototype.addCommandAt = function (index, name, symbol, enabled = true, ext = null) {
    this._list.splice(index, 0, {
      name: name,
      symbol: symbol,
      enabled: enabled,
      ext: ext,
    });
  };
})();
