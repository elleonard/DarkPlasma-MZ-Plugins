/// <reference path="../../typings/rmmz.d.ts" />

type OriginalChoice = {
  displayName: string;
  displayed: boolean;
  enabled: boolean;
};

/**
 * 一つにまとめた選択肢開始コマンド
 */
interface Game_MergedSequencialChoicesIndex {
  _index: number;
  _sequencialChoiceIndex: number;

  readonly index: number;
  readonly sequencialChoiceIndex: number;
  /**
   * 別の選択肢にマージされている
   */
  merged(): boolean;
}

/**
 * 選択肢の分岐先コマンド位置及び、分岐結果位置（選択肢ウィンドウのindexに対応する）
 */
interface Game_ChoiceBranchIndex {
  _commandIndex: number;
  _branchIndex: number;

  readonly commandIndex: number;
  readonly branchIndex: number;
}

declare interface Game_Message {
  _choiceEnabled: boolean[];
  _originalChoices: OriginalChoice[];

  setChoiceEnabled(choiceEnabled: boolean[]): void;
  choiceEnabled(): boolean[];
  setOriginalChoices(originalChoices: OriginalChoice[]): void;
  originalChoices(): OriginalChoice[];

  originalIndexOfDiplayedChoices(): number[];
}

declare interface Game_Interpreter {
  _mergedChoices: Game_MergedSequencialChoicesIndex[];
  _choiceBranches: Game_ChoiceBranchIndex[];

  currentCommandIsMergedChoice(): boolean;
  mergeSequencialChoices(): OriginalChoice[];

  evalChoiceEnabled(choice: string): boolean;
  evalChoiceIf(choice: string): boolean;
  evalChoiceCondition(condition: string): any;
  findChoiceBranchCommandIndex(fromIndex: number, branchIndex: number): number;
  findChoiceEndIndex(fromIndex: number): number;
  findChoiceStartIndex(fromIndex: number): number;
  followingChoiceCommandIndex(fromIndex: number): number;
}
