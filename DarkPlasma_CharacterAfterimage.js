// DarkPlasma_CharacterAfterimage 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/01 1.0.0 公開
 */

/*:
 * @plugindesc マップ上のキャラクターに残像を表示する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param duration
 * @text 表示時間(フレーム数)
 * @type number
 * @default 30
 *
 * @param generationInterval
 * @text 生成間隔(フレーム数)
 * @type number
 * @default 4
 *
 * @param opacity
 * @text 不透明度
 * @type number
 * @max 255
 * @default 255
 *
 * @param colorTone
 * @text 色調
 * @type struct<ColorTone>
 * @default {"red":"0","blue":"0","green":"0","alpha":"0"}
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
 *
 * @command startAfterimage
 * @text 残像の表示
 * @desc プレイヤーまたはイベントに対して残像を表示します。
 * @arg target
 * @desc 残像の表示対象を選択します。
 * @text 対象
 * @type select
 * @option プレイヤー
 * @value player
 * @option このイベント
 * @value thisEvent
 * @option 他のイベント
 * @value otherEvent
 * @default player
 * @arg eventId
 * @desc 対象が他のイベントの場合に、イベントIDを指定します。
 * @text イベントID
 * @type number
 * @default 0
 *
 * @command clearAfterimage
 * @text 残像の消去
 * @desc プレイヤーまたはイベントに対して表示している残像を消去します。
 * @arg target
 * @desc 残像の表示対象を選択します。
 * @text 対象
 * @type select
 * @option プレイヤー
 * @value player
 * @option このイベント
 * @value thisEvent
 * @option 他のイベント
 * @value otherEvent
 * @default player
 * @arg eventId
 * @desc 対象が他のイベントの場合に、イベントIDを指定します。
 * @text イベントID
 * @type number
 * @default 0
 *
 * @help
 * version: 1.0.0
 * マップ上のキャラクターに残像を表示します。
 */
/*~struct~ColorTone:
 * @param red
 * @text 赤
 * @type number
 * @max 255
 * @default 0
 *
 * @param green
 * @text 緑
 * @type number
 * @max 255
 * @default 0
 *
 * @param blue
 * @text 青
 * @type number
 * @max 255
 * @default 0
 *
 * @param alpha
 * @text α
 * @type number
 * @max 255
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
    duration: Number(pluginParameters.duration || 30),
    generationInterval: Number(pluginParameters.generationInterval || 4),
    opacity: Number(pluginParameters.opacity || 255),
    colorTone: pluginParameters.colorTone
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            red: Number(parsed.red || 0),
            green: Number(parsed.green || 0),
            blue: Number(parsed.blue || 0),
            alpha: Number(parsed.alpha || 0),
          };
        })(pluginParameters.colorTone)
      : { red: 0, blue: 0, green: 0, alpha: 0 },
    blendMode: Number(pluginParameters.blendMode || 0),
  };

  function parseArgs_startAfterimage(args) {
    return {
      target: String(args.target || `player`),
      eventId: Number(args.eventId || 0),
    };
  }

  const command_startAfterimage = 'startAfterimage';

  const command_clearAfterimage = 'clearAfterimage';

  PluginManager.registerCommand(pluginName, command_startAfterimage, function (args) {
    const parsedArgs = parseArgs_startAfterimage(args);
    const target = (() => {
      switch (parsedArgs.target) {
        case 'player':
          return $gamePlayer;
        case 'thisEvent':
          return this.character(0);
        case 'otherEvent':
          return this.character(parsedArgs.eventId);
        default:
          return null;
      }
    })();
    target?.requestStartAfterimage();
  });
  PluginManager.registerCommand(pluginName, command_clearAfterimage, function (args) {
    const parsedArgs = parseArgs_startAfterimage(args);
    const target = (() => {
      switch (parsedArgs.target) {
        case 'player':
          return $gamePlayer;
        case 'thisEvent':
          return this.character(0);
        case 'otherEvent':
          return this.character(parsedArgs.eventId);
        default:
          return null;
      }
    })();
    target?.clearAfterimage();
  });
  function Game_CharacterBase_AfterimageMixIn(gameCharacterBase) {
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
  function Spriteset_Map_AfterimageMixIn(spritesetMap) {
    const _update = spritesetMap.update;
    spritesetMap.update = function () {
      _update.call(this);
      this._characterSprites.forEach((character) => character.clearReservedAfterimages());
    };
  }
  Spriteset_Map_AfterimageMixIn(Spriteset_Map.prototype);
  function Sprite_Character_AfterimageMixIn(spriteCharacter) {
    const _initialize = spriteCharacter.initialize;
    spriteCharacter.initialize = function (character) {
      _initialize.call(this, character);
      this._afterimageSprites = [];
    };
    spriteCharacter.createAfterimage = function () {
      const afterimage = new Sprite_CharacterAfterimage(this._character)
        .withPosition(this.x, this.y, this.z - 0.1)
        .withScale(this.scale)
        .withRotation(this.rotation)
        .withAnchor(this.anchor.x, this.anchor.y);
      this._afterimageSprites.push(afterimage);
      this.parent.addChild(afterimage);
    };
    spriteCharacter.clearAfterimage = function () {
      this._afterimageSprites.forEach((afterimage) => this.parent.removeChild(afterimage));
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
      this._clearReservedAfterimageSprites = this._afterimageSprites.filter((afterimage) => afterimage.opacity <= 0);
      this._afterimageSprites = this._afterimageSprites.filter((afterimage) => afterimage.opacity > 0);
      if (this._character.afterimage()?.mustGenerateSprite()) {
        this.createAfterimage();
        this._character.afterimage()?.resetGenerationFrameCount();
      }
    };
    spriteCharacter.clearReservedAfterimages = function () {
      this._clearReservedAfterimageSprites.forEach((sprite) => this.parent.removeChild(sprite));
      this._clearReservedAfterimageSprites = [];
    };
  }
  Sprite_Character_AfterimageMixIn(Sprite_Character.prototype);
  class Sprite_CharacterAfterimage extends Sprite_Character {
    constructor(character) {
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
    withPosition(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    withScale(scale) {
      this.scale = scale;
      return this;
    }
    withRotation(rotation) {
      this.rotation = rotation;
      return this;
    }
    withAnchor(x, y) {
      this.anchor.x = x;
      this.anchor.y = y;
      return this;
    }
    update() {
      this.opacity -= this._afterimage.initialOpacity() / this._afterimage.duration();
      this.updatePosition();
    }
    updatePosition() {
      super.updatePosition();
      this.z -= 0.1;
    }
  }
  globalThis.Game_CharacterAfterimage = Game_CharacterAfterimage;
})();
