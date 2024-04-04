// DarkPlasma_MaskPicture 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/04/04 1.0.0 公開
 */

/*:
 * @plugindesc ピクチャを別のピクチャでマスクする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command maskPicture
 * @text ピクチャをマスクする
 * @arg basePictureId
 * @text ベースピクチャID
 * @type number
 * @default 0
 * @arg maskPictureId
 * @text マスクピクチャID
 * @type number
 * @default 0
 *
 * @command unmaskPicture
 * @text ピクチャにかけたマスクを解除する
 * @arg basePictureId
 * @text ベースピクチャID
 * @type number
 * @default 0
 *
 * @help
 * version: 1.0.0
 * ピクチャでピクチャをマスクします。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_maskPicture(args) {
    return {
      basePictureId: Number(args.basePictureId || 0),
      maskPictureId: Number(args.maskPictureId || 0),
    };
  }

  function parseArgs_unmaskPicture(args) {
    return {
      basePictureId: Number(args.basePictureId || 0),
    };
  }

  const command_maskPicture = 'maskPicture';

  const command_unmaskPicture = 'unmaskPicture';

  PluginManager.registerCommand(pluginName, command_maskPicture, function (args) {
    const parsedArgs = parseArgs_maskPicture(args);
    $gameScreen.picture(parsedArgs.basePictureId)?.mask(parsedArgs.maskPictureId);
  });
  PluginManager.registerCommand(pluginName, command_unmaskPicture, function (args) {
    const parsedArgs = parseArgs_unmaskPicture(args);
    $gameScreen.picture(parsedArgs.basePictureId)?.unmask();
  });
  function Game_Picture_MaskPictureMixIn(gamePicture) {
    gamePicture.mask = function (maskPictureId) {
      this._maskPictureId = maskPictureId;
    };
    gamePicture.unmask = function () {
      this._maskPictureId = undefined;
    };
    gamePicture.maskPictureId = function () {
      return this._maskPictureId;
    };
  }
  Game_Picture_MaskPictureMixIn(Game_Picture.prototype);
  function Spriteset_MaskPictureMixIn(spriteset) {
    const _createPictures = spriteset.createPictures;
    spriteset.createPictures = function () {
      _createPictures.call(this);
      /**
       * ピクチャIDによるランダムアクセスを可能にしてマスク関連処理の計算量を抑える
       */
      this._spritePictures = [];
      this._pictureContainer.children
        .filter((sprite) => sprite instanceof Sprite_Picture)
        .forEach((sprite) => (this._spritePictures[sprite.pictureId()] = sprite));
    };
    const _update = spriteset.update;
    spriteset.update = function () {
      _update.call(this);
      this.updateMask();
    };
    spriteset.updateMask = function () {
      this._pictureContainer.children
        .filter((sprite) => sprite instanceof Sprite_Picture && this.mustUpdateMask(sprite))
        .forEach((sprite) => sprite.setMask(this.spritePicture(sprite.picture()?.maskPictureId())));
    };
    spriteset.spritePicture = function (pictureId) {
      return pictureId ? this._spritePictures[pictureId] || null : null;
    };
    spriteset.mustUpdateMask = function (sprite) {
      const mustBeMaskedWith = this.spritePicture(sprite.picture()?.maskPictureId());
      return sprite.visible && !sprite.isMaskedWith(mustBeMaskedWith);
    };
  }
  Spriteset_MaskPictureMixIn(Spriteset_Base.prototype);
  function Sprite_Picture_MaskPictureMixIn(spritePicture) {
    spritePicture.setMask = function (sprite) {
      this.mask = sprite;
    };
    spritePicture.isMaskedWith = function (sprite) {
      return this.mask === sprite;
    };
    spritePicture.pictureId = function () {
      return this._pictureId;
    };
  }
  Sprite_Picture_MaskPictureMixIn(Sprite_Picture.prototype);
})();
