// DarkPlasma_ScreenshotGallery 1.0.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/12 1.0.0 公開
 */

/*:
 * @plugindesc スクリーンショットギャラリー
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param key
 * @text 撮影キー
 * @type select
 * @option control
 * @option tab
 * @default control
 *
 * @param tweetKey
 * @desc ギャラリーからツイートするキー。DarkPlasma_TweetScreenshotが必要です。機能を利用しない場合は空欄
 * @text ツイートキー
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @option
 * @default shift
 *
 * @param scenes
 * @text 撮影可能シーン
 * @type string[]
 * @default ["Scene_Base"]
 *
 * @param format
 * @text フォーマット
 * @type select
 * @option png
 * @option jpg
 * @default png
 *
 * @param se
 * @text 効果音
 * @type struct<Se>
 * @default {"name":"Switch2", "volume":"90", "pitch":"100", "pan":"0"}
 *
 * @param directory
 * @text 保存先フォルダ名
 * @type string
 * @default screenshot
 *
 * @command sceneScreenshot
 * @text スクショギャラリーを開く
 *
 * @help
 * version: 1.0.0
 * スクリーンショットの撮影、保存を可能とし
 * 保存したスクリーンショットをゲーム内で閲覧するシーンを提供します。
 *
 * DarkPlasma_TweetScreenshotと一緒に利用することで
 * ギャラリーでスクリーンショットを閲覧している際にその画像をツイートできます。
 *
 * ブラウザプレイには対応していません。
 *
 * シーンクラス名を指定してギャラリーシーンを開く場合、
 * Scene_ScreenshotGallery
 * と指定してください。
 */
/*~struct~Se:
 * @param name
 * @text SEファイル
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @type number
 * @default 90
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    key: String(pluginParameters.key || `control`),
    tweetKey: String(pluginParameters.tweetKey || `shift`),
    scenes: JSON.parse(pluginParameters.scenes || '["Scene_Base"]').map((e) => {
      return String(e || ``);
    }),
    format: String(pluginParameters.format || `png`),
    se: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        name: String(parsed.name || ``),
        volume: Number(parsed.volume || 90),
        pitch: Number(parsed.pitch || 100),
        pan: Number(parsed.pan || 0),
      };
    })(pluginParameters.se || '{"name":"Switch2", "volume":"90", "pitch":"100", "pan":"0"}'),
    directory: String(pluginParameters.directory || `screenshot`),
  };

  const command_sceneScreenshot = 'sceneScreenshot';

  function SceneManager_ScreenshotGalleryMixIn(sceneManager) {
    sceneManager.saveScreenshot = function (format) {
      const dataURLFormat = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const now = new Date();
      this.saveImage(
        `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
          .getDate()
          .toString()
          .padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now
          .getMilliseconds()
          .toString()
          .padStart(4, '0')}`,
        format,
        this.snap().canvas.toDataURL(dataURLFormat, 1).replace(/^.*,/, '')
      );
    };
    sceneManager.saveImage = function (filename, format, base64Image) {
      const fs = require('fs');
      const dirpath = StorageManager.screenshotDirPath();
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }
      fs.writeFileSync(`${dirpath}${filename}.${format}`, Buffer.from(base64Image, 'base64'));
    };
  }
  SceneManager_ScreenshotGalleryMixIn(SceneManager);
  function ImageManager_ScreenshotGalleryMixIn(imageManager) {
    imageManager.loadScreenshot = function (filename) {
      return this.loadBitmap(`${settings.directory}/`, filename);
    };
    imageManager.loadAllScreenshot = function () {
      const fs = require('fs');
      const dirpath = StorageManager.screenshotDirPath();
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }
      const filenames = fs
        .readdirSync(dirpath, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name.replace(/\..+$/, ''));
      return filenames.map((filename) => this.loadScreenshot(filename)).reverse();
    };
    imageManager.validScreenshotCount = function () {
      return this.loadAllScreenshot().length;
    };
  }
  ImageManager_ScreenshotGalleryMixIn(ImageManager);
  function StorageManager_ScreenshotGalleryMixIn(storageManager) {
    storageManager.screenshotDirPath = function () {
      const path = require('path');
      return path.join(path.resolve(''), 'screenshot/');
    };
  }
  StorageManager_ScreenshotGalleryMixIn(StorageManager);
  PluginManager.registerCommand(pluginName, command_sceneScreenshot, function () {
    SceneManager.push(Scene_ScreenshotGallery);
  });
  function Bitmap_ScreenshotGalleryMixIn(bitmap) {
    const _startLoading = bitmap._startLoading;
    bitmap._startLoading = function () {
      if (this._url.startsWith(`${settings.directory}/`)) {
        /**
         * スクショディレクトリ内にある場合、復号せずにロードする
         */
        this._startDecrypting = () => {
          this._image.src = this._url;
          if (this._image.width > 0) {
            this._image.onload = null;
            this._onLoad();
          }
        };
      }
      _startLoading.call(this);
    };
  }
  Bitmap_ScreenshotGalleryMixIn(Bitmap.prototype);
  function Scene_ScreenshotGalleryMixIn(sceneClass) {
    const _update = sceneClass.update;
    sceneClass.update = function () {
      _update.call(this);
      if (Input.isTriggered(settings.key)) {
        SceneManager.saveScreenshot(settings.format);
        if (settings.se.name) {
          AudioManager.playSe(settings.se);
        }
      }
    };
  }
  settings.scenes
    .filter((scene) => scene in globalThis)
    .forEach((scene) => {
      Scene_ScreenshotGalleryMixIn(globalThis[scene].prototype);
    });
  class Scene_ScreenshotGallery extends Scene_Base {
    create() {
      this.createWindowLayer();
      this.createGalleryWindow();
      this.createSprite();
    }
    createGalleryWindow() {
      this._galleryWindow = new Window_ScreenshotGallery(this.galleryWindowRect());
      this._galleryWindow.setHandler('ok', () => this.openLargeImage());
      this._galleryWindow.setHandler('cancel', () => this.popScene());
      this.addWindow(this._galleryWindow);
      this._galleryWindow.activate();
      this._galleryWindow.refresh();
    }
    galleryWindowRect() {
      return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    }
    createSprite() {
      this._sprite = new Sprite_Screenshot();
      this._sprite.hide();
      this._sprite.setOkHandler(() => this.closeLargeImage());
      this.addChild(this._sprite);
    }
    openLargeImage() {
      this._sprite.bitmap = this._galleryWindow.currentItem();
      this._sprite.show();
      this._galleryWindow.deactivate();
    }
    closeLargeImage() {
      SoundManager.playCancel();
      this._sprite.hide();
      this._galleryWindow.activate();
    }
  }
  class Window_ScreenshotGallery extends Window_Selectable {
    constructor() {
      super(...arguments);
      this._images = [];
    }
    initialize(rect) {
      super.initialize(rect);
    }
    maxCols() {
      return 3;
    }
    maxItems() {
      return ImageManager.validScreenshotCount();
    }
    itemHeight() {
      return Math.floor(Graphics.height / (Graphics.width / this.itemWidth()));
    }
    drawItem(index) {
      if (this._images[index]) {
        const rect = this.itemRect(index);
        const bitmap = this._images[index];
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y, rect.width, rect.height);
      }
    }
    refresh() {
      this.makeItemList();
      super.refresh();
    }
    makeItemList() {
      this._images = ImageManager.loadAllScreenshot();
      this._images.find((image) => !image.isReady())?.addLoadListener(() => this.refresh());
    }
    currentItem() {
      return this._images[this.index()];
    }
  }
  class Sprite_Screenshot extends Sprite_Clickable {
    initialize() {
      super.initialize();
    }
    update() {
      super.update();
      this.processHandling();
    }
    setOkHandler(handler) {
      this._okHandler = handler;
    }
    processHandling() {
      if (this.isClickEnabled() && this._okHandler && this.bitmap) {
        if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
          this._okHandler();
        } else if (settings.tweetKey && Input.isTriggered(settings.tweetKey)) {
          SceneManager.tweetImage(this.bitmap);
        } else {
          this.processTouch();
        }
      }
    }
    onClick() {
      if (this._okHandler) {
        this._okHandler();
      }
    }
  }
  globalThis.Scene_ScreenshotGallery = Scene_ScreenshotGallery;
})();
