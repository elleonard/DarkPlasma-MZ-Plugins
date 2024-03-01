/// <reference path="./CharacterAfterimage.d.ts" />

import { settings } from '../config/_build/DarkPlasma_CharacterAfterimage_parameters';
import { command_clearAfterimage, command_startAfterimage, parseArgs_startAfterimage } from '../config/_build/DarkPlasma_CharacterAfterimage_commands';
import { pluginName } from '../../../common/pluginName';

PluginManager.registerCommand(pluginName, command_startAfterimage, function(this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_startAfterimage(args);
  const target = (() => {
    switch (parsedArgs.target) {
      case "player":
        return $gamePlayer;
        case "thisEvent":
          return this.character(0);
        case "otherEvent":
          return this.character(parsedArgs.eventId);
        default:
          return null;
    }
  })();
  target?.requestStartAfterimage();
});

PluginManager.registerCommand(pluginName, command_clearAfterimage, function(this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_startAfterimage(args);
  const target = (() => {
    switch (parsedArgs.target) {
      case "player":
        return $gamePlayer;
        case "thisEvent":
          return this.character(0);
        case "otherEvent":
          return this.character(parsedArgs.eventId);
        default:
          return null;
    }
  })();
  target?.clearAfterimage();
});

function Game_CharacterBase_AfterimageMixIn(gameCharacterBase: Game_CharacterBase) {
  const _initMembers = gameCharacterBase.initMembers;
  gameCharacterBase.initMembers = function () {
    _initMembers.call(this);
    this._afterimage = undefined;
  };

  gameCharacterBase.hasAfterimage = function () {
    return !!this._afterimage;
  };

  gameCharacterBase.afterimage = function () {
    return this._afterimage;
  };

  gameCharacterBase.requestStartAfterimage = function () {
    this._afterimage = new Game_CharacterAfterimage();
  };

  gameCharacterBase.clearAfterimage = function () {
    this._afterimage = undefined;
  };

  const _update = gameCharacterBase.update;
  gameCharacterBase.update = function () {
    _update.call(this);
    this._afterimage?.update();
  };
}

Game_CharacterBase_AfterimageMixIn(Game_CharacterBase.prototype);

class Game_CharacterAfterimage {
  _interval: number;
  _generateAfterimageFrameCount: number;
  _duration: number;
  _initialOpacity: number;
  _colorTone: [number, number, number, number];
  _blendMode: number;

  constructor() {
    this._interval = settings.generationInterval;
    this._generateAfterimageFrameCount = settings.generationInterval;
    this._duration = settings.duration;
    this._initialOpacity = settings.opacity;
    this._colorTone = [
      settings.colorTone.red,
      settings.colorTone.green,
      settings.colorTone.blue,
      settings.colorTone.alpha,
    ];
    this._blendMode = settings.blendMode;
  }

  update() {
    this._generateAfterimageFrameCount++;
  }

  resetGenerationFrameCount() {
    this._generateAfterimageFrameCount = 0;
  }

  mustGenerateSprite() {
    return this._generateAfterimageFrameCount >= this._interval;
  }

  duration() {
    return this._duration;
  }

  initialOpacity() {
    return this._initialOpacity;
  }

  colorTone() {
    return this._colorTone;
  }

  blendMode() {
    return this._blendMode;
  }
}

function Spriteset_Map_AfterimageMixIn(spritesetMap: Spriteset_Map) {
  const _update = spritesetMap.update;
  spritesetMap.update = function () {
    _update.call(this);
    this._characterSprites.forEach(character => character.clearReservedAfterimages());
  };
}

Spriteset_Map_AfterimageMixIn(Spriteset_Map.prototype);

function Sprite_Character_AfterimageMixIn(spriteCharacter: Sprite_Character) {
  const _initialize = spriteCharacter.initialize;
  spriteCharacter.initialize = function (character) {
    _initialize.call(this, character);
    this._afterimageSprites = [];
  };

  spriteCharacter.createAfterimage = function() {
    const afterimage = new Sprite_CharacterAfterimage(this._character)
      .withPosition(this.x, this.y, this.z - 0.1)
      .withScale(this.scale)
      .withRotation(this.rotation)
      .withAnchor(this.anchor.x, this.anchor.y);

    this._afterimageSprites.push(afterimage);
    this.parent.addChild(afterimage);
  };

  spriteCharacter.clearAfterimage = function () {
    this._afterimageSprites.forEach(afterimage => this.parent.removeChild(afterimage));

    this._afterimageSprites = [];
  };

  const _update = spriteCharacter.update;
  spriteCharacter.update = function () {
    _update.call(this);
    this.updateAfterimage();
  };

  spriteCharacter.updateAfterimage = function () {
    /**
     * ここでremoveChildしてしまうとtilemapの子spriteの数が変動し、updateがスキップされてしまうspriteが現れる
     * そのため、removeChildの予約だけしておく
     */
    this._clearReservedAfterimageSprites = this._afterimageSprites.filter(afterimage => afterimage.opacity <= 0);
    this._afterimageSprites = this._afterimageSprites.filter(afterimage => afterimage.opacity > 0);
    if (this._character.afterimage()?.mustGenerateSprite()) {
      this.createAfterimage();
      this._character.afterimage()?.resetGenerationFrameCount();
    }
  };

  spriteCharacter.clearReservedAfterimages = function () {
    this._clearReservedAfterimageSprites.forEach(sprite => this.parent.removeChild(sprite));
    this._clearReservedAfterimageSprites = [];
  };
}

Sprite_Character_AfterimageMixIn(Sprite_Character.prototype);

class Sprite_CharacterAfterimage extends Sprite_Character {
  _afterimage: Game_CharacterAfterimage;

  constructor(character: Game_Character) {
    super(character);
    const afterimage = character.afterimage();
    if (!afterimage) {
      throw new Error(`対象キャラクターに残像情報が存在しません。`);
    }
    /**
     * この時点でのキャラクター情報をコピーしておく
     */
    this._character = JsonEx.makeDeepCopy(character);
    this._afterimage = afterimage;
    this.setColorTone(afterimage.colorTone());
    this.blendMode = afterimage.blendMode();
    this.updateBitmap();
    this.updateFrame();
  }

  withPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  withScale(scale: PIXI.IPoint) {
    this.scale = scale;
    return this;
  }

  withRotation(rotation: number) {
    this.rotation = rotation;
    return this;
  }

  withAnchor(x: number, y: number) {
    this.anchor.x = x;
    this.anchor.y = y;
    return this;
  }

  update() {
    this.opacity -= this._afterimage.initialOpacity() / this._afterimage.duration();
    this.updatePosition();
  }

  public updatePosition(): void {
    super.updatePosition();
    this.z -= 0.1;
  }
}

type _Game_CharacterAfterimage = typeof Game_CharacterAfterimage;
declare global {
  var Game_CharacterAfterimage: _Game_CharacterAfterimage;
}
globalThis.Game_CharacterAfterimage = Game_CharacterAfterimage;
