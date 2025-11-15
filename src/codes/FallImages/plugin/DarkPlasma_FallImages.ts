/// <reference path="./FallImages.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_fadeOutFall, command_startFall, command_stopFall } from '../config/_build/DarkPlasma_FallImages_commands';
import { FallImages_FallImage, settings } from '../config/_build/DarkPlasma_FallImages_parameters';

const START_Y_OFFSET = -100;

PluginManager.registerCommand(pluginName, command_startFall, function (args) {
  fallImageStatus?.requestStart(Number(args.id));
});

PluginManager.registerCommand(pluginName, command_stopFall, function () {
  fallImageStatus?.requestStop();
});

PluginManager.registerCommand(pluginName, command_fadeOutFall, function () {
  fallImageStatus?.requestFadeOut();
});

class FallImageStatus {
  _startRequested: boolean;
  _requestedImageId: number;
  _stopRequested: boolean;
  _fadeOutRequested: boolean;
  _isFalling: boolean;

  /**
   * @param {boolean} startRequested 開始リクエストされているか
   * @param {number} requestedImageId リクエストされている画像ID
   * @param {boolean} stopRequested 停止リクエストされているか
   * @param {boolean} fadeOutRequested フェードアウトリクエストされているか
   * @param {boolean} isFalling 降っている最中か
   */
  constructor(
    startRequested: boolean,
    requestedImageId: number,
    stopRequested: boolean,
    fadeOutRequested: boolean,
    isFalling: boolean
  ) {
    this._startRequested = startRequested;
    this._requestedImageId = requestedImageId;
    this._stopRequested = stopRequested;
    this._fadeOutRequested = fadeOutRequested;
    this._isFalling = isFalling;
  }

  static newInstance(): FallImageStatus {
    return new FallImageStatus(false, 0, false, false, false);
  }

  toSave(): FallImageStatusSaveObject {
    return {
      startRequested: this.startRequested,
      requestedImageId: this.requestedImageId,
      stopRequested: this.stopRequested,
      fadeOutRequested: this.fadeOutRequested,
      isFalling: this.isFalling,
    };
  }

  static fromSave(saveObject: FallImageStatusSaveObject): FallImageStatus {
    return new FallImageStatus(
      saveObject.startRequested,
      saveObject.requestedImageId,
      saveObject.stopRequested,
      saveObject.fadeOutRequested,
      saveObject.isFalling
    );
  }

  get startRequested() {
    return this._startRequested;
  }

  get requestedImageId() {
    return this._requestedImageId;
  }

  get stopRequested() {
    return this._stopRequested;
  }

  get fadeOutRequested() {
    return this._fadeOutRequested;
  }

  get isFalling() {
    return this._isFalling;
  }

  requestedImageSetting() {
    return settings.images.find((image) => image.id === this._requestedImageId);
  }

  requestStart(fallSettingId: number) {
    this._startRequested = true;
    this._requestedImageId = fallSettingId;
    this._isFalling = true;
  }

  requestStop() {
    this._stopRequested = true;
    this._isFalling = false;
  }

  requestFadeOut() {
    this._fadeOutRequested = true;
    this._isFalling = false;
  }

  clearStartRequest() {
    this._startRequested = false;
  }

  clearStopRequest() {
    this._stopRequested = false;
  }

  clearFadeOutRequest() {
    this._fadeOutRequested = false;
  }
}

let fallImageStatus: FallImageStatus | null = null;

function Game_System_FallImageMixIn(gameSystem: Game_System) {
  const _initialize = gameSystem.initialize;
  gameSystem.initialize = function () {
    _initialize.call(this);
    fallImageStatus = FallImageStatus.newInstance();
  };

  const _onBeforeSave = gameSystem.onBeforeSave;
  gameSystem.onBeforeSave = function () {
    _onBeforeSave.call(this);
    if (fallImageStatus) {
      this._fallImageStatus = fallImageStatus.toSave();
    }
  };

  const _onAfterLoad = gameSystem.onAfterLoad;
  gameSystem.onAfterLoad = function () {
    _onAfterLoad.call(this);
    if (this._fallImageStatus) {
      fallImageStatus = FallImageStatus.fromSave(this._fallImageStatus);
    } else {
      fallImageStatus = FallImageStatus.newInstance();
    }
  };
}

Game_System_FallImageMixIn(Game_System.prototype);

class Sprite_Falling extends Sprite {
  _fallSetting: FallImages_FallImage|undefined;
  _lifeTime: number;
  _row: number;
  _animationFrame: number;

  initialize(fallSettingId: number) {
    super.initialize();
    this._fallSetting = settings.images.find((image) => image.id === fallSettingId);
    if (!this._fallSetting) {
      throw new Error('Invalid fallSettingId.');
    }
    this.bitmap = ImageManager.loadBitmap('', this._fallSetting.file);
  }

  fallSetting() {
    if (!this._fallSetting) {
      throw new Error(`設定値が存在しません`);
    }
    return this._fallSetting;
  }

  setup() {
    this.opacity = 255;
    this.x = Math.floor(Math.random() * Graphics.boxWidth);
    this.y = Math.floor(Math.random() * Graphics.boxHeight + START_Y_OFFSET);
    this._lifeTime = this.initialLifeTime();
    const scale = this.calcScale();
    this.scale.set(scale, scale);
    this._row = Math.randomInt(this.fallSetting().rows);
    this._animationFrame = Math.randomInt(this.fallSetting().cols * this.fallSetting().animationSpeed);
    this.updateFrame();
  }

  update() {
    if (!this._fallSetting) {
      throw new Error(`設定値が存在しません`);
    }
    this._lifeTime--;
    this._animationFrame = (this._animationFrame + 1) % (this._fallSetting.cols * this._fallSetting.animationSpeed);
    this.x += this.moveSpeedX();
    this.y += this.moveSpeedY();
    this.updateFrame();
    this.updateLifeTime();
  }

  wavering() {
    return Math.randomInt(10 - this.fallSetting().waveringFrequency + 1) === 0;
  }

  moveSpeedX() {
    return (Math.randomInt(this.fallSetting().moveSpeedX) + 1) * (this.wavering() ? -1 : 1);
  }

  moveSpeedY() {
    return Math.randomInt(this.fallSetting().moveSpeedY) + 1;
  }

  updateLifeTime() {
    this._lifeTime--;
    if (this._lifeTime <= 50) {
      this.opacity -= 255 / 50;
    }
    if (this._lifeTime <= 0 && fallImageStatus?.isFalling) {
      this.setup();
    }
  }

  updateFrame() {
    const width = this.frameWidth();
    const height = this.frameHeight();
    this.setFrame(
      Math.floor(this._animationFrame / this.fallSetting().animationSpeed) * width,
      this._row * height,
      width,
      height
    );
  }

  frameHeight() {
    return Math.floor((this.bitmap?.height || 0) / this.fallSetting().rows);
  }

  frameWidth() {
    return Math.floor((this.bitmap?.width || 0) / this.fallSetting().cols);
  }

  initialLifeTime() {
    return this.fallSetting().minimumLifeTime + Math.floor(Math.random() * this.fallSetting().lifeTimeRange);
  }

  calcScale() {
    return Math.randomInt(2) === 0 ? 0.5 : 1.5;
  }
}

function Spriteset_Map_FallImagesMixIn(spritesetMap: Spriteset_Map) {
  const _initialize = spritesetMap.initialize;
  spritesetMap.initialize = function () {
    this._fallImageSprites = [];
    _initialize.call(this);
  };
  
  const _createLowerLayer = spritesetMap.createLowerLayer;
  spritesetMap.createLowerLayer = function () {
    _createLowerLayer.call(this);
    this.createFallImage();
  };
  
  spritesetMap.needCreateFallImage = function () {
    return !!fallImageStatus?.startRequested || (!!fallImageStatus?.isFalling && this._fallImageSprites.length === 0);
  };
  
  spritesetMap.createFallImage = function () {
    const image = fallImageStatus?.requestedImageSetting();
    if (!image || !this.needCreateFallImage()) {
      return;
    }
    fallImageStatus?.clearStartRequest();
    this._fallImageSprites = [...Array(image.count).keys()].map((_) => new Sprite_Falling(image.id));
    this._fallImageSprites.forEach((sprite) => {
      this.addChild(sprite);
      sprite.setup();
    });
  };
  
  const _update = spritesetMap.update;
  spritesetMap.update = function () {
    _update.call(this);
    this.updateFallImage();
  };
  
  spritesetMap.updateFallImage = function () {
    if (fallImageStatus?.startRequested) {
      this.createFallImage();
    } else if (fallImageStatus?.stopRequested) {
      this.destroyFallImages();
    }
  };
  
  spritesetMap.destroyFallImages = function () {
    this._fallImageSprites.forEach((sprite) => sprite.destroy());
    this._fallImageSprites = [];
    fallImageStatus?.clearStopRequest();
  };
}

Spriteset_Map_FallImagesMixIn(Spriteset_Map.prototype);
