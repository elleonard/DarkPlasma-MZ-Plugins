/// <reference path="./ChoiceExtension.d.ts" />

import { settings } from './_build/DarkPlasma_ChoiceExtension_parameters';

const EVENT_COMMAND = {
  CHOICE_START: 102,
  CHOICE_BRANCH: 402,
  CHOICE_END: 404,
};

/**
 * 一つにまとめた選択肢開始コマンド
 */
class Game_MergedSequencialChoicesIndex {
  _index: number;
  _sequencialChoiceIndex: number;

  constructor(index: number, sequencialChoiceIndex: number) {
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
   */
  merged(): boolean {
    return this.sequencialChoiceIndex > 0;
  }
}

/**
 * 選択肢の分岐先コマンド位置及び、分岐結果位置（選択肢ウィンドウのindexに対応する）
 */
class Game_ChoiceBranchIndex {
  _commandIndex: number;
  _branchIndex: number;

  constructor(commandIndex: number, branchIndex: number) {
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

function Game_Message_ChoiceExtensionMixIn(gameMessage: Game_Message) {
  const _clear = gameMessage.clear;
  gameMessage.clear = function () {
    _clear.call(this);
    this._choiceEnabled = [];
    this._originalChoices = [];
  };
  
  gameMessage.setChoiceEnabled = function (choiceEnabled) {
    this._choiceEnabled = choiceEnabled;
  };
  
  gameMessage.choiceEnabled = function () {
    return this._choiceEnabled;
  };
  
  gameMessage.setOriginalChoices = function (originalChoices) {
    this._originalChoices = originalChoices;
  };
  
  /**
   * 元々の選択肢設定を、下記形式のオブジェクトの配列として返す
   * {
   *   displayName: string,
   *   displayed: boolean,
   *   enabled: boolean
   * }
   * @return {object[]}
   */
  gameMessage.originalChoices = function () {
    return this._originalChoices;
  };
  
  /**
   * 元々の選択肢設定の中で、表示すべきものの元々のインデックス一覧を返す
   */
  gameMessage.originalIndexOfDiplayedChoices = function () {
    const result: number[] = [];
    this.originalChoices().forEach((choice, index) => {
      if (choice.displayed) {
        result.push(index);
      }
    });
    return result;
  };
}

Game_Message_ChoiceExtensionMixIn(Game_Message.prototype);

function Game_Interpreter_ChoiceExtensionMixIn(gameInterpreter: Game_Interpreter) {
  const _setup = gameInterpreter.setup;
  gameInterpreter.setup = function (list, eventId) {
    _setup.call(this, list, eventId);
    this._mergedChoices = [];
    this._choiceBranches = [];
  };
  
  gameInterpreter.currentCommandIsMergedChoice = function () {
    const mergedChoice = this._mergedChoices.find((mergedChoice) => mergedChoice.index === this._index);
    return !!mergedChoice && mergedChoice.merged();
  };
  
  gameInterpreter.setupChoices = function (params) {
    if (this.currentCommandIsMergedChoice()) {
      return;
    }
    const choices = this.mergeSequencialChoices();
    const displayedChoices = choices.filter((choice) => choice.displayed);
    const cancelType = params[1] < choices.length ? ((originalCancelIndex: number) => {
      /**
       * キャンセル時の選択肢が表示されているなら、そこに合わせる
       */
      const originalCancelChoice = choices[originalCancelIndex];
      if (originalCancelChoice.displayed) {
        return displayedChoices.indexOf(originalCancelChoice);
      }
      /**
       * 表示されていない場合は、何もしない (全選択結果をスキップ)
       */
      return -2;
    })(params[1]) : -2;
    const defaultType = params.length > 2 ? params[2] || 0 : 0;
    const positionType = params.length > 3 ? params[3] : 2;
    const background = params.length > 4 ? params[4] || 0 : 0;
    $gameMessage.setChoices(
      displayedChoices.map((choice) => choice.displayName),
      defaultType,
      cancelType
    );
    $gameMessage.setChoiceEnabled(displayedChoices.map((choice) => choice.enabled));
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType === undefined ? 2 : positionType);
    $gameMessage.setChoiceCallback((n) => {
      this._branch[this._indent] = n;
    });
    $gameMessage.setOriginalChoices(choices);
  };
  
  /**
   * 連続した選択肢の内容をマージする
   */
  gameInterpreter.mergeSequencialChoices = function () {
    let choices: OriginalChoice[] = [];
    let branchIndex = 0;
    for (
      let commandIndex = this._index, sequencialChoiceIndex = 0;
      commandIndex !== -1;
      commandIndex = this.followingChoiceCommandIndex(commandIndex), sequencialChoiceIndex++
    ) {
      this._mergedChoices.push(new Game_MergedSequencialChoicesIndex(commandIndex, sequencialChoiceIndex));
      this._list![commandIndex].parameters[0].forEach((choice: string, index: number) => {
        let choiceDisplayName = choice.replace(/\s*if\((.*?)\)/, '').replace(/\s*en\((.*?)\)/, '');
        let isDisplayed = /\s*if\((.*?)\)/.test(choice) ? this.evalChoiceIf(choice) : true;
        let isEnabled = /s*en\((.*?)\)/.test(choice) ? this.evalChoiceEnabled(choice) : true;
        if (isDisplayed) {
          this._choiceBranches.push(
            new Game_ChoiceBranchIndex(this.findChoiceBranchCommandIndex(commandIndex, index), branchIndex)
          );
          branchIndex++;
        }
        choices.push({
          displayName: choiceDisplayName,
          displayed: isDisplayed,
          enabled: isEnabled,
        });
      });
    }
    return choices;
  };
  
  /**
   * 選択肢が有効であるかどうか返す
   * @param {string} choice 選択肢テキスト
   * @return {boolean}
   */
  gameInterpreter.evalChoiceEnabled = function (choice) {
    const match = /\s*en\((.*?)\)/.exec(choice);
    if (match) {
      return this.evalChoiceCondition(match[1]);
    }
    return true;
  };
  
  /**
   * 選択肢を表示すべきかどうか返す
   * @param {string} choice 選択肢テキスト
   * @return {boolean}
   */
  gameInterpreter.evalChoiceIf = function (choice) {
    const match = /\s*if\((.*?)\)/.exec(choice);
    if (match) {
      return this.evalChoiceCondition(match[1]);
    }
    return true;
  };
  
  gameInterpreter.evalChoiceCondition = function (condition) {
    try {
      const parsedCondition = condition
        .replace(/s\[(\d+)\]/g, (_, index) => String($gameSwitches.value(index)))
        .replace(/v\[(\d+)\]/g, (_, index) => String($gameVariables.value(index)));
      return !!eval(parsedCondition);
    } catch (e) {
      return false;
    }
  };
  
  /**
   * 検索元インデックス（選択肢開始コマンドを想定）と分岐インデックスから、
   * 対象の分岐コマンド位置を返す
   */
  gameInterpreter.findChoiceBranchCommandIndex = function (fromIndex, branchIndex) {
    const fromCommand = this._list![fromIndex];
    return (
      this._list!
        .slice(fromIndex)
        .findIndex(
          (command) =>
            command.code === EVENT_COMMAND.CHOICE_BRANCH &&
            command.indent === fromCommand.indent &&
            command.parameters[0] === branchIndex
        ) + fromIndex
    );
  };
  
  /**
   * 指定したインデックスから見て次の選択肢終了コマンド位置を返す
   * @param {number} fromIndex 検索元インデックス
   * @return {number}
   */
  gameInterpreter.findChoiceEndIndex = function (fromIndex) {
    const fromCommand = this._list![fromIndex];
    return (
      this._list!
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
  gameInterpreter.findChoiceStartIndex = function (fromIndex) {
    const fromCommand = this._list![fromIndex];
    return (
      fromIndex -
      this._list!
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
  gameInterpreter.followingChoiceCommandIndex = function (fromIndex) {
    const choiceEndCommandIndex = this.findChoiceEndIndex(fromIndex);
    const targetCommand = this._list![choiceEndCommandIndex + 1];
    return targetCommand.code === EVENT_COMMAND.CHOICE_START ? choiceEndCommandIndex + 1 : -1;
  };
  
  gameInterpreter.command402 = function (params) {
    const choiceBranchIndex = this._choiceBranches.find((choiceBranch) => choiceBranch.commandIndex === this._index);
    if (!choiceBranchIndex || this._branch[this._indent] !== choiceBranchIndex.branchIndex) {
      this.skipBranch();
    }
    return true;
  };
}

Game_Interpreter_ChoiceExtensionMixIn(Game_Interpreter.prototype);

function Window_ChoiceList_ChoiceExtensionMixin(windowChoiceList: Window_ChoiceList) {
  const _drawItem = windowChoiceList.drawItem;
  windowChoiceList.drawItem = function (index) {
    this.changePaintOpacity(this.isCommandEnabled(index));
    _drawItem.call(this, index);
  };
  
  windowChoiceList.makeCommandList = function () {
    const choices = $gameMessage.choices();
    const choiceEnabled = $gameMessage.choiceEnabled();
    choices.forEach((choice, index) => {
      this.addCommand(choice, 'choice', choiceEnabled[index]);
    });
  };
  
  windowChoiceList.maxLines = function () {
    return settings.maxPageRows;
  };
}

Window_ChoiceList_ChoiceExtensionMixin(Window_ChoiceList.prototype);

type _Game_ChoiceBranchIndex = typeof Game_ChoiceBranchIndex;
type _Game_MergedSequencialChoicesIndex = typeof Game_MergedSequencialChoicesIndex;
declare global {
  /**
   * セーブデータ互換性のために保持
   */
  var ChoiceBranchIndex: _Game_ChoiceBranchIndex;
  var MergedSequencialChoicesIndex: _Game_MergedSequencialChoicesIndex;

  var Game_ChoiceBranchIndex: _Game_ChoiceBranchIndex;
  var Game_MergedSequencialChoicesIndex: _Game_MergedSequencialChoicesIndex;
}

globalThis.ChoiceBranchIndex = Game_ChoiceBranchIndex;
globalThis.MergedSequencialChoicesIndex = Game_MergedSequencialChoicesIndex;

globalThis.Game_ChoiceBranchIndex = Game_ChoiceBranchIndex;
globalThis.Game_MergedSequencialChoicesIndex = Game_MergedSequencialChoicesIndex;
