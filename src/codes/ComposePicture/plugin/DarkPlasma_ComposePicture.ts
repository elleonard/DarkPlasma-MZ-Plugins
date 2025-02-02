/// <reference path="./ComposePicture.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { settings } from '../config/_build/DarkPlasma_ComposePicture_parameters';
import { command_composePicture, parseArgs_composePicture } from '../config/_build/DarkPlasma_ComposePicture_commands';

PluginManager.registerCommand(pluginName, command_composePicture, function (args) {
  const parsedArgs = parseArgs_composePicture(args);
  const basePicture = $gameScreen.picture(parsedArgs.basePictureId);
  $gameScreen.composePicture(
    parsedArgs.basePictureId,
    parsedArgs.additionalImages.map(image => $gameScreen.allocateAdditionalPicture(
      `../${image.name}`, // picturesとして扱う
      basePicture?.origin() || 0,
      image.offsetX,
      image.offsetY,
      image.scaleX,
      image.scaleY,
      image.opacity,
      image.blendMode
    ))
  );
});

function Game_Temp_ComposePictureMixIn(gameTemp: Game_Temp) {
  gameTemp.dummyWindow = function () {
    if (!this._dummyWindow) {
      this._dummyWindow = new Window_Base(new Rectangle(0, 0, 0, 0));
    }
    return this._dummyWindow;
  };
}

Game_Temp_ComposePictureMixIn(Game_Temp.prototype);

function Game_Screen_ComposePictureMixIn(gameScreen: Game_Screen) {
  gameScreen.allocateAdditionalPicture = function (name, origin, offsetX, offsetY, scaleX, scaleY, opacity, blendMode) {
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
    while(this._additionalPictures[++pictureId]);
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
  gameScreen.showPicture = function (
    pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
  ) {
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

function Game_Picture_ComposePictureMixIn(gamePicture: Game_Picture) {
  gamePicture.composePicture = function (additionalPictures) {
    this._additionalPictures = additionalPictures;
  };

  gamePicture.additionalPictures = function () {
    return this._additionalPictures || [];
  };
}

Game_Picture_ComposePictureMixIn(Game_Picture.prototype);

class Game_AdditionalPicture extends Game_Picture {
  _pictureId: number;

  name() {
    return $gameTemp.dummyWindow().convertEscapeCharacters(super.name());
  }

  setPictureId(id: number) {
    this._pictureId = id;
  }

  pictureId() {
    return this._pictureId;
  }
}

function Sprite_Picture_ComposePictureMixIn(spritePicture: Sprite_Picture) {
  const _update = spritePicture.update;
  spritePicture.update = function () {
    _update.call(this);
    this.updateCompose();
  };

  spritePicture.additionalPictureNames = function () {
    return this.children.filter((child): child is Sprite_Picture => child instanceof Sprite_Picture && child.picture() instanceof Game_AdditionalPicture)
      .map(sprite => (sprite.picture() as Game_AdditionalPicture).name());
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
     * 設定されている被合成ピクチャ名一覧と、実際の被合成ピクチャ名一覧が順序含めて等しい場合は更新不要
     */
    return JSON.stringify(picture.additionalPictures()
      .map(additionalPicture => additionalPicture.name())) !== JSON.stringify(this.additionalPictureNames());
  };

  spritePicture.updateCompose = function () {
    if (this.mustBeComposed()) {
      this.composePicture(this.picture()!.additionalPictures().map(gamePicture => {
        const sprite = new Sprite_Picture(gamePicture.pictureId());
        sprite.update();
        return sprite;
      }));
      this._forceUpdateCompose = false;
    }
  };

  spritePicture.composePicture = function (spritePictures) {
    this.removeChildren();
    this._additionalSprites = spritePictures;
    this._additionalSprites.forEach(sprite => this.addChild(sprite));
  };

  const _loadBitmap = spritePicture.loadBitmap;
  spritePicture.loadBitmap = function () {
    _loadBitmap.call(this);
    this.bitmap?.addLoadListener(() => {
      this._forceUpdateCompose = true;
      this.updateCompose();
  });
  };
}

Sprite_Picture_ComposePictureMixIn(Sprite_Picture.prototype);

type _Game_AdditionalPicture = typeof Game_AdditionalPicture;
declare global {
  var Game_AdditionalPicture: _Game_AdditionalPicture;
}
globalThis.Game_AdditionalPicture = Game_AdditionalPicture;
