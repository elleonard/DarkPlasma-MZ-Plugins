// DarkPlasma_ComposePicture 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/04/13 1.0.0 公開
 */

/*:
 * @plugindesc 画像を合成して1枚のピクチャとして扱う
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param startIdOfAdditionalPicture
 * @desc 合成する画像に割り当てるピクチャIDの始点を設定します。
 * @text 合成する画像のピクチャID始点
 * @type number
 * @min 201
 * @default 10001
 *
 * @command composePicture
 * @text 画像を合成する
 * @arg basePictureId
 * @desc 指定したピクチャをベース画像として扱います。
 * @text ベースピクチャID
 * @type number
 * @max 100
 * @min 1
 * @default 0
 * @arg additionalImages
 * @text 合成する画像
 * @type struct<AdditionalImage>[]
 * @default []
 *
 * @help
 * version: 1.0.0
 * 画像を合成して1枚のピクチャとして扱うプラグインコマンドを提供します。
 *
 * 本プラグインはセーブデータにピクチャの合成情報を追加します。
 */
/*~struct~AdditionalImage:
 * @param name
 * @text 画像ファイル
 * @type file
 * @dir img
 *
 * @param offsetX
 * @text X座標オフセット
 * @type number
 * @default 0
 *
 * @param offsetY
 * @text Y座標オフセット
 * @type number
 * @default 0
 *
 * @param scaleX
 * @text 拡大率 幅(％)
 * @type number
 * @default 100
 *
 * @param scaleY
 * @text 拡大率 高さ(％)
 * @type number
 * @default 100
 *
 * @param opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @default 255
 *
 * @param blendMode
 * @text 合成方法
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @default 0
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    startIdOfAdditionalPicture: Number(pluginParameters.startIdOfAdditionalPicture || 10001),
  };

  function parseArgs_composePicture(args) {
    return {
      basePictureId: Number(args.basePictureId || 0),
      additionalImages: args.additionalImages
        ? JSON.parse(args.additionalImages).map((e) => {
            return e
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    name: String(parsed.name || ``),
                    offsetX: Number(parsed.offsetX || 0),
                    offsetY: Number(parsed.offsetY || 0),
                    scaleX: Number(parsed.scaleX || 100),
                    scaleY: Number(parsed.scaleY || 100),
                    opacity: Number(parsed.opacity || 255),
                    blendMode: Number(parsed.blendMode || 0),
                  };
                })(e)
              : { name: '', offsetX: 0, offsetY: 0, scaleX: 100, scaleY: 100, opacity: 255, blendMode: 0 };
          })
        : [],
    };
  }

  const command_composePicture = 'composePicture';

  PluginManager.registerCommand(pluginName, command_composePicture, function (args) {
    const parsedArgs = parseArgs_composePicture(args);
    const basePicture = $gameScreen.picture(parsedArgs.basePictureId);
    $gameScreen.composePicture(
      parsedArgs.basePictureId,
      parsedArgs.additionalImages.map((image) =>
        $gameScreen.allocateAdditionalPicture(
          `../${image.name}`, // picturesとして扱う
          basePicture?.origin() || 0,
          image.offsetX - (basePicture?.x() || 0),
          image.offsetY - (basePicture?.y() || 0),
          image.scaleX,
          image.scaleY,
          image.opacity,
          image.blendMode,
        ),
      ),
    );
  });
  function Game_Screen_ComposePictureMixIn(gameScreen) {
    gameScreen.allocateAdditionalPicture = function (
      name,
      origin,
      offsetX,
      offsetY,
      scaleX,
      scaleY,
      opacity,
      blendMode,
    ) {
      const key = `${name}:${origin}:${offsetX}:${offsetY}:${scaleX}:${scaleY}:${opacity}:${blendMode}`;
      if (!this._cachedAdditionalPictures) {
        this._cachedAdditionalPictures = {};
      }
      if (this._cachedAdditionalPictures[key]) {
        return this._cachedAdditionalPictures[key];
      }
      if (!this._additionalPictures) {
        this._additionalPictures = {};
      }
      let pictureId = settings.startIdOfAdditionalPicture;
      while (this._additionalPictures[++pictureId]);
      const picture = new Game_AdditionalPicture();
      picture.setPictureId(pictureId);
      picture.show(name, origin, offsetX, offsetY, scaleX, scaleY, opacity, blendMode);
      this._additionalPictures[pictureId] = picture;
      this._cachedAdditionalPictures[key] = picture;
      return picture;
    };
    gameScreen.composePicture = function (basePictureId, additionalPictures) {
      const basePicture = this.picture(basePictureId);
      if (basePicture) {
        basePicture.composePicture(additionalPictures);
        if (!this._composedPictures) {
          this._composedPictures = {};
        }
        this._composedPictures[basePictureId] = additionalPictures;
      }
    };
    const _picture = gameScreen.picture;
    gameScreen.picture = function (pictureId) {
      if (pictureId >= settings.startIdOfAdditionalPicture) {
        return this._additionalPictures[pictureId];
      }
      return _picture.call(this, pictureId);
    };
    const _showPicture = gameScreen.showPicture;
    gameScreen.showPicture = function (pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
      _showPicture.call(this, pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
      if (!this._composedPictures) {
        this._composedPictures = {};
      }
      if (!this._composedPictures[pictureId]) {
        this._composedPictures[pictureId] = [];
      }
      /**
       * ピクチャの表示を行うとGame_Pictureインスタンスが再生成されるため、保持した合成情報を復元する
       */
      const picture = this.picture(pictureId);
      picture?.composePicture(this._composedPictures[pictureId]);
    };
  }
  Game_Screen_ComposePictureMixIn(Game_Screen.prototype);
  function Game_Picture_ComposePictureMixIn(gamePicture) {
    gamePicture.composePicture = function (additionalPictures) {
      this._additionalPictures = additionalPictures;
    };
    gamePicture.additionalPictures = function () {
      return this._additionalPictures || [];
    };
  }
  Game_Picture_ComposePictureMixIn(Game_Picture.prototype);
  class Game_AdditionalPicture extends Game_Picture {
    setPictureId(id) {
      this._pictureId = id;
    }
    pictureId() {
      return this._pictureId;
    }
  }
  function Sprite_Picture_ComposePictureMixIn(spritePicture) {
    const _update = spritePicture.update;
    spritePicture.update = function () {
      _update.call(this);
      this.updateCompose();
    };
    spritePicture.additionalPictureIds = function () {
      return this.children
        .filter((child) => child instanceof Sprite_Picture && child.picture() instanceof Game_AdditionalPicture)
        .map((sprite) => sprite.picture().pictureId());
    };
    spritePicture.mustBeComposed = function () {
      const picture = this.picture();
      if (!picture || picture.additionalPictures().length === 0) {
        return false;
      }
      if (this._forceUpdateCompose) {
        return true;
      }
      /**
       * 設定されている被合成ピクチャID一覧と、実際の被合成ピクチャID一覧が順序含めて等しい場合は更新不要
       */
      return (
        JSON.stringify(picture.additionalPictures().map((additionalPicture) => additionalPicture.pictureId())) !==
        JSON.stringify(this.additionalPictureIds())
      );
    };
    spritePicture.updateCompose = function () {
      if (this.mustBeComposed()) {
        this.composePicture(
          this.picture()
            .additionalPictures()
            .map((gamePicture) => {
              const sprite = new Sprite_Picture(gamePicture.pictureId());
              sprite.update();
              return sprite;
            }),
        );
        this._forceUpdateCompose = false;
      }
    };
    spritePicture.composePicture = function (spritePictures) {
      this.removeChildren();
      this._additionalSprites = spritePictures;
      this._additionalSprites.forEach((sprite) => this.addChild(sprite));
    };
    const _loadBitmap = spritePicture.loadBitmap;
    spritePicture.loadBitmap = function () {
      _loadBitmap.call(this);
      this.bitmap?.addLoadListener(() => (this._forceUpdateCompose = true));
    };
  }
  Sprite_Picture_ComposePictureMixIn(Sprite_Picture.prototype);
  globalThis.Game_AdditionalPicture = Game_AdditionalPicture;
})();
