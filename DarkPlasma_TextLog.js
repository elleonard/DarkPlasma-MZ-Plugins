// DarkPlasma_TextLog 1.1.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/11/03 1.1.0 開閉キーのpageup/pagedownを非推奨化
 *                  開閉キーでログウィンドウを閉じられない不具合を修正
 *                  決定キーでもログウィンドウを閉じられるように変更
 * 2022/11/02 1.0.0 公開
 */

/*:ja
 * @plugindesc イベントテキストのログを保持・表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param disableLoggingSwitch
 * @desc 設定したスイッチがONの間はログを残しません。0の場合、常にログを残します。
 * @text ログ記録無効スイッチ
 * @type switch
 * @default 0
 *
 * @param openLogKeys
 * @desc テキストログウィンドウを開閉するためのボタンを設定します。
 * @text ログ開閉ボタン
 * @type select[]
 * @option shift
 * @option control
 * @option tab
 * @option pageup (非推奨)
 * @value pageup
 * @option pagedown (非推奨)
 * @value pagedown
 * @default ["tab"]
 *
 * @param disableLogWindowSwitch
 * @desc 設定したスイッチがONの間はログウィンドウを開けません。0の場合、常に開けます。
 * @text ログウィンドウ無効スイッチ
 * @type switch
 * @default 0
 *
 * @param lineSpacing
 * @desc ログの行間を設定します。
 * @text ログの行間
 * @type number
 * @default 0
 *
 * @param messageSpacing
 * @desc ログのメッセージの間隔を設定します。メッセージはイベントコマンド単位でひとかたまりです。
 * @text メッセージ間隔
 * @type number
 * @default 0
 *
 * @param logSplitter
 * @desc イベントの切れ目などに挟むための区切り線を設定します。
 * @text ログ区切り線
 * @type string
 * @default -------------------------------------------------------
 *
 * @param autoSplit
 * @desc ONの場合、バトル、コモン、並列イベントを除くイベント終了時に区切り線を自動で入れます。
 * @text 自動区切り線
 * @type boolean
 * @default true
 *
 * @param choiceFormat
 * @desc ログに表示する選択肢のフォーマットを設定します。{choice}は選んだ選択肢に変換されます。
 * @text 選択肢フォーマット
 * @type string
 * @default 選択肢:{choice}
 *
 * @param choiceColor
 * @desc ログに表示する選択肢の色を設定します。
 * @text 選択肢色
 * @type number
 * @default 17
 *
 * @param choiceCancelText
 * @desc 選択肢をキャンセルした際に記録する内容を設定します。
 * @text キャンセルログ
 * @type string
 * @default キャンセル
 *
 * @param smoothBackFromLog
 * @desc ONの場合、ログシーンから戻った際にテキストを再度表示し直しません。
 * @text テキスト再表示なし
 * @type boolean
 * @default true
 *
 * @param backgroundImage
 * @desc ログシーンに表示する背景画像を設定します。
 * @text 背景画像
 * @type file
 * @dir img
 *
 * @param showLogWindowFrame
 * @desc ONの場合、ログウィンドウ枠を表示します。
 * @text ウィンドウ枠表示
 * @type boolean
 * @default true
 *
 * @param escapeCharacterCodes
 * @desc \XXX[YYY]の形式でYYYをログから消したい場合、ここにXXXを追加します。
 * @text パラメータを除外したい制御文字
 * @type string[]
 * @default []
 *
 * @param scrollSpeed
 * @desc 上下キーによるスクロールの速さを設定します。大きいほど速くなります。
 * @text スクロール速さ
 * @type number
 * @default 1
 * @min 1
 *
 * @param scrollSpeedHigh
 * @desc PageUp/PageDownキーによるスクロールの速さを設定します。
 * @text 高速スクロール速さ
 * @type number
 * @default 10
 * @min 1
 *
 * @command showTextLog
 * @text ログウィンドウを開く
 *
 * @command insertLogSplitter
 * @text ログに区切り線を追加する
 *
 * @command insertTextLog
 * @text ログに指定したテキストを追加する
 * @arg text
 * @text テキスト
 * @type string
 *
 * @help
 * version: 1.1.0
 * イベントで表示されたテキストをログとして保持、表示します。
 * ログはセーブデータには保持されません。
 *
 * マップ上、イベント中にログ開閉キーを押すことでログウィンドウを開きます。
 * ログ開閉キー、決定キー、キャンセルキーのいずれかでログウィンドウを閉じます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_insertTextLog(args) {
    return {
      text: String(args.text || ''),
    };
  }

  const command_showTextLog = 'showTextLog';

  const command_insertLogSplitter = 'insertLogSplitter';

  const command_insertTextLog = 'insertTextLog';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    disableLoggingSwitch: Number(pluginParameters.disableLoggingSwitch || 0),
    openLogKeys: JSON.parse(pluginParameters.openLogKeys || '["tab"]').map((e) => {
      return String(e || '');
    }),
    disableLogWindowSwitch: Number(pluginParameters.disableLogWindowSwitch || 0),
    lineSpacing: Number(pluginParameters.lineSpacing || 0),
    messageSpacing: Number(pluginParameters.messageSpacing || 0),
    logSplitter: String(pluginParameters.logSplitter || '-------------------------------------------------------'),
    autoSplit: String(pluginParameters.autoSplit || true) === 'true',
    choiceFormat: String(pluginParameters.choiceFormat || '選択肢:{choice}'),
    choiceColor: Number(pluginParameters.choiceColor || 17),
    choiceCancelText: String(pluginParameters.choiceCancelText || 'キャンセル'),
    smoothBackFromLog: String(pluginParameters.smoothBackFromLog || true) === 'true',
    backgroundImage: String(pluginParameters.backgroundImage || ''),
    showLogWindowFrame: String(pluginParameters.showLogWindowFrame || true) === 'true',
    escapeCharacterCodes: JSON.parse(pluginParameters.escapeCharacterCodes || '[]').map((e) => {
      return String(e || '');
    }),
    scrollSpeed: Number(pluginParameters.scrollSpeed || 1),
    scrollSpeedHigh: Number(pluginParameters.scrollSpeedHigh || 10),
  };

  PluginManager.registerCommand(pluginName, command_showTextLog, function (args) {
    SceneManager.push(Scene_TextLog);
  });
  PluginManager.registerCommand(pluginName, command_insertTextLog, function (args) {
    const parsedArgs = parseArgs_insertTextLog(args);
    $gameTemp.currentEventLog().pushLog('', parsedArgs.text);
  });
  PluginManager.registerCommand(pluginName, command_insertLogSplitter, function (args) {
    $gameTemp.currentEventLog().pushSplitter();
  });
  class EvacuatedMessageAndSubWindows {
    constructor(messageWindow, goldWindow, nameBoxWindow, choiceListWindow, numberInputWindow) {
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
  function Game_Temp_TextLogMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._evacuatedMessageAndSubWindows = null;
      this._currentEventLog = new Game_EventTextLog();
      this._pastEventLogs = [];
    };
    gameTemp.evacuatedMessageAndSubWindows = function () {
      return this._evacuatedMessageAndSubWindows;
    };
    gameTemp.setEvacuatedMessageAndSubWindows = function (windows) {
      this._evacuatedMessageAndSubWindows = windows;
    };
    gameTemp.clearEvacuatedMessageAndSubWindows = function () {
      this._evacuatedMessageAndSubWindows = null;
    };
    gameTemp.currentEventLog = function () {
      return this._currentEventLog;
    };
    gameTemp.pastEventLogs = function () {
      return this._pastEventLogs;
    };
    gameTemp.moveCurrentLogToPastLogs = function () {
      this._pastEventLogs.push(this.currentEventLog());
      this._currentEventLog = new Game_EventTextLog();
    };
  }
  Game_Temp_TextLogMixIn(Game_Temp.prototype);
  class Game_EventTextLog {
    constructor() {
      this._messages = [];
    }
    get messages() {
      return this._messages;
    }
    pushLog(speakerName, text) {
      this._messages.push(new Game_LogMessage(speakerName, text));
    }
    pushSplitter() {
      this.pushLog('', settings.logSplitter);
    }
  }
  class Game_LogMessage {
    constructor(speakerName, message) {
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
      return [this.speakerName, this.message].filter((text) => text).join('\n');
    }
  }
  function Game_Message_TextLogMixIn(gameMessage) {
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
  function Game_Interpreter_TextLogMixIn(gameInterpreter) {
    const _terminate = gameInterpreter.terminate;
    gameInterpreter.terminate = function () {
      if (this.mustSplitLogOnTeminate()) {
        if (settings.autoSplit) {
          $gameTemp.currentEventLog().pushSplitter();
        }
        $gameTemp.moveCurrentLogToPastLogs();
      }
      _terminate.call(this);
    };
    /**
     * 終了時にイベントログを区切って過去ログ送りにする条件
     * - 深さ0（イベントから呼び出されたコモンイベントでない）
     * - 正のイベントIDを持つ（自動実行コモンイベント、並列実行コモンイベント、バトルイベントでない）
     * - 並列実行イベントでない
     * - 終了するイベントのテキストログが1件以上存在する
     */
    gameInterpreter.mustSplitLogOnTeminate = function () {
      return (
        this._depth === 0 &&
        this._eventId > 0 &&
        !this.isOnParallelEvent() &&
        $gameTemp.currentEventLog().messages.length > 0
      );
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
    create() {
      super.create();
      this.createBackground();
      this.createWindowLayer();
      this.createTextLogWindow();
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
      return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    }
  }
  function Scene_Map_TextLogMixIn(sceneMap) {
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
        this._messageWindow = $gameTemp.evacuatedMessageAndSubWindows().messageWindow;
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
        this._goldWindow = $gameTemp.evacuatedMessageAndSubWindows().goldWindow;
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
        this._nameBoxWindow = $gameTemp.evacuatedMessageAndSubWindows().nameBoxWindow;
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
        this._choiceListWindow = $gameTemp.evacuatedMessageAndSubWindows().choiceListWindow;
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
        this._numberInputWindow = $gameTemp.evacuatedMessageAndSubWindows().numberInputWindow;
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
      return settings.openLogKeys.some((key) => Input.isTriggered(key));
    };
    sceneMap.callTextLog = function () {
      if (settings.smoothBackFromLog) {
        $gameTemp.setEvacuatedMessageAndSubWindows(
          new EvacuatedMessageAndSubWindows(
            this._messageWindow,
            this._goldWindow,
            this._nameBoxWindow,
            this._choiceListWindow,
            this._numberInputWindow
          )
        );
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
    constructor(message, height, heightFromBottom) {
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
    initialize(rect) {
      super.initialize(rect);
      this.setupLogMessages();
      this._scrollY = this.maxScrollY();
      this.refresh();
      this.activate();
    }
    maxItems() {
      return this._messages.length;
    }
    itemHeight() {
      return this.lineHeight();
    }
    lineHeight() {
      return super.lineHeight() + settings.lineSpacing;
    }
    setupLogMessages() {
      let messages = [];
      if ($gameTemp.pastEventLogs().length > 0) {
        messages = $gameTemp
          .pastEventLogs()
          .map((pastLog) => pastLog.messages)
          .reduce((result, log) => result.concat(log), []);
      }
      if ($gameTemp.currentEventLog().messages.length > 0) {
        messages.push(...$gameTemp.currentEventLog().messages);
      }
      let fromBottom = 0;
      this._messages = Array.from(messages)
        .reverse()
        .map((message) => {
          const height = this.calcMessageHeight(message);
          fromBottom += height;
          return new LogMessageForView(message, height, fromBottom);
        })
        .reverse();
    }
    overallHeight() {
      return this._messages.length > 0 ? this._messages[0].heightFromBottom : this.innerHeight;
    }
    isCursorMovable() {
      return true;
    }
    cursorUp(wrap) {
      this.smoothScrollUp(settings.scrollSpeed);
    }
    cursorDown(wrap) {
      this.smoothScrollDown(settings.scrollSpeed);
    }
    cursorPageup() {
      this.smoothScrollUp(settings.scrollSpeedHigh);
    }
    cursorPagedown() {
      this.smoothScrollDown(settings.scrollSpeedHigh);
    }
    isCancelTriggered() {
      return (
        super.isCancelTriggered() || this.isOkEnabled() || settings.openLogKeys.some((key) => Input.isTriggered(key))
      );
    }
    paint() {
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
      this._messages.forEach((message) => {
        this.drawTextEx(message.text(), x, height + Math.floor(settings.lineSpacing / 2) - this.scrollBaseY());
        height += message.height;
      });
    }
    /**
     * ログウィンドウに描画する上でのサイズ計算のため、X座標の初期位置指定をする必要がある。
     * そのため、上書きする。
     */
    textSizeEx(text) {
      this.resetFontSettings();
      const textState = this.createTextState(text, 4, 0, this.innerWidth);
      textState.drawing = false;
      this.processAllText(textState);
      return { width: textState.outputWidth, height: textState.outputHeight };
    }
    calcMessageHeight(message) {
      return this.textSizeEx(message.text()).height + settings.messageSpacing;
    }
    select() {}
    update() {
      super.update();
      this.updateArrows();
    }
    processEscapeCharacter(code, textState) {
      super.processEscapeCharacter(code, textState);
      if (settings.escapeCharacterCodes.includes(code)) {
        this.obtainEscapeParamText(textState);
      }
    }
    /**
     * [YYY]のYYYを取り出し、カンマ区切りで配列化して返す
     */
    obtainEscapeParamText(textState) {
      const arr = /^\[(.+?)\]/.exec(textState.text.slice(textState.index));
      if (arr) {
        textState.index += arr[0].length;
        return arr[1].split(',');
      } else {
        return [];
      }
    }
  }
  function Window_Message_TextLogMixIn(windowClass) {
    const _terminateMessage = windowClass.terminateMessage;
    windowClass.terminateMessage = function () {
      if (!settings.disableLoggingSwitch || !$gameSwitches.value(settings.disableLoggingSwitch)) {
        if ($gameMessage.allText()) {
          $gameTemp
            .currentEventLog()
            .pushLog($gameMessage.speakerName(), this.convertEscapeCharacters($gameMessage.allText()));
        }
        if ($gameMessage.isChoice()) {
          $gameTemp
            .currentEventLog()
            .pushLog(
              '',
              settings.choiceFormat.replace(
                /{choice}/gi,
                `\x1bC[${settings.choiceColor}]${$gameMessage.chosenText()}\x1bC[0]`
              )
            );
        }
      }
      _terminateMessage.call(this);
    };
  }
  Window_Message_TextLogMixIn(Window_Message.prototype);
  globalThis.Game_EventTextLog = Game_EventTextLog;
  globalThis.Game_LogMessage = Game_LogMessage;
  globalThis.Scene_TextLog = Scene_TextLog;
})();
