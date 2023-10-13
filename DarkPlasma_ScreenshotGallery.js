// DarkPlasma_ScreenshotGallery 1.1.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/10/13 1.1.0 撮影時にフラッシュ・プレビューする機能を追加
 *                  表示最大数設定を追加
 *                  一覧での表示サイズを調整
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
 * @param flash
 * @text フラッシュ
 * @type struct<Flash>
 * @default {"red":"255", "green":"255", "blue":"255", "power":"170", "frame":"30"}
 *
 * @param directory
 * @text 保存先フォルダ名
 * @type string
 * @default screenshot
 *
 * @param maxView
 * @desc スクショギャラリーでの表示最大数
 * @text 表示最大数
 * @type number
 * @default 30
 *
 * @param preview
 * @text プレビュー設定
 * @type struct<Preview>
 * @default {"show":"true", "frameWidth":"4", "duration":"60", "rect":"{\"x\":\"16\", \"y\":\"16\", \"width\":\"102\", \"height\":\"78\"}"}
 *
 * @command sceneScreenshot
 * @text スクショギャラリーを開く
 *
 * @help
 * version: 1.1.0
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
/*~struct~Flash:
 * @param red
 * @text 赤
 * @type number
 * @default 255
 * @max 255
 *
 * @param green
 * @text 緑
 * @type number
 * @default 255
 * @max 255
 *
 * @param blue
 * @text 青
 * @type number
 * @default 255
 * @max 255
 *
 * @param power
 * @text 強さ
 * @type number
 * @default 170
 * @max 255
 *
 * @param duration
 * @text 時間(フレーム)
 * @type number
 * @default 30
 * @min 1
 */
/*~struct~Preview:
 * @param show
 * @text プレビューを表示する
 * @type boolean
 * @default true
 *
 * @param frameWidth
 * @text フレーム幅
 * @type number
 * @default 4
 *
 * @param duration
 * @text 表示時間(フレーム)
 * @type number
 * @default 60
 *
 * @param rect
 * @text 位置とサイズ
 * @type struct<Rectangle>
 * @default {"x":"16", "y":"16", "width":"102", "height":"78"}
 */
/*~struct~Rectangle:
 * @param x
 * @text X座標
 * @type number
 * @default 16
 *
 * @param y
 * @text Y座標
 * @type number
 * @default 16
 *
 * @param width
 * @text 幅
 * @type number
 * @default 102
 *
 * @param height
 * @text 高さ
 * @type number
 * @default 78
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
    flash: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        red: Number(parsed.red || 255),
        green: Number(parsed.green || 255),
        blue: Number(parsed.blue || 255),
        power: Number(parsed.power || 170),
        duration: Number(parsed.duration || 30),
      };
    })(pluginParameters.flash || '{"red":"255", "green":"255", "blue":"255", "power":"170", "frame":"30"}'),
    directory: String(pluginParameters.directory || `screenshot`),
    maxView: Number(pluginParameters.maxView || 30),
    preview: ((parameter) => {
      const parsed = JSON.parse(parameter);
      return {
        show: String(parsed.show || true) === 'true',
        frameWidth: Number(parsed.frameWidth || 4),
        duration: Number(parsed.duration || 60),
        rect: ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            x: Number(parsed.x || 16),
            y: Number(parsed.y || 16),
            width: Number(parsed.width || 102),
            height: Number(parsed.height || 78),
          };
        })(parsed.rect || '{"x":"16", "y":"16", "width":"102", "height":"78"}'),
      };
    })(
      pluginParameters.preview ||
        '{"show":"true", "frameWidth":"4", "duration":"60", "rect":"{\\"x\\":\\"16\\", \\"y\\":\\"16\\", \\"width\\":\\"102\\", \\"height\\":\\"78\\"}"}'
    ),
  };

  const command_sceneScreenshot = 'sceneScreenshot';

  function SceneManager_ScreenshotGalleryMixIn(sceneManager) {
    sceneManager.saveScreenshot = function (format) {
      const dataURLFormat = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const now = new Date();
      const name = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now
        .getHours()
        .toString()
        .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
        .getSeconds()
        .toString()
        .padStart(2, '0')}${now.getMilliseconds().toString().padStart(4, '0')}`;
      ImageManager.setLatestScreenshotName(name);
      this.saveImage(name, format, this.snap().canvas.toDataURL(dataURLFormat, 1).replace(/^.*,/, ''));
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
    imageManager.setLatestScreenshotName = function (name) {
      this._latestSceenshotName = name;
    };
    imageManager.loadLatestScreenshot = function () {
      return this.loadScreenshot(this._latestSceenshotName);
    };
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
        .map((dirent) => dirent.name.replace(/\..+$/, ''))
        .slice(0, settings.maxView);
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
    bitmap.drawFrame = function (x, y, width, height, thick, color) {
      this._context.strokeStyle = color;
      this._context.lineWidth = thick;
      this._context.strokeRect(x, y, width, height);
      this._context.restore();
      this._baseTexture.update();
    };
  }
  Bitmap_ScreenshotGalleryMixIn(Bitmap.prototype);
  function Scene_ScreenshotGalleryMixIn(sceneClass) {
    const _start = sceneClass.start;
    sceneClass.start = function () {
      _start.call(this);
      /**
       * 最前表示のためここで作る
       */
      if (settings.preview.show) {
        this.createPreviewContainer();
      }
    };
    sceneClass.createPreviewContainer = function () {
      this._previewContainer = new Sprite();
      this._previewContainer.bitmap = new Bitmap(
        settings.preview.rect.width + settings.preview.frameWidth * 2,
        settings.preview.rect.height + settings.preview.frameWidth * 2
      );
      this._previewContainer.x = settings.preview.rect.x - settings.preview.frameWidth;
      this._previewContainer.y = settings.preview.rect.y - settings.preview.frameWidth;
      this._previewContainer.bitmap.drawFrame(
        0,
        0,
        settings.preview.rect.width + settings.preview.frameWidth * 2,
        settings.preview.rect.height + settings.preview.frameWidth * 2,
        settings.preview.frameWidth,
        ColorManager.textColor(0)
      );
      this.addChild(this._previewContainer);
      this._previewSprite = new Sprite();
      this._previewSprite.x = settings.preview.frameWidth;
      this._previewSprite.y = settings.preview.frameWidth;
      this._previewSprite.scale.x = settings.preview.rect.width / Graphics.width;
      this._previewSprite.scale.y = settings.preview.rect.height / Graphics.height;
      this._previewContainer.addChild(this._previewSprite);
      this._previewContainer.hide();
    };
    sceneClass.startPreview = function () {
      this._previewDuration = settings.preview.duration;
      this._previewSprite.bitmap = ImageManager.loadLatestScreenshot();
      this._previewContainer.show();
    };
    sceneClass.hidePreview = function () {
      if (this._previewContainer.visible) {
        this._previewContainer.hide();
      }
    };
    sceneClass.startFlash = function () {
      this._flashDuration = settings.flash.duration;
      this._flashOpacity = settings.flash.power;
      this.updateFlash();
    };
    sceneClass.clearFlash = function () {
      if (this._flashDuration > 0) {
        this._flashDuration = 0;
        this.updateColorFilter();
      }
    };
    const _update = sceneClass.update;
    sceneClass.update = function () {
      _update.call(this);
      if (Input.isTriggered(settings.key)) {
        /**
         * 直前の撮影時のフラッシュが写り込まないようにする
         */
        this.clearFlash();
        this.hidePreview();
        SceneManager.saveScreenshot(settings.format);
        if (settings.se.name) {
          AudioManager.playSe(settings.se);
          this.startFlash();
        }
        if (settings.preview.show) {
          this.startPreview();
        }
      }
      this.updateFlash();
      this.updatePreview();
    };
    sceneClass.updateColorFilter = function () {
      this._colorFilter.setBlendColor(this.blendColor());
    };
    sceneClass.updateFlash = function () {
      if (this._flashDuration > 0) {
        this._flashOpacity *= (this._flashDuration - 1) / this._flashDuration;
        this._flashDuration--;
      }
    };
    sceneClass.updatePreview = function () {
      if (this._previewDuration > 0) {
        this._previewDuration--;
        if (this._previewDuration <= 0) {
          this._previewContainer.hide();
        }
      }
    };
    sceneClass.blendColor = function () {
      if (this._fadeDuration === 0 && this._flashDuration > 0) {
        return [settings.flash.red, settings.flash.green, settings.flash.blue, this._flashOpacity];
      }
      const c = this._fadeWhite ? 255 : 0;
      return [c, c, c, this._fadeOpacity];
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
    itemRectWithPadding(index) {
      const rect = super.itemRectWithPadding(index);
      const padding = this.itemPadding();
      rect.y += padding;
      rect.height -= padding * 2;
      return rect;
    }
    drawItem(index) {
      if (this._images[index]) {
        const rect = this.itemRectWithPadding(index);
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
