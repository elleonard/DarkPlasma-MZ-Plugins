import { settings } from './_build/DarkPlasma_ChoiceExtension_parameters';

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

const _Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  _Game_Message_clear.call(this);
  this._choiceEnabled = [];
  this._originalChoices = [];
};

Game_Message.prototype.setChoiceEnabled = function (choiceEnabled) {
  this._choiceEnabled = choiceEnabled;
};

Game_Message.prototype.choiceEnabled = function () {
  return this._choiceEnabled;
};

Game_Message.prototype.setOriginalChoices = function (originalChoices) {
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
Game_Message.prototype.originalChoices = function () {
  return this._originalChoices;
};

/**
 * 元々の選択肢設定の中で、表示すべきものの元々のインデックス一覧を返す
 * @return {number[]}
 */
Game_Message.prototype.originalIndexOfDiplayedChoices = function () {
  const result = [];
  this.originalChoices().forEach((choice, index) => {
    if (choice.displayed) {
      result.push(index);
    }
  });
  return result;
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
  const displayedChoices = choices.filter((choice) => choice.displayed);
  const cancelType = params[1] < choices.length ? params[1] : -2;
  const defaultType = params.length > 2 ? params[2] : 0;
  const positionType = params.length > 3 ? params[3] : 2;
  const background = params.length > 4 ? params[4] : 0;
  $gameMessage.setChoices(
    displayedChoices.map((choice) => choice.displayName),
    defaultType,
    cancelType
  );
  $gameMessage.setChoiceEnabled(displayedChoices.map((choice) => choice.enabled));
  $gameMessage.setChoiceBackground(background);
  $gameMessage.setChoicePositionType(positionType);
  $gameMessage.setChoiceCallback((n) => {
    this._branch[this._indent] = n;
  });
  $gameMessage.setOriginalChoices(choices);
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
      let choiceDisplayName = choice.replace(/\s*if\((.*?)\)/, '').replace(/\s*en\((.*?)\)/, '');
      let isDisplayed = /\s*if\((.*?)\)/.test(choice) ? this.evalChoiceIf(choice) : true;
      let isEnabled = /s*en\((.*?)\)/.test(choice) ? this.evalChoiceEnabled(choice) : true;
      if (isDisplayed) {
        this._choiceBranches.push(
          new ChoiceBranchIndex(this.findChoiceBranchCommandIndex(commandIndex, index), branchIndex)
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
Game_Interpreter.prototype.evalChoiceEnabled = function (choice) {
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
Game_Interpreter.prototype.evalChoiceIf = function (choice) {
  const match = /\s*if\((.*?)\)/.exec(choice);
  if (match) {
    return this.evalChoiceCondition(match[1]);
  }
  return true;
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
