// DarkPlasma_ChangeScreenshotSetting 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/12/21 1.0.0 公開
 */

/*:
 * @plugindesc スクリーンショットの設定を変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @orderAfter DarkPlasma_ScreenshotGallery
 * @orderAfter DarkPlasma_TweetScreenshot
 *
 * @command changeSetting
 * @text スクショ設定変更
 * @desc スクリーンショットの設定を変更します。
 * @arg rect
 * @text 位置とサイズ
 * @type struct<Rectangle>
 * @default {"x":"0","y":"0","width":"816","height":"624"}
 *
 * @help
 * version: 1.0.0
 * 下記プラグインにおけるスクリーンショットの設定を変更します。
 *
 * - DarkPlasma_ScreenshotGallery.js
 * - DarkPlasma_TweetScreenshot.js
 *
 * 本プラグインで設定した内容はセーブデータに含まれます。
 *
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ScreenshotGallery
 * DarkPlasma_TweetScreenshot
 */
/*~struct~Rectangle:
 * @param x
 * @text X座標
 * @type number
 * @default 0
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 0
 *
 * @param width
 * @text 幅
 * @type number
 * @default 0
 *
 * @param height
 * @text 高さ
 * @type number
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_changeSetting(args) {
    return {
      rect: args.rect
        ? ((parameter) => {
            const parsed = JSON.parse(parameter);
            return {
              x: Number(parsed.x || 0),
              y: Number(parsed.y || 0),
              width: Number(parsed.width || 0),
              height: Number(parsed.height || 0),
            };
          })(args.rect)
        : { x: 0, y: 0, width: 816, height: 624 },
    };
  }

  const command_changeSetting = 'changeSetting';

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
  PluginManager.registerCommand(pluginName, command_changeSetting, function (args) {
    const parsedArgs = parseArgs_changeSetting(args);
    $gameSystem.setScreenshotRectangle(
      new Rectangle(parsedArgs.rect.x, parsedArgs.rect.y, parsedArgs.rect.width, parsedArgs.rect.height),
    );
  });
  function SceneManager_ScreenshotGalleryMixIn(sceneManager) {
    sceneManager.snapForScreenshot = function () {
      if (!this._scene) {
        throw Error('スクリーンショットを保存できません。');
      }
      const rect = $gameSystem.screenshotRectangle();
      return rect ? Bitmap.snapRectangle(this._scene, rect) : this.snap();
    };
  }
  SceneManager_ScreenshotGalleryMixIn(SceneManager);
  class Game_ScreenshotSetting {
    constructor() {
      this._x = 0;
      this._y = 0;
      this._width = 0;
      this._height = 0;
    }
    setRectangle(rect) {
      this._x = rect.x;
      this._y = rect.y;
      this._width = rect.width;
      this._height = rect.height;
    }
    rectangle() {
      return !this._width || !this._height ? undefined : new Rectangle(this._x, this._y, this._width, this._height);
    }
  }
  function Game_System_ChangeScreenshotSettingMixIn(gameSystem) {
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
  globalThis.Game_ScreenshotSetting = Game_ScreenshotSetting;
})();
