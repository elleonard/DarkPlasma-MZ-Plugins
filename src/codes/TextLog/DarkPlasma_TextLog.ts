/// <reference path="./TextLog.d.ts" />

import { pluginName } from "../../common/pluginName";
import { command_insertLogSplitter, command_insertTextLog, command_showTextLog, parseArgs_insertTextLog } from "./_build/DarkPlasma_TextLog_commands";
import { settings } from "./_build/DarkPlasma_TextLog_parameters";
import { Window_ObtainEscapeParamTextMixIn } from '../../common/window/obtainEscapeParamText';

PluginManager.registerCommand(pluginName, command_showTextLog, function(args) {
  SceneManager.push(Scene_TextLog);
});

PluginManager.registerCommand(pluginName, command_insertTextLog, function(args) {
  const parsedArgs = parseArgs_insertTextLog(args);
  $gameTemp.eventTextLog().pushLog("", parsedArgs.text);
});

PluginManager.registerCommand(pluginName, command_insertLogSplitter, function(args) {
  $gameTemp.eventTextLog().pushSplitter();
});

class EvacuatedMessageAndSubWindows {
  _messageWindow: Window_Message;
  _goldWindow: Window_Gold;
  _nameBoxWindow: Window_NameBox;
  _choiceListWindow: Window_ChoiceList;
  _numberInputWindow: Window_NumberInput;

  constructor(
    messageWindow: Window_Message,
    goldWindow: Window_Gold,
    nameBoxWindow: Window_NameBox,
    choiceListWindow: Window_ChoiceList,
    numberInputWindow: Window_NumberInput
  ) {
    this._messageWindow = messageWindow;
    this._goldWindow = goldWindow;
    this._nameBoxWindow = nameBoxWindow;
    this._choiceListWindow = choiceListWindow;
    this._numberInputWindow = numberInputWindow;
  }

  get messageWindow() {
    return this._messageWindow;
  }

  get goldWindow() {
    return this._goldWindow;
  }

  get nameBoxWindow() {
    return this._nameBoxWindow;
  }

  get choiceListWindow() {
    return this._choiceListWindow;
  }

  get numberInputWindow() {
    return this._numberInputWindow;
  }
}

function Game_Temp_TextLogMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._evacuatedMessageAndSubWindows = null;
    this._eventTextLog = new Game_EventTextLog();
    this._callTextLogOnMap = false;
  };

  gameTemp.evacuatedMessageAndSubWindows = function() {
    return this._evacuatedMessageAndSubWindows;
  };

  gameTemp.setEvacuatedMessageAndSubWindows = function (windows) {
    this._evacuatedMessageAndSubWindows = windows;
  }

  gameTemp.clearEvacuatedMessageAndSubWindows = function () {
    this._evacuatedMessageAndSubWindows = null;
  };

  gameTemp.eventTextLog = function () {
    return this._eventTextLog;
  };

  gameTemp.requestCallTextLogOnMap = function () {
    this._callTextLogOnMap = true;
  };

  gameTemp.clearCallTextLogOnMapRequest = function () {
    this._callTextLogOnMap = false;
  };

  gameTemp.isCallTextLogOnMapRequested = function () {
    return this._callTextLogOnMap;
  };
}

Game_Temp_TextLogMixIn(Game_Temp.prototype);

class Game_EventTextLog {
  _messages: Game_LogMessage[];

  constructor() {
    this._messages = [];
  }

  get messages() {
    return this._messages;
  }

  pushLog(speakerName: string, text: string) {
    this._messages.push(new Game_LogMessage(speakerName, text));
    if (settings.maxLogMessages < this._messages.length) {
      this._messages.splice(0, this._messages.length - settings.maxLogMessages);
    }
  }

  pushSplitter() {
    this.pushLog("", settings.logSplitter);
  }

  latestMessageIsLogSplitter() {
    return this.messages.length <= 0 ? false : this.messages[this.messages.length-1].isLogSplitter()
  }
}

class Game_LogMessage {
  _speakerName: string;
  _message: string;

  constructor(speakerName: string, message: string) {
    this._speakerName = speakerName;
    this._message = message;
  }

  get speakerName() {
    return this._speakerName;
  }

  get message() {
    return this._message;
  }

  text() {
    return [this.speakerName, this.message].filter(text => text).join('\n');
  }

  isLogSplitter() {
    return this.message === settings.logSplitter;
  }
}

function Game_Message_TextLogMixIn(gameMessage: Game_Message) {
  const _clear = gameMessage.clear;
  gameMessage.clear = function () {
    _clear.call(this);
    this._chosenIndex = null;
  };

  const _onChoice = gameMessage.onChoice;
  gameMessage.onChoice = function (n) {
    this._chosenIndex = n;
    _onChoice.call(this, n);
  };

  gameMessage.chosenIndex = function () {
    return this._chosenIndex || 0;
  };

  gameMessage.chosenText = function () {
    /**
     * キャンセルした場合
     */
    if (this.choiceCancelType() < 0 && this.chosenIndex() < 0) {
      return settings.choiceCancelText;
    }
    return this.choices()[this.chosenIndex()];
  };
}

Game_Message_TextLogMixIn(Game_Message.prototype);

function Game_Interpreter_TextLogMixIn(gameInterpreter: Game_Interpreter) {
  const _terminate = gameInterpreter.terminate;
  gameInterpreter.terminate = function () {
    if (this.mustSplitLogOnTeminate()) {
      $gameTemp.eventTextLog().pushSplitter();
    }
    _terminate.call(this);
  };

  /**
   * 終了時にイベントログを区切る(自動区切り線を挿入する)条件
   * - 自動区切り線設定がON
   * - 深さ0（イベントから呼び出されたコモンイベントでない）
   * - 正のイベントIDを持つ（自動実行コモンイベント、並列実行コモンイベント、バトルイベントでない）
   * - 並列実行イベントでない
   * - ログが1件以上存在する
   * - 最後のログが区切り線でない
   */
  gameInterpreter.mustSplitLogOnTeminate = function () {
    return settings.autoSplit
      && this._depth === 0
      && this._eventId > 0
      && !this.isOnParallelEvent()
      && $gameTemp.eventTextLog().messages.length > 0
      && !$gameTemp.eventTextLog().latestMessageIsLogSplitter();
  };

  /**
   * マップ上の並列実行イベントで実行されているかどうか
   */
  gameInterpreter.isOnParallelEvent = function () {
    return $gameMap.event(this._eventId)?.isTriggerIn([4]) && this.isOnCurrentMap();
  };
}

Game_Interpreter_TextLogMixIn(Game_Interpreter.prototype);

class Scene_TextLog extends Scene_Base {
  _backgroundSprite: Sprite;
  _textLogWindow: Window_TextLog;
  _cancelButton: Sprite_Button|undefined;

  create() {
    super.create();
    this.createBackground();
    this.createWindowLayer();
    this.createTextLogWindow();
    this.createButtons();
  }

  createBackground() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = this.backgroundImage();
    this.addChild(this._backgroundSprite);
  }

  backgroundImage() {
    if (settings.backgroundImage) {
      return ImageManager.loadBitmap('img/', settings.backgroundImage);
    }
    return SceneManager.backgroundBitmap();
  }

  createTextLogWindow() {
    this._textLogWindow = new Window_TextLog(this.textLogWindowRect());
    this._textLogWindow.setHandler('cancel', this.popScene.bind(this));
    if (!settings.showLogWindowFrame) {
      this._textLogWindow.setBackgroundType(2);
    }
    this.addWindow(this._textLogWindow);
  }

  textLogWindowRect() {
    const y = ConfigManager.touchUI ? this.buttonAreaBottom() : 0;
    return new Rectangle(
      0,
      y,
      Graphics.boxWidth,
      Graphics.boxHeight - y
    );
  }

  createButtons() {
    if (ConfigManager.touchUI) {
      this._cancelButton = new Sprite_Button('cancel');
      this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
      this._cancelButton.y = this.buttonY();
      this.addChild(this._cancelButton);
    }
  }
}

function Scene_Map_TextLogMixIn(sceneMap: Scene_Map) {
  const _start = sceneMap.start;
  sceneMap.start = function () {
    _start.call(this);
    this.textLogCalling = false;
  };

  const _createAllWindows = sceneMap.createAllWindows;
  sceneMap.createAllWindows = function () {
    _createAllWindows.call(this);
    $gameTemp.clearEvacuatedMessageAndSubWindows();
  };

  const _createMessageWindow = sceneMap.createMessageWindow;
  sceneMap.createMessageWindow = function () {
    /**
     * ログシーンからスムーズに戻るために、メッセージウィンドウ及びそのサブウィンドウを使い回す
     * サブウィンドウ全てに似た処理を書くのは敗北感があるが、ひとまず許容する
     */
    if (settings.smoothBackFromLog && $gameTemp.evacuatedMessageAndSubWindows()) {
      this._messageWindow = $gameTemp.evacuatedMessageAndSubWindows()!.messageWindow;
      this.addWindow(this._messageWindow);
    } else {
      _createMessageWindow.call(this);
    }
    if (settings.smoothBackFromLog) {
      /**
       * destroyされると使い回せないため、処理を上書きしておく
       */
      this._messageWindow.destroy = () => {};
    }
  };

  const _createGoldWindow = sceneMap.createGoldWindow;
  sceneMap.createGoldWindow = function () {
    if (settings.smoothBackFromLog && $gameTemp.evacuatedMessageAndSubWindows()) {
      this._goldWindow = $gameTemp.evacuatedMessageAndSubWindows()!.goldWindow;
      this.addWindow(this._goldWindow);
    } else {
      _createGoldWindow.call(this);
    }
    if (settings.smoothBackFromLog) {
      this._goldWindow.destroy = () => {};
    }
  };

  const _createNameBoxWindow = sceneMap.createNameBoxWindow;
  sceneMap.createNameBoxWindow = function () {
    if (settings.smoothBackFromLog && $gameTemp.evacuatedMessageAndSubWindows()) {
      this._nameBoxWindow = $gameTemp.evacuatedMessageAndSubWindows()!.nameBoxWindow;
      this.addWindow(this._nameBoxWindow);
    } else {
      _createNameBoxWindow.call(this);
    }
    if (settings.smoothBackFromLog) {
      this._nameBoxWindow.destroy = () => {};
    }
  };

  const _createChoiceListWindow = sceneMap.createChoiceListWindow;
  sceneMap.createChoiceListWindow = function () {
    if (settings.smoothBackFromLog && $gameTemp.evacuatedMessageAndSubWindows()) {
      this._choiceListWindow = $gameTemp.evacuatedMessageAndSubWindows()!.choiceListWindow;
      this.addWindow(this._choiceListWindow);
    } else {
      _createChoiceListWindow.call(this);
    }
    if (settings.smoothBackFromLog) {
      this._choiceListWindow.destroy = () => {};
    }
  };

  const _createNumberInputWindow = sceneMap.createNumberInputWindow;
  sceneMap.createNumberInputWindow = function () {
    if (settings.smoothBackFromLog && $gameTemp.evacuatedMessageAndSubWindows()) {
      this._numberInputWindow = $gameTemp.evacuatedMessageAndSubWindows()!.numberInputWindow;
      this.addWindow(this._numberInputWindow);
    } else {
      _createNumberInputWindow.call(this);
    }
    if (settings.smoothBackFromLog) {
      this._numberInputWindow.destroy = () => {};
    }
  };

  const _update = sceneMap.update;
  sceneMap.update = function () {
    _update.call(this);
    if (!SceneManager.isSceneChanging()) {
      this.updateCallTextLog();
    }
  };

  sceneMap.updateCallTextLog = function () {
    if (this.isTextLogEnabled()) {
      if (this.isTextLogCalled()) {
        this.textLogCalling = true;
        $gameTemp.clearCallTextLogOnMapRequest();
      }
      if (this.textLogCalling && !$gamePlayer.isMoving()) {
        this.callTextLog();
      }
    } else {
      this.textLogCalling = false;
    }
  };

  sceneMap.isTextLogEnabled = function () {
    return !settings.disableLogWindowSwitch || !$gameSwitches.value(settings.disableLogWindowSwitch);
  };

  sceneMap.isTextLogCalled = function () {
    return settings.openLogKeys.some((key: string) => Input.isTriggered(key)) || $gameTemp.isCallTextLogOnMapRequested();
  };

  sceneMap.callTextLog = function () {
    if (settings.smoothBackFromLog) {
      $gameTemp.setEvacuatedMessageAndSubWindows(new EvacuatedMessageAndSubWindows(
        this._messageWindow,
        this._goldWindow,
        this._nameBoxWindow,
        this._choiceListWindow,
        this._numberInputWindow
      ));
    }
    SoundManager.playCursor();
    SceneManager.push(Scene_TextLog);
    $gameTemp.clearDestination();
    this._mapNameWindow?.hide();
    this._waitCount = 2;
  };
}

Scene_Map_TextLogMixIn(Scene_Map.prototype);

class LogMessageForView {
  _message: Game_LogMessage;
  _height: number;
  _heightFromBottom: number;

  constructor(message: Game_LogMessage, height: number, heightFromBottom: number) {
    this._message = message;
    this._height = height;
    this._heightFromBottom = heightFromBottom;
  }

  get height() {
    return this._height;
  }

  get heightFromBottom() {
    return this._heightFromBottom;
  }

  text() {
    return this._message.text();
  }
}

/**
 * Selectableは意味が違う。Scrollableのほうが正しい。
 * ただし、handlerやキー操作の仕組みはSelectableのものを使いたい。
 */
class Window_TextLog extends Window_Selectable {
  _messages: LogMessageForView[];

  initialize(rect: Rectangle) {
    super.initialize(rect);
    this.setupLogMessages();
    this._scrollY = this.maxScrollY();
    this.refresh();
    this.activate();
  }

  public maxItems(): number {
    return this._messages.length;
  }

  public itemHeight(): number {
    return this.lineHeight();
  }

  public lineHeight(): number {
    return super.lineHeight() + settings.lineSpacing;
  }

  setupLogMessages() {
    let fromBottom = 0;
    this._messages = Array.from($gameTemp.eventTextLog().messages).reverse().map(message => {
      const height = this.calcMessageHeight(message);
      fromBottom += height;
      return new LogMessageForView(message, height, fromBottom);
    }).reverse();
  }

  overallHeight() {
    return this._messages.length > 0 ? this._messages[0].heightFromBottom : this.innerHeight;
  }

  public isCursorMovable(): boolean {
    return true;
  }

  public cursorUp(wrap?: boolean | undefined): void {
    this.smoothScrollUp(settings.scrollSpeed);
  }

  public cursorDown(wrap?: boolean | undefined): void {
    this.smoothScrollDown(settings.scrollSpeed);
  }

  public cursorPageup(): void {
    this.smoothScrollUp(settings.scrollSpeedHigh);
  }

  public cursorPagedown(): void {
    this.smoothScrollDown(settings.scrollSpeedHigh);
  }

  public isCancelTriggered(): boolean {
    return super.isCancelTriggered() || this.isOkTriggered() || settings.openLogKeys.some((key: string) => Input.isTriggered(key));
  }

  public paint(): void {
    if (this.contents) {
      this.contents.clear();
      this.drawTextLog();
    }
  }

  drawTextLog() {
    let height = 0;
    /**
     * メッセージウィンドウのデフォルト4に合わせる
     */
    const x = 4;
    this._messages.forEach(message => {
      this.drawTextEx(message.text(), x, height + Math.floor(settings.lineSpacing/2) - this.scrollBaseY());
      height += message.height;
    });
  }

  /**
   * ログウィンドウに描画する上でのサイズ計算のため、X座標の初期位置指定をする必要がある。
   * そのため、上書きする。
   */
  textSizeEx(text: string) {
    this.resetFontSettings();
    const textState = this.createTextState(text, 4, 0, this.innerWidth);
    textState.drawing = false;
    this.processAllText(textState);
    return { width: textState.outputWidth, height: textState.outputHeight };
  }

  calcMessageHeight(message: Game_LogMessage) {
    return this.textSizeEx(message.text()).height + settings.messageSpacing;
  }

  select() {}

  update() {
    super.update();
    this.updateArrows();
  }

  public processEscapeCharacter(code: string, textState: Window_Base.TextState): void {
    if (settings.escapeCharacterCodes.includes(code)) {
      this.obtainEscapeParamText(textState);
      return;
    }
    super.processEscapeCharacter(code, textState);
  }
}

Window_ObtainEscapeParamTextMixIn(Window_TextLog.prototype);

function Window_Message_TextLogMixIn(windowClass: Window_Message) {
  const _terminateMessage = windowClass.terminateMessage;
  windowClass.terminateMessage = function () {
    if (!settings.disableLoggingSwitch || !$gameSwitches.value(settings.disableLoggingSwitch)) {
      if ($gameMessage.allText()) {
        $gameTemp.eventTextLog().pushLog(
          this.convertEscapeCharacters($gameMessage.speakerName()),
          this.convertEscapeCharacters($gameMessage.allText())
        );
      }
      if ($gameMessage.isChoice()) {
        $gameTemp.eventTextLog().pushLog("", settings.choiceFormat.replace(/{choice}/gi, `\x1bC[${settings.choiceColor}]${$gameMessage.chosenText()}\x1bC[0]`));
      }
    }
    _terminateMessage.call(this);
  };
}

Window_Message_TextLogMixIn(Window_Message.prototype);

type _EvacuatedMessageAndSubWindows = typeof EvacuatedMessageAndSubWindows;
type _Game_EventTextLog = typeof Game_EventTextLog;
type _Game_LogMessage = typeof Game_LogMessage;
type _Scene_TextLog = typeof Scene_TextLog;
declare global {
  var EvacuatedMessageAndSubWindows: _EvacuatedMessageAndSubWindows;
  var Game_EventTextLog: _Game_EventTextLog;
  var Game_LogMessage: _Game_LogMessage;
  var Scene_TextLog: _Scene_TextLog;
}

globalThis.EvacuatedMessageAndSubWindows = EvacuatedMessageAndSubWindows;
globalThis.Game_EventTextLog = Game_EventTextLog;
globalThis.Game_LogMessage = Game_LogMessage;
globalThis.Scene_TextLog = Scene_TextLog;
