/// <reference path="../../typings/rmmz.d.ts" />

type OriginalChoice = {
  displayName: string;
  displayed: boolean;
  enabled: boolean;
};

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
