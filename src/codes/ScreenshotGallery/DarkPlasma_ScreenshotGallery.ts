/// <reference path="./ScreenshotGallery.d.ts" />

import { settings } from "./_build/DarkPlasma_ScreenshotGallery_parameters";
import { pluginName } from "../../common/pluginName";
import { command_sceneScreenshot } from "./_build/DarkPlasma_ScreenshotGallery_commands";

function SceneManager_ScreenshotGalleryMixIn(sceneManager: typeof SceneManager) {
  sceneManager.saveScreenshot = function (format) {
    const dataURLFormat = format === "jpg" ? "image/jpeg" : `image/${format}`;
    const now = new Date();
    this.saveImage(
      `${
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
      }`,
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
      .map((dirent: any) => (dirent.name as string).replace(/\..+$/, ""));
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
}

Bitmap_ScreenshotGalleryMixIn(Bitmap.prototype);

function Scene_ScreenshotGalleryMixIn(sceneClass: Scene_Base) {
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

  public drawItem(index: number): void {
    if (this._images[index]) {
      const rect = this.itemRect(index);
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
