/// <reference path="../../typings/rmmz.d.ts" />

declare interface EvacuatedMessageAndSubWindows {
  readonly messageWindow: Window_Message;
  readonly goldWindow: Window_Gold;
  readonly nameBoxWindow: Window_NameBox;
  readonly choiceListWindow: Window_ChoiceList;
  readonly numberInputWindow: Window_NumberInput;
}

declare interface Game_LogMessage {
  _speakerName: string;
  _message: string;
  readonly speakerName: string;
  readonly message: string;
  text(): string;
}

declare interface Game_EventTextLog {
  _messages: Game_LogMessage[];
  readonly messages: Game_LogMessage[];

  pushLog(speakerName: string, text: string): void;
  pushSplitter(): void;
}

declare interface Game_Temp {
  _evacuatedMessageAndSubWindows: EvacuatedMessageAndSubWindows|null;

  _currentEventLog: Game_EventTextLog;
  _pastEventLogs: Game_EventTextLog[]

  setEvacuatedMessageAndSubWindows(windows: EvacuatedMessageAndSubWindows): void;
  evacuatedMessageAndSubWindows(): EvacuatedMessageAndSubWindows|null;
  clearEvacuatedMessageAndSubWindows(): void;

  currentEventLog(): Game_EventTextLog;
  pastEventLogs(): Game_EventTextLog[];
  moveCurrentLogToPastLogs(): void;
}

declare interface Game_Message {
  _chosenIndex: number|null;

  chosenIndex(): number;
  chosenText(): string;
}

declare interface Game_Interpreter {
  mustSplitLogOnTeminate(): boolean;
  isOnParallelEvent(): boolean;
}

declare interface Scene_Map {
  textLogCalling: boolean;

  reuseMessageOrSubWindow(targetWindowName: string): void;

  updateCallTextLog(): void;
  isTextLogEnabled(): boolean;
  isTextLogCalled(): boolean;
  callTextLog(): void;
}
