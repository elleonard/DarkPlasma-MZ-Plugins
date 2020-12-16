import { pluginName } from '../../common/pluginName';
import { settings } from './_build/DarkPlasma_FallImages_parameters';

const PLUGIN_COMMAND_NAME = {
  START_FALL: 'startFall',
  STOP_FALL: 'stopFall',
  FADEOUT_FALL: 'fadeOutFall',
};

const START_Y_OFFSET = -100;

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.START_FALL, function (args) {
  fallImageStatus.requestStart(Number(args.id));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.STOP_FALL, function () {
  fallImageStatus.requestStop();
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.FADEOUT_FALL, function () {
  fallImageStatus.requestFadeOut();
});

class FallImageStatus {
  /**
   * @param {boolean} startRequested 開始リクエストされているか
   * @param {number} requestedImageId リクエストされている画像ID
   * @param {boolean} stopRequested 停止リクエストされているか
   * @param {boolean} fadeOutRequested フェードアウトリクエストされているか
   * @param {boolean} isFalling 降っている最中か
   */
  constructor(startRequested, requestedImageId, stopRequested, fadeOutRequested, isFalling) {
    this._startRequested = startRequested;
    this._requestedImageId = requestedImageId;
    this._stopRequested = stopRequested;
    this._fadeOutRequested = fadeOutRequested;
    this._isFalling = isFalling;
  }

  /**
   * @return {FallImageStatus}
   */
  static newInstance() {
    return new FallImageStatus(false, 0, false, false, false);
  }

  /**
   * @return {object}
   */
  toSave() {
    return {
      startRequested: this.startRequested,
      requestedImageId: this.requestedImageId,
      stopRequested: this.stopRequested,
      fadeOutRequested: this.fadeOutRequested,
      isFalling: this.isFalling,
    };
  }

  /**
   * @param {object} saveObject セーブデータから取得したオブジェクト
   * @return {FallImageStatus}
   */
  static fromSave(saveObject) {
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

  requestStart(fallSettingId) {
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

let fallImageStatus = null;

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
  _Game_System_initialize.call(this);
  fallImageStatus = FallImageStatus.newInstance();
};

const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function () {
  _Game_System_onBeforeSave.call(this);
  this._fallImageStatus = fallImageStatus.toSave();
};

const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function () {
  _Game_System_onAfterLoad.call(this);
  if (this._fallImageStatus) {
    fallImageStatus = FallImageStatus.fromSave(this._fallImageStatus);
  } else {
    fallImageStatus = FallImageStatus.newInstance();
  }
};

class Sprite_Falling extends Sprite {
  initialize(fallSettingId) {
    super.initialize();
    this._fallSetting = settings.images.find((image) => image.id === fallSettingId);
    if (!this._fallSetting) {
      throw new Error('Invalid fallSettingId.');
    }
    this.bitmap = ImageManager.loadBitmap('', this._fallSetting.file);
  }

  setup() {
    this.opacity = 255;
    this.x = Math.floor(Math.random() * Graphics.boxWidth);
    this.y = Math.floor(Math.random() * Graphics.boxHeight + START_Y_OFFSET);
    this._lifeTime = this.initialLifeTime();
    const scale = this.calcScale();
    this.scale.set(scale, scale);
    this._row = Math.randomInt(this._fallSetting.rows);
    this._animationFrame = Math.randomInt(this._fallSetting.cols * this._fallSetting.animationSpeed);
    this.updateFrame();
  }

  update() {
    this._lifeTime--;
    this._animationFrame = (this._animationFrame + 1) % (this._fallSetting.cols * this._fallSetting.animationSpeed);
    this.x += this.moveSpeedX();
    this.y += this.moveSpeedY();
    this.updateFrame();
    this.updateLifeTime();
  }

  wavering() {
    return Math.randomInt(10 - this._fallSetting.waveringFrequency + 1) === 0;
  }

  moveSpeedX() {
    return (Math.randomInt(this._fallSetting.moveSpeedX) + 1) * (this.wavering() ? -1 : 1);
  }

  moveSpeedY() {
    return Math.randomInt(this._fallSetting.moveSpeedY) + 1;
  }

  updateLifeTime() {
    this._lifeTime--;
    if (this._lifeTime <= 50) {
      this.opacity -= 255 / 50;
    }
    if (this._lifeTime <= 0 && fallImageStatus.isFalling) {
      this.setup();
    }
  }

  updateFrame() {
    const width = this.frameWidth();
    const height = this.frameHeight();
    this.setFrame(
      Math.floor(this._animationFrame / this._fallSetting.animationSpeed) * width,
      this._row * height,
      width,
      height
    );
  }

  frameHeight() {
    return Math.floor(this.bitmap.height / this._fallSetting.rows);
  }

  frameWidth() {
    return Math.floor(this.bitmap.width / this._fallSetting.cols);
  }

  initialLifeTime() {
    return this._fallSetting.minimumLifeTime + Math.floor(Math.random() * this._fallSetting.lifeTimeRange);
  }

  calcScale() {
    return Math.randomInt(2) === 0 ? 0.5 : 1.5;
  }
}

const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function () {
  this._fallImageSprites = [];
  _Spriteset_Map_initialize.call(this);
};

const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function () {
  _Spriteset_Map_createLowerLayer.call(this);
  this.createFallImage();
};

Spriteset_Map.prototype.needCreateFallImage = function () {
  return fallImageStatus.startRequested || (fallImageStatus.isFalling && this._fallImageSprites.length === 0);
};

Spriteset_Map.prototype.createFallImage = function () {
  const image = fallImageStatus.requestedImageSetting();
  if (!image || !this.needCreateFallImage()) {
    return;
  }
  fallImageStatus.clearStartRequest();
  this._fallImageSprites = [...Array(image.count).keys()].map((_) => new Sprite_Falling(image.id));
  this._fallImageSprites.forEach((sprite) => {
    this.addChild(sprite);
    sprite.setup();
  });
};

const _Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function () {
  _Spriteset_Map_update.call(this);
  this.updateFallImage();
};

Spriteset_Map.prototype.updateFallImage = function () {
  if (fallImageStatus.startRequested) {
    this.createFallImage();
  } else if (fallImageStatus.stopRequested) {
    this.destroyFallImages();
  }
};

Spriteset_Map.prototype.destroyFallImages = function () {
  this._fallImageSprites.forEach((sprite) => sprite.destroy());
  fallImageStatus.clearStopRequest();
};
