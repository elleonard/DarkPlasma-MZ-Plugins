// DarkPlasma_FallImages 1.0.4
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.4 MZ 1.3.2に対応
 * 2021/06/22 1.0.3 サブフォルダからの読み込みに対応
 * 2020/12/16 1.0.2 ゲーム終了時に正しく状態を初期化しない不具合を修正
 * 2020/10/25 1.0.1 ヘルプ追記
 * 2020/10/24 1.0.0 公開
 */

/*:ja
 * @plugindesc 画面内に画像を降らせる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param images
 * @desc 降らせる画像の設定
 * @text 画像設定
 * @type struct<FallImage>[]
 * @default []
 *
 * @command startFall
 * @text 画像を降らせる
 * @desc 画像を画面内に降らせます。
 * @arg id
 * @text 降らせる画像設定ID
 * @desc 降らせる画像設定のIDです。
 * @type number
 *
 * @command stopFall
 * @text 画像を消す
 * @desc 降らせている画像を消し、止ませます。
 *
 * @command fadeOutFall
 * @text 画像をフェードアウトする
 * @desc 振らせている画像をフェードアウトさせ、止ませます。
 *
 * @help
 * version: 1.0.4
 * 何らかの画像を降らせる画面演出を提供します。
 *
 * プラグインパラメータにIDと画像ファイルを設定し、
 * プラグインコマンドでそのIDを指定してください。
 *
 * 本プラグインはセーブデータを拡張します。
 * 画像を降らせるための状態をセーブします。
 */
/*~struct~FallImage:
 * @param id
 * @desc 降らせる画像設定のIDです。降らせるプラグインコマンドで指定します。
 * @text 画像設定ID
 * @type number
 * @default 1
 *
 * @param file
 * @desc 降らせるための画像ファイルを指定します。
 * @text 画像ファイル
 * @type file
 *
 * @param rows
 * @desc 降らせる画像の行数を指定します。
 * @text 画像の行数
 * @type number
 * @default 5
 *
 * @param cols
 * @desc 降らせる画像の列数を指定します。
 * @text 画像の列数
 * @type number
 * @default 18
 *
 * @param count
 * @desc 画面内に一度に表示する数を指定します。
 * @text 表示数
 * @type number
 * @default 40
 *
 * @param waveringFrequency
 * @desc 降る過程で揺れる頻度を指定します。最大10で、多いほど頻繁に揺れます。
 * @text 揺れ頻度
 * @type number
 * @default 7
 * @max 10
 *
 * @param minimumLifeTime
 * @desc 1枚を降らせ続ける最短の時間（フレーム単位）を指定します。
 * @text 最短表示時間
 * @type number
 * @default 150
 *
 * @param lifeTimeRange
 * @desc 1枚を降らせ続ける時間の範囲（フレーム単位）を指定します。最短表示時間とこの値の和が最長表示時間になります。
 * @text 表示時間の範囲
 * @type number
 * @default 500
 *
 * @param animationSpeed
 * @desc アニメーションする速さを指定します。小さいほど速くアニメーションします。
 * @text アニメーション速度
 * @type number
 * @default 2
 *
 * @param moveSpeedX
 * @desc 横方向の移動速度を指定します。大きいほど速く移動します。
 * @text 横移動速度
 * @type number
 * @default 4
 *
 * @param moveSpeedY
 * @desc 落下速度を指定します。大きいほど速く落下します。
 * @text 縦移動速度
 * @type number
 * @default 6
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    images: JSON.parse(pluginParameters.images || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 1),
          file: String(parsed.file || ''),
          rows: Number(parsed.rows || 5),
          cols: Number(parsed.cols || 18),
          count: Number(parsed.count || 40),
          waveringFrequency: Number(parsed.waveringFrequency || 7),
          minimumLifeTime: Number(parsed.minimumLifeTime || 150),
          lifeTimeRange: Number(parsed.lifeTimeRange || 500),
          animationSpeed: Number(parsed.animationSpeed || 2),
          moveSpeedX: Number(parsed.moveSpeedX || 4),
          moveSpeedY: Number(parsed.moveSpeedY || 6),
        };
      })(e || '{}');
    }),
  };

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
})();
