/// <reference path="./FocusCircle.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_ClearAllFocus, command_FocusOff, command_FocusOn, command_MoveFocus, parseArgs_FocusOff, parseArgs_FocusOn, parseArgs_MoveFocus } from '../config/_build/DarkPlasma_FocusCircle_commands';
import { settings } from '../config/_build/DarkPlasma_FocusCircle_parameters';

function convertColor(color: { red: number, green: number, blue: number }): string {
  return `#${((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue)
    .toString(16)
    .slice(1)}`;
}

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
  $gameTemp.moveFocus(parsedArgs.id, parsedArgs.x, parsedArgs.y, parsedArgs.radius);
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

  gameTemp.moveFocus = function (focusId, x, y, radius) {
    this._focusList
      .filter(focus => focus.id === focusId)
      .forEach(focus => {
        focus.x = x;
        focus.y = y;
        focus.radius = radius;
      });

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
    this.addChild(this._focusCircleLayer);
  };
}

Scene_Base_FocusCircleMixIn(Scene_Base.prototype);

class FocusCircleLayer extends PIXI.Container {
  _width: number;
  _height: number;
  _bitmap: Bitmap;

  constructor() {
    super();
    this._width = Graphics.width;
    this._height = Graphics.height;
    this._bitmap = new Bitmap(this._width, this._height);
    this.createSprite();
  }

  createSprite() {
    const sprite = new Sprite(null);
    sprite.bitmap = this._bitmap;
    sprite.opacity = settings.opacity;
    sprite.blendMode = 2;
    sprite.x = 0;
    sprite.y = 0;
    this.addChild(sprite);
  }

  update() {
    if ($gameTemp.isFocusRefreshRequested()) {
      this.refresh();
      $gameTemp.clearFocusRefreshRequest();
    }
  }

  refresh() {
    this._bitmap.clear();
    if ($gameTemp.isFocusMode()) {
      this._bitmap.fillRect(0, 0, this._width, this._height, ColorManager.focusOutsideColor());
      $gameTemp.focusList().forEach(focus => {
        this._bitmap.fillGradientCircle(
          focus.x,
          focus.y,
          focus.radius,
          ColorManager.focusInsideColor(),
          ColorManager.focusOutsideColor()
        );
      });
    }
  }
}
