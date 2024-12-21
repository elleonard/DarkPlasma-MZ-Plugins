/// <reference path="./ChangeScreenshotSetting.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_changeSetting, parseArgs_changeSetting } from '../config/_build/DarkPlasma_ChangeScreenshotSetting_commands';

Bitmap.snapRectangle = function (stage, rect) {
  const bitmap = new Bitmap(rect.width, rect.height);
  const renderTexture = PIXI.RenderTexture.create({
    width: rect.x + rect.width,
    height: rect.y + rect.height,
  });
  if (stage) {
    const renderer = Graphics.app.renderer;
    renderer.render(stage, renderTexture);
    stage.worldTransform.identity();
    const canvas = renderer.extract.canvas(renderTexture);
    bitmap.context.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    canvas.width = 0;
    canvas.height = 0;
  }
  renderTexture.destroy(true);
  bitmap.baseTexture.update();
  return bitmap;
};

PluginManager.registerCommand(pluginName, command_changeSetting, function(args) {
  const parsedArgs = parseArgs_changeSetting(args);
  $gameSystem.setScreenshotRectangle(new Rectangle(
    parsedArgs.rect.x,
    parsedArgs.rect.y,
    parsedArgs.rect.width,
    parsedArgs.rect.height
  ));
});

function SceneManager_ScreenshotGalleryMixIn(sceneManager: typeof SceneManager) {
  sceneManager.snapForScreenshot = function () {
    if (!this._scene) {
      throw Error("スクリーンショットを保存できません。");
    }
    const rect = $gameSystem.screenshotRectangle();
    return rect ? Bitmap.snapRectangle(this._scene, rect) : this.snap();
  };
}

SceneManager_ScreenshotGalleryMixIn(SceneManager);

class Game_ScreenshotSetting {
  _x: number;
  _y: number;
  _width: number;
  _height: number;

  constructor() {
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
  }

  setRectangle(rect: Rectangle) {
    this._x = rect.x;
    this._y = rect.y;
    this._width = rect.width;
    this._height = rect.height;
  }

  rectangle() {
    return !this._width || !this._height
      ? undefined
      : new Rectangle(this._x, this._y, this._width, this._height);
  }
}

function Game_System_ChangeScreenshotSettingMixIn(gameSystem: Game_System) {
  const _initialize = gameSystem.initialize;
  gameSystem.initialize = function () {
    _initialize.call(this);
    this._screenshotSetting = new Game_ScreenshotSetting();
  };

  gameSystem.screenshotSetting = function () {
    if (!this._screenshotSetting) {
      this._screenshotSetting = new Game_ScreenshotSetting();
    }
    return this._screenshotSetting;
  };

  gameSystem.setScreenshotRectangle = function (rect) {
    this.screenshotSetting().setRectangle(rect);
  };

  gameSystem.screenshotRectangle = function () {
    return this.screenshotSetting().rectangle();
  };
}

Game_System_ChangeScreenshotSettingMixIn(Game_System.prototype);

type _Game_ScreenshotSetting = typeof Game_ScreenshotSetting;
declare global {
  var Game_ScreenshotSetting: _Game_ScreenshotSetting;
}
globalThis.Game_ScreenshotSetting = Game_ScreenshotSetting;
