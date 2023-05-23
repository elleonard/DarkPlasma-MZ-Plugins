/// <reference path="../../typings/rmmz.d.ts" />

declare namespace PluginManagerEx {
  function convertEscapeCharacters(text: string, data: any): string;
}

declare interface InputSymbol {
  readonly name: string;
  readonly symbolText: string;
  buttonId(): number;
  buttonName(buttonNameType: number): string;
  behavior(key: string): string;
}

declare namespace Input {
  function triggeredGamepadButtonId(): number|null;
  function createInputSymbol(name: string, text: string, behavior: Map<string, string>, key: string): InputSymbol;
  function inputSymbols(): InputSymbol[];
  function inputBehaviorKeys(): string[];
  function inputBehaviorKeyName(key: string): string;
}

declare namespace ConfigManager {
  interface Config {
    gamepadConfig: { [gamepadButton: number]: string };
    /**
     * ゲームパッド設定画面で出すボタン名
     */
    buttonNameType: number;
    /**
     * 操作説明で出すボタン名
     */
    manualButtonType: number;
  }
  var manualButtonType: number;
  var buttonNameType: number;
  var gamepadConfig: { [gamepadButton: number]: string };
}

declare interface Window_Base {
  getManualButtonName(symbol: string): string;
}

declare interface Window_Options {
  manualStatusText(value: number): string;
  changeManualButtonType(forward: boolean): void;
}
