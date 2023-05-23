// DarkPlasma_GamepadSettingBase 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/05/23 1.0.0 公開
 */

/*:
 * @plugindesc ゲームパッド設定の基底
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter PluginCommonBase
 *
 * @param keyMapper
 * @desc キーボード操作のマッピングを設定します。
 * @text キーマッピング
 * @type struct<KeyMapping>[]
 * @default ["{\"keyCode\":\"77\",\"action\":\"menu\"}","{\"keyCode\":\"83\",\"action\":\"special2\"}"]
 *
 * @param gamepadMapper
 * @desc ゲームパッド操作のマッピングを設定します。
 * @text ゲームパッドマッピング
 * @type struct<KeyMapping>[]
 * @default ["{\"keyCode\":\"6\",\"action\":\"special2\"}"]
 *
 * @param colsWidth
 * @text 項目幅
 * @type number
 * @default 124
 *
 * @help
 * version: 1.0.0
 * オプションにゲームパッド設定を提供します。
 *
 * テキスト中で \GAMEPAD[操作名] と入力すると
 * 操作説明ボタン表記に変換されます。
 *
 * 操作名一覧
 * ok: 決定
 * cancel: キャンセル
 * menu: メニュー
 * pageup: 左切替
 * pagedown: 右切替
 * shift: 特殊操作1
 * special2: 特殊操作2
 *
 * 入力例: \GAMEPAD[special2]
 *
 * Window_Base.prototype.getManualButtonName メソッドにより
 * 操作ボタン表記を取得できます。
 *
 * ゲームパッド設定を更にカスタマイズする場合は、
 * 追加プラグインで以下のメソッドを上書きしてください。
 *
 * Input.inputSymbols(): InputSymbol
 * Input.inputBehaviorKeys(): string[]
 * Input.inputBehaviorKeyName(key: string): string
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * PluginCommonBase
 */
/*~struct~KeyMapping:
 * @param keyCode
 * @desc キーまたはゲームパッドのボタンの番号を設定します。
 * @text キー番号
 * @type number
 *
 * @param action
 * @desc キーを押した際の動作を表す文字列を設定します。
 * @text 動作
 * @type select
 * @option menu
 * @option special2
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    keyMapper: JSON.parse(
      pluginParameters.keyMapper || '[{"keyCode":"77","action":"menu"},{"keyCode":"83","action":"special2"}]'
    ).map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          keyCode: Number(parsed.keyCode || 0),
          action: String(parsed.action || ``),
        };
      })(e || '{}');
    }),
    gamepadMapper: JSON.parse(pluginParameters.gamepadMapper || '[{"keyCode":"6","action":"special2"}]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          keyCode: Number(parsed.keyCode || 0),
          action: String(parsed.action || ``),
        };
      })(e || '{}');
    }),
    colsWidth: Number(pluginParameters.colsWidth || 124),
  };

  settings.keyMapper.forEach((mapping) => {
    Input.keyMapper[mapping.keyCode] = mapping.action;
  });
  settings.gamepadMapper.forEach((mapping) => {
    Input.gamepadMapper[mapping.keyCode] = mapping.action;
  });
  let gamepadMapperTemporary = {};
  const BUTTON_NAME_TYPE = {
    KEYBOARD: 0,
    DEFAULT: 1,
    DUALSHOCK4: 2,
    XBOX: 3,
  };
  const BUTTON_NAME_TYPE_TEXT = ['キーボード', 'ボタン番号', 'DS4', 'XBOX'];
  const BUTTON_NAME_DS4 = {
    0: '×',
    1: '○',
    2: '□',
    3: '△',
    4: 'L1',
    5: 'R1',
    6: 'L2',
    7: 'R2',
    8: 'share',
    9: 'options',
    10: 'L3',
    11: 'R3',
    16: 'PS',
    17: 'touch pad',
  };
  const BUTTON_NAME_XBOX = {
    0: 'B',
    1: 'A',
    2: 'X',
    3: 'Y',
    4: 'LB',
    5: 'RB',
    6: 'LT',
    7: 'RT',
    8: 'view',
    9: 'menu',
    10: 'LS',
    11: 'RS',
    16: 'GUIDE',
    17: '-',
  };
  class InputSymbol {
    constructor(name, text, behavior, keyname) {
      this._name = name;
      this._text = text;
      this._behavior = behavior;
      this._keyName = keyname;
    }
    get name() {
      return this._name;
    }
    get symbolText() {
      return this._text;
    }
    buttonId() {
      const mapper = gamepadMapperTemporary[12] ? gamepadMapperTemporary : Input.gamepadMapper;
      return Number(Object.keys(mapper).find((buttonId) => mapper[Number(buttonId)] === this._name));
    }
    buttonName(buttonNameType) {
      switch (buttonNameType) {
        case BUTTON_NAME_TYPE.KEYBOARD:
          return this._keyName;
        case BUTTON_NAME_TYPE.DEFAULT:
          return `Button${this.buttonId() + 1}`;
        case BUTTON_NAME_TYPE.DUALSHOCK4:
          return BUTTON_NAME_DS4[this.buttonId()] || '';
        case BUTTON_NAME_TYPE.XBOX:
          return BUTTON_NAME_XBOX[this.buttonId()] || '';
        default:
          return '';
      }
    }
    behavior(behaviorKey) {
      return this._behavior.get(behaviorKey) || '';
    }
  }
  globalThis.InputSymbol = InputSymbol;
  function Input_GamepadMixIn() {
    Input.triggeredGamepadButtonId = function () {
      const gamepads = navigator.getGamepads();
      if (gamepads) {
        const state = this._gamepadStates.find((state) => state.some((button) => button));
        return state ? state.findIndex((button) => button) : null;
      } else {
        return null;
      }
    };
    Input.createInputSymbol = function (name, text, behavior, key) {
      return new InputSymbol(name, text, behavior, key);
    };
    Input.inputSymbols = function () {
      return DEFAULT_INPUT_SYMBOLS;
    };
    Input.inputBehaviorKeys = function () {
      return ['menu', 'map', 'battle'];
    };
    Input.inputBehaviorKeyName = function (key) {
      switch (key) {
        case 'map':
          return 'マップ';
        case 'menu':
          return 'メニュー';
        case 'battle':
          return '戦闘';
      }
      return '';
    };
  }
  Input_GamepadMixIn();
  const DEFAULT_INPUT_SYMBOLS = [
    Input.createInputSymbol(
      'ok',
      '決定',
      new Map([
        ['map', '決定'],
        ['menu', '決定'],
        ['battle', '決定'],
      ]),
      'Z/Enter'
    ),
    Input.createInputSymbol(
      'cancel',
      'キャンセル',
      new Map([
        ['map', 'メニュー'],
        ['menu', 'キャンセル'],
        ['battle', 'キャンセル'],
      ]),
      'X'
    ),
    Input.createInputSymbol(
      'menu',
      'メニュー',
      new Map([
        ['map', 'メニュー'],
        ['menu', '-'],
        ['battle', '-'],
      ]),
      'M'
    ),
    Input.createInputSymbol(
      'pageup',
      '左切替',
      new Map([
        ['map', '-'],
        ['menu', 'アクター切替'],
        ['battle', '-'],
      ]),
      'Q/PageUp'
    ),
    Input.createInputSymbol(
      'pagedown',
      '右切替',
      new Map([
        ['map', '-'],
        ['menu', 'アクター切替'],
        ['battle', '-'],
      ]),
      'W/PageDown'
    ),
    Input.createInputSymbol(
      'shift',
      '特殊操作1',
      new Map([
        ['map', 'ダッシュ'],
        ['menu', '-'],
        ['battle', '-'],
      ]),
      'Shift'
    ),
    Input.createInputSymbol(
      'special2',
      '特殊操作2',
      new Map([
        ['map', '-'],
        ['menu', '-'],
        ['battle', '-'],
      ]),
      'S'
    ),
  ];
  function ConfigManager_GamepadMixIn() {
    ConfigManager.buttonNameType = BUTTON_NAME_TYPE.DEFAULT;
    ConfigManager.manualButtonType = BUTTON_NAME_TYPE.KEYBOARD;
    const _makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
      const result = _makeData.call(this);
      result.gamepadConfig = Input.gamepadMapper;
      result.buttonNameType = this.buttonNameType;
      result.manualButtonType = this.manualButtonType;
      return result;
    };
    const _applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
      _applyData.call(this, config);
      this.gamepadConfig = config.gamepadConfig ?? Input.gamepadMapper;
      Object.entries(this.gamepadConfig).forEach(([key, value]) => {
        Input.gamepadMapper[Number(key)] = value;
      });
      this.buttonNameType = config.buttonNameType || BUTTON_NAME_TYPE.DEFAULT;
      this.manualButtonType = config.manualButtonType || BUTTON_NAME_TYPE.KEYBOARD;
    };
  }
  ConfigManager_GamepadMixIn();
  /**
   * PluginCommonBaseで、metaテキストの読み込み時に行う変換ロジックは
   * Window_Baseからコピーされたコードになっている。
   * 用語集に反映するためにはここで書き換える必要があるため、上書きする
   */
  if (PluginManagerEx) {
    function PluginManagerEx_GamepadMixIn() {
      const _convertEscapeCharacters = PluginManagerEx.convertEscapeCharacters;
      PluginManagerEx.convertEscapeCharacters = function (text, data = null) {
        text = convertGamepadEscapeCharacter(text);
        return _convertEscapeCharacters.call(this, text, data);
      };
    }
    PluginManagerEx_GamepadMixIn();
  }
  class Scene_GamepadConfig extends Scene_MenuBase {
    constructor() {
      super(...arguments);
      this._configWindow = new Window_GamepadConfig(this.configWindowRect());
      this._changeButtonMode = false;
      this._changeButtonModeWait = 0;
      this._commitWait = 0;
    }
    create() {
      super.create();
      this.initializeTemporary();
      this.setupConfigWindow();
    }
    initializeTemporary() {
      Object.entries(Input.gamepadMapper).forEach(([key, value]) => {
        gamepadMapperTemporary[Number(key)] = value;
      });
    }
    setupConfigWindow() {
      this._configWindow.setHandler('ok', this.onConfigOk.bind(this));
      this._configWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._configWindow);
    }
    configWindowRect() {
      return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    }
    onConfigOk() {
      const inputSymbols = Input.inputSymbols();
      switch (this._configWindow.index()) {
        case inputSymbols.length:
          this.toggleButtonNameType();
          this._configWindow.activate();
          break;
        case inputSymbols.length + 1:
          this.commitGamepadMapper();
          this._commitWait = 30;
          Input.clear();
          this._configWindow.setCommitWaitMode(true);
          this._configWindow.activate();
          break;
        case inputSymbols.length + 2:
          this.popScene();
          break;
        default:
          this._changeButtonMode = true;
          this._configWindow.setChangeButtonMode(true);
          this._changeButtonModeWait = 30;
          break;
      }
    }
    toggleButtonNameType() {
      ConfigManager.buttonNameType++;
      if (ConfigManager.buttonNameType > BUTTON_NAME_TYPE.XBOX) {
        ConfigManager.buttonNameType = BUTTON_NAME_TYPE.DEFAULT;
      }
      this._configWindow.refresh();
    }
    commitGamepadMapper() {
      Object.entries(gamepadMapperTemporary).forEach(([key, value]) => {
        Input.gamepadMapper[Number(key)] = value;
      });
    }
    setGamepadMapping(buttonId) {
      const beforeValue = gamepadMapperTemporary[buttonId];
      const beforeId = this._configWindow.currentItem()?.buttonId();
      if (beforeValue && beforeId !== undefined) {
        gamepadMapperTemporary[beforeId] = beforeValue;
      }
      gamepadMapperTemporary[buttonId] = this._configWindow.currentItem().name;
      this._configWindow.refresh();
    }
    update() {
      super.update();
      if (this._changeButtonMode) {
        if (this._changeButtonModeWait <= 0) {
          const triggeredButtonId = Input.triggeredGamepadButtonId();
          if (triggeredButtonId !== null && ![12, 13, 14, 15].includes(triggeredButtonId)) {
            this.setGamepadMapping(triggeredButtonId);
            this._changeButtonMode = false;
            this._changeButtonModeWait = 0;
            this._configWindow.setChangeButtonMode(false);
            this._configWindow.activate();
          }
        } else {
          this._changeButtonModeWait--;
        }
      }
      if (this._commitWait > 0) {
        this._commitWait--;
        if (this._commitWait <= 0) {
          this._configWindow.setCommitWaitMode(false);
        }
      }
    }
  }
  function Scene_Options_GamepadMixIn(sceneOptions) {
    const _maxCommands = sceneOptions.maxCommands;
    sceneOptions.maxCommands = function () {
      return _maxCommands.call(this) + 2;
    };
  }
  Scene_Options_GamepadMixIn(Scene_Options.prototype);
  class Window_GamepadConfig extends Window_Selectable {
    constructor() {
      super(...arguments);
      this._changeButtonMode = false;
      this._commitWaitMode = false;
    }
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
      this.select(0);
      this.activate();
    }
    setChangeButtonMode(mode) {
      if (this._changeButtonMode !== mode) {
        this._changeButtonMode = mode;
        this.refresh();
      }
    }
    setCommitWaitMode(mode) {
      if (this._commitWaitMode !== mode) {
        this._commitWaitMode = mode;
        this.refresh();
      }
    }
    drawHeader() {
      const HEADER_TEXTS = ['操作', 'ボタン'].concat(
        Input.inputBehaviorKeys().map((key) => Input.inputBehaviorKeyName(key))
      );
      HEADER_TEXTS.forEach((text, index) => {
        this.drawText(text, index * (this.colsWidth() + this.colsPadding()), 0, this.colsWidth(), 'center');
      });
    }
    drawItem(index) {
      const rect = this.itemRect(index);
      const inputSymbols = Input.inputSymbols();
      if (index < inputSymbols.length) {
        this.drawText(inputSymbols[index].symbolText, rect.x, rect.y, this.colsWidth(), 'center');
        this.drawText(
          inputSymbols[index].buttonName(ConfigManager.buttonNameType),
          rect.x + this.colsWidth() + this.colsPadding(),
          rect.y,
          this.colsWidth(),
          'center'
        );
        Input.inputBehaviorKeys().forEach((key, i) => {
          this.drawText(
            inputSymbols[index].behavior(key),
            rect.x + (this.colsWidth() + this.colsPadding()) * (2 + i),
            rect.y,
            this.colsWidth(),
            'center'
          );
        });
      } else {
        if (index === inputSymbols.length) {
          this.drawText('ボタン表示', rect.x, rect.y, this.colsWidth(), 'left');
          this.drawText(
            BUTTON_NAME_TYPE_TEXT[ConfigManager.buttonNameType],
            rect.x + this.colsWidth(),
            rect.y,
            this.colsWidth() * 4,
            'center'
          );
        } else if (index === inputSymbols.length + 1) {
          this.drawText('設定を保存', rect.x, rect.y, this.colsWidth(), 'left');
        } else if (index === inputSymbols.length + 2) {
          this.drawText('戻る', rect.x, rect.y, this.colsWidth(), 'left');
        }
      }
    }
    drawFooter() {
      this.changeTextColor(ColorManager.textColor(6));
      const y = this.lineHeight() * (this.maxItems() + 3);
      if (this._changeButtonMode) {
        this.drawText('設定したいボタンを押してください', 0, y, Graphics.boxWidth, 'center');
      }
      if (this._commitWaitMode) {
        this.drawText('設定を保存しました', 0, y, Graphics.boxWidth, 'center');
      }
      this.resetTextColor();
    }
    item(index) {
      return index < Input.inputSymbols().length ? Input.inputSymbols()[index] : null;
    }
    currentItem() {
      return this.item(this.index());
    }
    maxItems() {
      return Input.inputSymbols().length + 3;
    }
    itemRect(index) {
      const result = super.itemRect(index);
      result.y += result.height;
      return result;
    }
    colsWidth() {
      return settings.colsWidth;
    }
    colsPadding() {
      return 5;
    }
    refresh() {
      super.refresh();
      this.drawHeader();
      this.drawFooter();
    }
  }
  function Window_Base_GamepadMixIn(windowClass) {
    windowClass.getManualButtonName = function (symbol) {
      return (
        Input.inputSymbols()
          .find((inputSymbol) => inputSymbol.name === symbol)
          ?.buttonName(ConfigManager.manualButtonType) ?? ''
      );
    };
    const _convertEscapeCharacters = windowClass.convertEscapeCharacters;
    windowClass.convertEscapeCharacters = function (text) {
      /**
       * \G がかぶるため、先に変換しておく
       */
      text = convertGamepadEscapeCharacter(text);
      text = _convertEscapeCharacters.call(this, text);
      return text;
    };
  }
  Window_Base_GamepadMixIn(Window_Base.prototype);
  function Window_Options_GamepadMixIn(windowClass) {
    const gamepadSymbol = 'gamepad';
    const manualSymbol = 'manualButtonType';
    const _makeCommandList = windowClass.makeCommandList;
    windowClass.makeCommandList = function () {
      _makeCommandList.call(this);
      this.addCommand('操作説明表示', manualSymbol);
      this.addCommand('ゲームパッド', gamepadSymbol);
    };
    const _statusText = windowClass.statusText;
    windowClass.statusText = function (index) {
      switch (this.commandSymbol(index)) {
        case gamepadSymbol:
          return '';
        case manualSymbol:
          return this.manualStatusText(this.getConfigValue(this.commandSymbol(index)));
      }
      return _statusText.call(this, index);
    };
    windowClass.manualStatusText = function (value) {
      return BUTTON_NAME_TYPE_TEXT[value];
    };
    const _processOk = windowClass.processOk;
    windowClass.processOk = function () {
      switch (this.commandSymbol(this.index())) {
        case gamepadSymbol:
          this.playOkSound();
          SceneManager.push(Scene_GamepadConfig);
          return;
        case manualSymbol:
          this.changeManualButtonType(true);
          return;
      }
      _processOk.call(this);
    };
    const _cursorRight = windowClass.cursorRight;
    windowClass.cursorRight = function () {
      switch (this.commandSymbol(this.index())) {
        case gamepadSymbol:
          return;
        case manualSymbol:
          this.changeManualButtonType(true);
          return;
      }
      _cursorRight.call(this);
    };
    const _cursorLeft = windowClass.cursorLeft;
    windowClass.cursorLeft = function () {
      switch (this.commandSymbol(this.index())) {
        case gamepadSymbol:
          return;
        case manualSymbol:
          this.changeManualButtonType(false);
          return;
      }
      _cursorLeft.call(this);
    };
    windowClass.changeManualButtonType = function (forward) {
      const value = this.getConfigValue(manualSymbol) + (forward ? 1 : -1);
      if (value >= BUTTON_NAME_TYPE_TEXT.length) {
        this.changeValue(manualSymbol, 0);
      } else if (value < 0) {
        this.changeValue(manualSymbol, BUTTON_NAME_TYPE_TEXT.length - 1);
      } else {
        this.changeValue(manualSymbol, value);
      }
    };
  }
  Window_Options_GamepadMixIn(Window_Options.prototype);
  /**
   * PluginCommonBaseでも利用するため、変換ロジックをWindow_Baseの外に切り出す
   */
  function convertGamepadEscapeCharacter(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bGAMEPAD\[(.+)\]/gi, (_, symbol) => Window_Base.prototype.getManualButtonName(symbol));
    return text;
  }
})();
