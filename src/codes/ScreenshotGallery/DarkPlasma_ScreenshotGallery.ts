/// <reference path="./ScreenshotGallery.d.ts" />

import { settings } from "./_build/DarkPlasma_ScreenshotGallery_parameters";
import { pluginName } from "../../common/pluginName";
import { command_sceneScreenshot } from "./_build/DarkPlasma_ScreenshotGallery_commands";

function SceneManager_ScreenshotGalleryMixIn(sceneManager: typeof SceneManager) {
  sceneManager.saveScreenshot = function (format) {
    const dataURLFormat = format === "jpg" ? "image/jpeg" : `image/${format}`;
    const now = new Date();
    const name = `${
      now.getFullYear()
    }-${
      (now.getMonth()+1).toString().padStart(2, '0')
    }-${
      now.getDate().toString().padStart(2, '0')
    }-${
      now.getHours().toString().padStart(2, '0')
    }${
      now.getMinutes().toString().padStart(2, '0')
    }${
      now.getSeconds().toString().padStart(2, '0')
    }${
      now.getMilliseconds().toString().padStart(4, '0')
    }`;
    ImageManager.setLatestScreenshotName(name);
    this.saveImage(
      name,
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

function ImageManager_ScreenshotGalleryMixIn(imageManager: typeof ImageManager) {
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
    const filenames: string[] = fs.readdirSync(dirpath, { withFileTypes: true })
      .filter((dirent: any) => dirent.isFile())
      .map((dirent: any) => (dirent.name as string).replace(/\..+$/, ""))
      .slice(0, settings.maxView);
    return filenames.map(filename => this.loadScreenshot(filename)).reverse();
  };

  imageManager.validScreenshotCount = function () {
    return this.loadAllScreenshot().length;
  };
}

ImageManager_ScreenshotGalleryMixIn(ImageManager);

function StorageManager_ScreenshotGalleryMixIn(storageManager: typeof StorageManager) {
  storageManager.screenshotDirPath = function () {
    const path = require("path");
    return path.join(path.resolve(""), "screenshot/");
  };
}

StorageManager_ScreenshotGalleryMixIn(StorageManager);

PluginManager.registerCommand(pluginName, command_sceneScreenshot, function() {
  SceneManager.push(Scene_ScreenshotGallery);
});

function Bitmap_ScreenshotGalleryMixIn(bitmap: Bitmap) {
  const _startLoading = bitmap._startLoading;
  bitmap._startLoading = function () {
    if (this._url.startsWith(`${settings.directory}/`)) {
      /**
       * スクショディレクトリ内にある場合、復号せずにロードする
       */
      this._startDecrypting = () => {
        this._image!.src = this._url;
        if (this._image!.width > 0) {
            this._image!.onload = null;
            this._onLoad();
        }
      };
    }
    _startLoading.call(this);
  };

  bitmap.drawFrame = function (x: number, y: number, width: number, height: number, thick: number, color: string) {
    this._context.strokeStyle = color;
    this._context.lineWidth = thick;
    this._context.strokeRect(x, y, width, height);
    this._context.restore();
    this._baseTexture.update();
  };
}

Bitmap_ScreenshotGalleryMixIn(Bitmap.prototype);

function Scene_ScreenshotGalleryMixIn(sceneClass: Scene_Base) {
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
    this._previewSprite.scale.x = settings.preview.rect.width/Graphics.width;
    this._previewSprite.scale.y = settings.preview.rect.height/Graphics.height;
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
      return [
        settings.flash.red,
        settings.flash.green,
        settings.flash.blue,
        this._flashOpacity,
      ];
    }
    const c = this._fadeWhite ? 255 : 0;
    return [c, c, c, this._fadeOpacity];
  };
}

settings.scenes
  .filter(scene => scene in globalThis)
  .forEach(scene => {
    Scene_ScreenshotGalleryMixIn(globalThis[scene as keyof typeof globalThis].prototype);
  });

class Scene_ScreenshotGallery extends Scene_Base {
  _galleryWindow: Window_ScreenshotGallery;
  _sprite: Sprite_Screenshot;

  create() {
    this.createWindowLayer();
    this.createGalleryWindow();
    this.createSprite();
  }

  createGalleryWindow() {
    this._galleryWindow = new Window_ScreenshotGallery(this.galleryWindowRect());
    this._galleryWindow.setHandler('ok', () => this.openLargeImage())
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
  _images: Bitmap[] = [];

  initialize(rect: Rectangle) {
    super.initialize(rect);
  }

  maxCols() {
    return 3;
  }

  public maxItems(): number {
    return ImageManager.validScreenshotCount();
  }

  public itemHeight(): number {
    return Math.floor(Graphics.height / (Graphics.width / this.itemWidth()));
  }

  public itemRectWithPadding(index: number): Rectangle {
    const rect = super.itemRectWithPadding(index);
    const padding = this.itemPadding();
    rect.y += padding;
    rect.height -= padding * 2;
    return rect;
  }

  public drawItem(index: number): void {
    if (this._images[index]) {
      const rect = this.itemRectWithPadding(index);
      const bitmap = this._images[index];
      this.contents.blt(
        bitmap,
        0, 0, bitmap.width, bitmap.height,
        rect.x, rect.y, rect.width, rect.height
      );
    }
  }

  public refresh(): void {
    this.makeItemList();
    super.refresh();
  }

  makeItemList() {
    this._images = ImageManager.loadAllScreenshot();
    this._images.find(image => !image.isReady())?.addLoadListener(() => this.refresh());
  }

  currentItem() {
    return this._images[this.index()];
  }
}

class Sprite_Screenshot extends Sprite_Clickable {
  _okHandler: (() => void) | undefined;

  initialize() {
    super.initialize();
  }

  public update(): void {
    super.update();
    this.processHandling();
  }

  setOkHandler(handler: () => void) {
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

  public onClick(): void {
    if (this._okHandler) {
      this._okHandler();
    }
  }
}

type _Scene_ScreenshotGallery = typeof Scene_ScreenshotGallery;
declare global {
  var Scene_ScreenshotGallery: _Scene_ScreenshotGallery;
}
globalThis.Scene_ScreenshotGallery = Scene_ScreenshotGallery;
