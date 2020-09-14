// DarkPlasma_ChoiceExtension 1.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/09/15 1.0.0 公開
 */

/*:ja
 * @plugindesc 選択肢を拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @param maxPageRows
 * @text 1ページの行数
 * @type number
 * @default 6
 *
 * @help
 * 選択肢を拡張します。
 *
 * 注意:
 *   本プラグインはMPP_ChoiceEXの機能を一部MZ対応していますが、
 *   積極的に全機能を移植するつもりはありません。
 *
 * 選択肢の文章中に
 * if(条件式)
 * を書くと、条件次第で項目の表示非表示を切り替えます。
 * MVプロジェクトの移行に用いてください。
 * en(条件式)
 * を書くと、条件次第で選択肢の有効無効を切り替えます。
 *
 * 条件式には下記の記法が使用できます
 * - v[n] (変数n番を参照する)
 * - s[n] (スイッチn番を参照する)
 *
 * 選択肢の書き方の例:
 * if(v[5]>3)hogehoge (変数5番の値が3より大の場合のみ選択肢hogehogeを表示する)
 * en(s[3])fugafuga (スイッチ3番がONの場合のみ選択肢fugafugaを有効にする)
 *
 * イベントコマンド「選択肢の表示」を続けて配置すると
 * それらに設定された選択肢をまとめて表示します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    maxPageRows: Number(pluginParameters.maxPageRows || 6),
  };

  const EVENT_COMMAND = {
    CHOICE_START: 102,
    CHOICE_BRANCH: 402,
    CHOICE_END: 404,
  };

  /**
   * 一つにまとめた選択肢開始コマンド
   */
  class MergedSequencialChoicesIndex {
    constructor(index, sequencialChoiceIndex) {
      this._index = index;
      this._sequencialChoiceIndex = sequencialChoiceIndex;
    }

    get index() {
      return this._index;
    }

    get sequencialChoiceIndex() {
      return this._sequencialChoiceIndex;
    }

    /**
     * 別の選択肢にマージされている
     * @return {boolean}
     */
    merged() {
      return this.sequencialChoiceIndex > 0;
    }
  }

  /**
   * 選択肢の分岐先コマンド位置及び、分岐結果位置（選択肢ウィンドウのindexに対応する）
   */
  class ChoiceBranchIndex {
    constructor(commandIndex, branchIndex) {
      this._commandIndex = commandIndex;
      this._branchIndex = branchIndex;
    }

    get commandIndex() {
      return this._commandIndex;
    }

    get branchIndex() {
      return this._branchIndex;
    }
  }

  Game_Message.prototype.setChoiceEnabled = function (choiceEnabled) {
    this._choiceEnabled = choiceEnabled;
  };

  Game_Message.prototype.choiceEnabled = function () {
    return this._choiceEnabled;
  };

  const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
  Game_Interpreter.prototype.setup = function (list, eventId) {
    _Game_Interpreter_setup.call(this, list, eventId);
    this._mergedChoices = [];
    this._choiceBranches = [];
  };

  Game_Interpreter.prototype.currentCommandIsMergedChoice = function () {
    const mergedChoice = this._mergedChoices.find((mergedChoice) => mergedChoice.index === this._index);
    return mergedChoice && mergedChoice.merged();
  };

  Game_Interpreter.prototype.setupChoices = function (params) {
    if (this.currentCommandIsMergedChoice()) {
      return;
    }
    const choices = this.mergeSequencialChoices();
    const cancelType = params[1] < choices.length ? params[1] : -2;
    const defaultType = params.length > 2 ? params[2] : 0;
    const positionType = params.length > 3 ? params[3] : 2;
    const background = params.length > 4 ? params[4] : 0;
    $gameMessage.setChoices(
      choices.map((choice) => choice.displayName),
      defaultType,
      cancelType
    );
    $gameMessage.setChoiceEnabled(choices.map((choice) => choice.enabled));
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback((n) => {
      this._branch[this._indent] = n;
    });
  };

  /**
   * 連続した選択肢の内容をマージする
   */
  Game_Interpreter.prototype.mergeSequencialChoices = function () {
    let choices = [];
    let branchIndex = 0;
    for (
      let commandIndex = this._index, sequencialChoiceIndex = 0;
      commandIndex !== -1;
      commandIndex = this.followingChoiceCommandIndex(commandIndex), sequencialChoiceIndex++
    ) {
      this._mergedChoices.push(new MergedSequencialChoicesIndex(commandIndex, sequencialChoiceIndex));
      this._list[commandIndex].parameters[0].forEach((choice, index) => {
        let choiceDisplayName = choice;
        let choiceEnabled = true;
        if (/\s*if\((.*?)\)/.test(choice)) {
          choiceDisplayName = this.evalChoiceIf(choice);
        }
        if (choiceDisplayName !== '') {
          if (/s*en\((.*?)\)/.test(choiceDisplayName)) {
            choiceDisplayName = choiceDisplayName.replace(/s*en\((.*?)\)/, '');
            choiceEnabled = this.evalChoiceEnabled(choice);
          }
          this._choiceBranches.push(
            new ChoiceBranchIndex(this.findChoiceBranchCommandIndex(commandIndex, index), branchIndex)
          );
          branchIndex++;
          choices.push({ displayName: choiceDisplayName, enabled: choiceEnabled });
        }
      });
    }
    return choices;
  };

  Game_Interpreter.prototype.evalChoiceEnabled = function (choice) {
    const match = /\s*en\((.*?)\)/.exec(choice);
    if (match) {
      return this.evalChoiceCondition(match[1]);
    }
    return true;
  };

  Game_Interpreter.prototype.evalChoiceIf = function (choice) {
    const match = /\s*if\((.*?)\)/.exec(choice);
    if (match) {
      return this.evalChoiceCondition(match[1]) ? choice.replace(match[0], '') : '';
    }
    return choice;
  };

  Game_Interpreter.prototype.evalChoiceCondition = function (condition) {
    try {
      const parsedCondition = condition
        .replace(/s\[(\d+)\]/g, (_, index) => $gameSwitches.value(index))
        .replace(/v\[(\d+)\]/g, (_, index) => $gameVariables.value(index));
      return !!eval(parsedCondition);
    } catch (e) {
      return false;
    }
  };

  /**
   * 検索元インデックス（選択肢開始コマンドを想定）と分岐インデックスから、
   * 対象の分岐コマンド位置を返す
   * @param {number} fromIndex 検索元インデックス
   * @param {number} branchIndex 分岐インデックス
   * @return {number}
   */
  Game_Interpreter.prototype.findChoiceBranchCommandIndex = function (fromIndex, branchIndex) {
    return (
      this._list
        .slice(fromIndex)
        .findIndex((command) => command.code === EVENT_COMMAND.CHOICE_BRANCH && command.parameters[0] === branchIndex) +
      fromIndex
    );
  };

  /**
   * 指定したインデックスから見て次の選択肢終了コマンド位置を返す
   * @param {number} fromIndex 検索元インデックス
   * @return {number}
   */
  Game_Interpreter.prototype.findChoiceEndIndex = function (fromIndex) {
    const fromCommand = this._list[fromIndex];
    return (
      this._list
        .slice(fromIndex)
        .findIndex((command) => fromCommand.indent === command.indent && command.code === EVENT_COMMAND.CHOICE_END) +
      fromIndex
    );
  };

  /**
   * 指定したインデックスの選択肢分岐コマンドの親となる選択肢開始コマンド位置を返す
   * @param {number} fromIndex 検索元インデックス
   * @return {number}
   */
  Game_Interpreter.prototype.findChoiceStartIndex = function (fromIndex) {
    const fromCommand = this._list[fromIndex];
    return (
      fromIndex -
      this._list
        .slice(0, fromIndex + 1)
        .reverse()
        .findIndex((command) => fromCommand.indent === command.indent && command.code === EVENT_COMMAND.CHOICE_START)
    );
  };

  /**
   * 指定したインデックスから連続した選択肢コマンド位置を返す
   * 連続していなければ-1を返す
   * @param {number} fromIndex 検索元インデックス
   * @return {number}
   */
  Game_Interpreter.prototype.followingChoiceCommandIndex = function (fromIndex) {
    const choiceEndCommandIndex = this.findChoiceEndIndex(fromIndex);
    const targetCommand = this._list[choiceEndCommandIndex + 1];
    return targetCommand.code === EVENT_COMMAND.CHOICE_START ? choiceEndCommandIndex + 1 : -1;
  };

  Game_Interpreter.prototype.command402 = function (params) {
    const choiceBranchIndex = this._choiceBranches.find((choiceBranch) => choiceBranch.commandIndex === this._index);
    if (!choiceBranchIndex || this._branch[this._indent] !== choiceBranchIndex.branchIndex) {
      this.skipBranch();
    }
    return true;
  };

  const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
  Window_ChoiceList.prototype.drawItem = function (index) {
    this.changePaintOpacity(this.isCommandEnabled(index));
    _Window_ChoiceList_drawItem.call(this, index);
  };

  Window_ChoiceList.prototype.makeCommandList = function () {
    const choices = $gameMessage.choices();
    const choiceEnabled = $gameMessage.choiceEnabled();
    choices.forEach((choice, index) => {
      this.addCommand(choice, 'choice', choiceEnabled[index]);
    });
  };

  Window_ChoiceList.prototype.maxLines = function () {
    return settings.maxPageRows;
  };
})();
