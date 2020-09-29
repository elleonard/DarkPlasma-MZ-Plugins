// DarkPlasma_ChoiceHelp 1.0.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/09/29 1.0.3 プラグインコマンドに説明を追加
 * 2020/09/23 1.0.2 場所移動時に一瞬ヘルプウィンドウが表示される不具合を修正
 *                  選択肢ウィンドウを継承するプラグインとの競合を修正
 * 2020/09/16 1.0.1 入れ子の選択肢にヘルプが引き継がれる不具合を修正
 *            1.0.0 公開
 */

/*:ja
 * @plugindesc 選択肢にヘルプを表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @command setChoiceHelp
 * @text 選択肢にヘルプテキスト
 * @desc 選択肢にヘルプテキストを設定します。
 * @arg helpTexts
 * @text ヘルプテキスト一覧
 * @desc ヘルプテキスト一覧を設定します。選択肢と同じ順番に設定してください。
 * @type multiline_string[]
 *
 * @help
 * 選択肢にヘルプテキストを表示できます。
 *
 * 選択肢イベントコマンドの前にプラグインコマンドで
 * ヘルプテキスト一覧を設定してください。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const COMMANDS = {
    SET_CHOICE_HELP: 'setChoiceHelp',
  };

  PluginManager.registerCommand(pluginName, COMMANDS.SET_CHOICE_HELP, (args) => {
    let choiceHelp = JSON.parse(args.helpTexts);
    $gameMessage.setChoiceHelp(choiceHelp);
  });

  const _Game_Message_clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function () {
    _Game_Message_clear.call(this);
    this.resetChoiceHelp();
  };

  const _Game_Message_originalIndexOfDisplayedChoices = Game_Message.prototype.originalIndexOfDiplayedChoices;
  Game_Message.prototype.originalIndexOfDiplayedChoices = function () {
    return _Game_Message_originalIndexOfDisplayedChoices
      ? _Game_Message_originalIndexOfDisplayedChoices.call(this)
      : this.choices().map((_, index) => index);
  };

  Game_Message.prototype.setChoiceHelp = function (choiceHelp) {
    this._choiceHelp = choiceHelp;
  };

  Game_Message.prototype.choiceHelp = function () {
    const originalIndexes = this.originalIndexOfDiplayedChoices();
    return this._choiceHelp.filter((_, index) => originalIndexes.includes(index));
  };

  Game_Message.prototype.resetChoiceHelp = function () {
    this._choiceHelp = [];
  };

  const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
  Scene_Message.prototype.createAllWindows = function () {
    this.createHelpWindow();
    _Scene_Message_createAllWindows.call(this);
  };

  Scene_Message.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(this.helpWindowRect());
    this._helpWindow.openness = 0;
    this.addWindow(this._helpWindow);
  };

  Scene_Message.prototype.helpWindowRect = function () {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_Message.prototype.helpAreaTop = function () {
    return 0;
  };

  Scene_Message.prototype.helpAreaHeight = function () {
    return this.calcWindowHeight(2, false);
  };

  const _Scene_Message_associateWindows = Scene_Message.prototype.associateWindows;
  Scene_Message.prototype.associateWindows = function () {
    _Scene_Message_associateWindows.call(this);
    this._choiceListWindow.setHelpWindow(this._helpWindow);
  };

  const _Window_ChoiceList_updateHelp = Window_ChoiceList.prototype.updateHelp;
  Window_ChoiceList.prototype.updateHelp = function () {
    _Window_ChoiceList_updateHelp.call(this);
    const helpText = $gameMessage.choiceHelp()[this.index()];
    if (helpText) {
      this._helpWindow.setText(helpText);
      this._helpWindow.open();
    } else {
      this._helpWindow.setText('');
      this._helpWindow.close();
    }
  };

  const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
  Window_ChoiceList.prototype.close = function () {
    _Window_ChoiceList_close.call(this);
    if (this._helpWindow) {
      this._helpWindow.close();
    }
  };
})();
