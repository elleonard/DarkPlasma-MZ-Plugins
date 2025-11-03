/// <reference path="./FocusCircle.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_ClearAllFocus, command_FocusOff, command_FocusOn, command_MoveFocus, parseArgs_FocusOff, parseArgs_FocusOn, parseArgs_MoveFocus } from '../config/_build/DarkPlasma_FocusCircle_commands';
import { settings } from '../config/_build/DarkPlasma_FocusCircle_parameters';

function convertColor(color: { red: number, green: number, blue: number }): string {
  return `#${((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue)
    .toString(16)
    .slice(1)}`;
}

function Bitmap_FocusCircleMixIn(bitmap: Bitmap) {
  bitmap.fillGradientEllipse = function (
    this: Bitmap,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    insideColor: string,
    outsideColor: string
  ) {
    const context = this._context;
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
    gradient.addColorStop(0, insideColor);
    gradient.addColorStop(1, outsideColor);
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(centerX, centerY, radiusX, radiusY, rotation, 0, 2 * Math.PI);
    context.fill();
    context.restore();
    this._baseTexture.update();
  };
}

Bitmap_FocusCircleMixIn(Bitmap.prototype);

PluginManager.registerCommand(pluginName, command_FocusOn, function (args) {
  const parsedArgs = parseArgs_FocusOn(args);
  $gameTemp.focusOn(parsedArgs);
});

PluginManager.registerCommand(pluginName, command_FocusOff, function (args) {
  const parsedArgs = parseArgs_FocusOff(args);
  $gameTemp.focusOff(parsedArgs.id);
});

PluginManager.registerCommand(pluginName, command_MoveFocus, function (args) {
  const parsedArgs = parseArgs_MoveFocus(args);
  $gameTemp.moveFocus(parsedArgs);
});

PluginManager.registerCommand(pluginName, command_ClearAllFocus, function () {
  $gameTemp.clearAllFocus();
});

function ColorManager_FocusCircleMixIn(colorManager: typeof ColorManager) {
  colorManager.focusInsideColor = function () {
    return convertColor({
      red: 255,
      green: 255,
      blue: 255,
    });
  };

  colorManager.focusOutsideColor = function () {
    return convertColor({
      red: 0,
      green: 0,
      blue: 0,
    });
  };
}

ColorManager_FocusCircleMixIn(ColorManager);

function SceneManager_FocusCircleMixIn(sceneManager: typeof SceneManager) {
  const _onBeforeSceneStart = sceneManager.onBeforeSceneStart;
  sceneManager.onBeforeSceneStart = function () {
    _onBeforeSceneStart.call(this);
    this._scene?.createFocusCircleLayer();
  };
}

SceneManager_FocusCircleMixIn(SceneManager);

function Game_Temp_FocusCircleMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._focusList = [];
    this._needsFocusRefresh = false;
  };

  gameTemp.isFocusRefreshRequested = function () {
    return this._needsFocusRefresh;
  };

  gameTemp.clearFocusRefreshRequest = function () {
    this._needsFocusRefresh = false;
  };

  gameTemp.isFocusMode = function () {
    return this.focusList().length > 0;
  };

  gameTemp.focusList = function () {
    return this._focusList;
  };

  gameTemp.focusOn = function (focus) {
    this._focusList.push(focus);
    this._needsFocusRefresh = true;
  };

  gameTemp.focusOff = function (focusId) {
    this._focusList = this._focusList.filter(f => f.id !== focusId);
    this._needsFocusRefresh = true;
  };

  gameTemp.moveFocus = function (focus) {
    this._focusList
      .filter(f => f.id === focus.id)
      .forEach(f => {
        f.x = focus.x;
        f.y = focus.y;
        f.radiusX = focus.radiusX;
        f.radiusY = focus.radiusY;
      });
    this._needsFocusRefresh = true;
  };

  gameTemp.clearAllFocus = function () {
    this._focusList = [];
    this._needsFocusRefresh = true;
  };
}

Game_Temp_FocusCircleMixIn(Game_Temp.prototype);

function Scene_Base_FocusCircleMixIn(sceneBase: Scene_Base) {
  sceneBase.createFocusCircleLayer = function () {
    this._focusCircleLayer = new FocusCircleLayer();
    if (this._messageWindowLayer) {
      this.addChild(this._focusCircleLayer);
      this.createFocusMessageWindowLayer(this._messageWindowLayer.x, this._messageWindowLayer.y);
    } else if (this._windowLayer && this._messageWindow) {
      this.addChild(this._focusCircleLayer);
      this.createFocusMessageWindowLayer(this._windowLayer.x, this._windowLayer.y);
    } else {
      this.addChild(this._focusCircleLayer);
    }
  };

  sceneBase.createFocusMessageWindowLayer = function (x, y) {
    this._focusMessageWindowLayer = new WindowLayer();
    this._focusMessageWindowLayer.x = x;
    this._focusMessageWindowLayer.y = y;
    const focusMessageWindow = new Window_FocusMessage(this.messageWindowRect());
    this._focusMessageWindow = focusMessageWindow;
    const nameBoxWindow = new Window_NameBox();
    focusMessageWindow.setGoldWindow(this._goldWindow);
    focusMessageWindow.setNameBoxWindow(nameBoxWindow);
    focusMessageWindow.setChoiceListWindow(this._choiceListWindow);
    focusMessageWindow.setNumberInputWindow(this._numberInputWindow);
    focusMessageWindow.setEventItemWindow(this._eventItemWindow);
    nameBoxWindow.setMessageWindow(focusMessageWindow);
    this._focusMessageWindowLayer.addChild(focusMessageWindow);
    this._focusMessageWindowLayer.addChild(nameBoxWindow);
    this.addChild(this._focusMessageWindowLayer);
    Window_Message_FocusCircleMixIn(this._messageWindow);
  };
}

Scene_Base_FocusCircleMixIn(Scene_Base.prototype);

function Window_Message_FocusCircleMixIn(windowMessage: Window_Message) {
  const _canStart = windowMessage.canStart;
  windowMessage.canStart = function () {
    return _canStart.call(this) && !$gameTemp.isFocusMode();
  };

  const _updateInput = windowMessage.updateInput;
  windowMessage.updateInput = function () {
    if ($gameTemp.isFocusMode()) {
      return true;
    }
    return _updateInput.call(this);
  };

  const _doesContinues = windowMessage.doesContinue;
  windowMessage.doesContinue = function () {
    return _doesContinues.call(this) && !$gameTemp.isFocusMode();
  };
}

class Window_FocusMessage extends Window_Message {
  public canStart(): boolean {
    return super.canStart() && $gameTemp.isFocusMode();
  }

  public update(): void {
    if (!$gameTemp.isFocusMode()) {
      this.close();
    }
    super.update();
  }

  public updateInput(): boolean {
    if (!$gameTemp.isFocusMode()) {
      return true;
    }
    return super.updateInput();
  }

  public doesContinue(): boolean {
    return super.doesContinue() && $gameTemp.isFocusMode();
  }
}

class FocusCircleLayer extends Sprite {
  _width: number;
  _height: number;

  constructor() {
    super();
    this._width = Graphics.width;
    this._height = Graphics.height;
    this.bitmap = new Bitmap(this._width, this._height);
    this.opacity = settings.opacity;
    this.blendMode = 2;
    this.x = 0;
    this.y = 0;
  }

  update() {
    if ($gameTemp.isFocusRefreshRequested()) {
      this.refresh();
      $gameTemp.clearFocusRefreshRequest();
    }
  }

  refresh() {
    this.bitmap?.clear();
    if ($gameTemp.isFocusMode()) {
      this.bitmap?.fillRect(0, 0, this._width, this._height, ColorManager.focusOutsideColor());
      $gameTemp.focusList().forEach(focus => {
        this.bitmap?.fillGradientEllipse(
          focus.x,
          focus.y,
          focus.radiusX,
          focus.radiusY,
          0,
          ColorManager.focusInsideColor(),
          ColorManager.focusOutsideColor()
        );
      });
    }
  }
}
