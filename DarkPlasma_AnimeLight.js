// DarkPlasma_AnimeLight 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/08/06 1.0.0 公開
 */

/*:ja
 * @plugindesc 拡縮アニメーションする明かりイベント
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param defaultScale
 * @desc アニメーションの大きさを％で指定します。
 * @text 拡縮率（％）
 * @type number
 * @default 10
 *
 * @param defaultZ
 * @text Z座標
 * @type select
 * @option プライオリティ『通常キャラの下』より下
 * @value 0
 * @option プライオリティ『通常キャラと同じ』より下
 * @value 2
 * @option プライオリティ『通常キャラと同じ』より上
 * @value 4
 * @option プライオリティ『通常キャラの上』より上
 * @value 6
 * @default 4
 *
 * @param defaultFrameLength
 * @text 1周のフレーム数
 * @type number
 * @default 30
 *
 * @command markAsLight
 * @text 自動明かりイベント
 * @desc メモ欄に<animeLight>と記入してある場合、このイベントは自動的に明かりになります。
 * @arg image
 * @text 画像ファイル
 * @type file
 * @dir img
 * @arg opacity
 * @text 不透明度
 * @type number
 * @default 255
 * @max 255
 * @arg offsetX
 * @text X座標オフセット
 * @type number
 * @default 0
 * @arg offsetY
 * @text Y座標オフセット
 * @type number
 * @default 0
 * @arg scale
 * @text 拡縮率（％）
 * @desc アニメーションの大きさを％で指定します。0でデフォルト。
 * @type number
 * @default 0
 * @arg frameLength
 * @text フレーム数
 * @desc アニメーションフレーム数を設定します。0でデフォルト。
 * @type number
 * @default 0
 * @arg z
 * @text Z座標
 * @type select
 * @option デフォルト
 * @value -1
 * @option プライオリティ『通常キャラの下』より下
 * @value 0
 * @option プライオリティ『通常キャラと同じ』より下
 * @value 2
 * @option プライオリティ『通常キャラと同じ』より上
 * @value 4
 * @option プライオリティ『通常キャラの上』より上
 * @value 6
 * @default -1
 *
 * @help
 * version: 1.0.0
 * 拡縮アニメーションする明かりを
 * イベントの座標を基準にしてマップ上に表示します。
 *
 * イベントのメモ欄による設定
 * <animeLight:TMAnimeLight1 192 24 -44 4>
 *   画像 img/system/TMAnimeLight1.png を不透明度 192 で、
 *   イベントの足元から右に 24、
 *   上に 44 ドットずらした位置にZ座標 4 で表示します。
 *   不透明度は 0～255 です。
 *
 * プラグインコマンド 自動明かりイベントによる設定
 *   メモ欄の代わりに使用できます。
 *
 * 本プラグインは TMAnimeLight.js と一部互換性があります。
 * 注釈を用いることはできません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_markAsLight(args) {
    return {
      image: String(args.image || ''),
      opacity: Number(args.opacity || 255),
      offsetX: Number(args.offsetX || 0),
      offsetY: Number(args.offsetY || 0),
      scale: Number(args.scale || 0),
      frameLength: Number(args.frameLength || 0),
      z: Number(args.z || -1),
    };
  }

  const command_markAsLight = 'markAsLight';

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    defaultScale: Number(pluginParameters.defaultScale || 10),
    defaultZ: Number(pluginParameters.defaultZ || 4),
    defaultFrameLength: Number(pluginParameters.defaultFrameLength || 30),
  };

  const DEFAULT_OPACITY = 255;
  const DEFAULT_OFFSET = 0;

  class Data_AnimeLight {
    /**
     * @param {string} filename
     * @param {number} opacity
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} z
     * @param {number} scale
     * @param {number} frameLength
     */
    constructor(filename, opacity, offsetX, offsetY, z, scale, frameLength) {
      this._filename = filename;
      this._opacity = opacity;
      this._scale = scale || settings.defaultScale;
      this._z = z >= 0 ? z : settings.defaultZ;
      this._offsetX = offsetX;
      this._offsetY = offsetY;
      this._frameLength = frameLength || settings.defaultFrameLength;
      this._sinTable = [...Array(this._frameLength).keys()].map((i) => {
        return (Math.sin((Math.PI * i) / (this._frameLength / 2)) * this._scale) / 100 + 1;
      });
    }

    /**
     * @param {string} meta
     * @return {Data_AnimeLight}
     */
    static fromEventMeta(meta) {
      const data = meta.split(' ');
      return new Data_AnimeLight(
        `system/${data[0]}`,
        Number(data[1] || DEFAULT_OPACITY),
        Number(data[2] || DEFAULT_OFFSET),
        Number(data[3] || DEFAULT_OFFSET),
        Number(data[4] || settings.defaultZ),
        settings.defaultScale,
        settings.defaultFrameLength
      );
    }

    get opacity() {
      return this._opacity;
    }

    get offsetX() {
      return this._offsetX;
    }

    get offsetY() {
      return this._offsetY;
    }

    get z() {
      return this._z;
    }

    get scale() {
      return this._scale;
    }

    get frameLength() {
      return this._frameLength;
    }

    get sinTable() {
      return this._sinTable;
    }

    /**
     * @return {Bitmap}
     */
    bitmap() {
      return ImageManager.loadBitmap('img/', this._filename);
    }
  }

  PluginManager.registerCommand(pluginName, command_markAsLight, function () {});

  /**
   * @param {Game_Temp.prototype} gameTemp
   */
  function Game_Temp_AnimeLightMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._requestedAnimeLightCharacters = [];
    };

    gameTemp.requestedAnimeLightCharacter = function () {
      return this._requestedAnimeLightCharacters.shift();
    };

    gameTemp.requestAnimeLight = function (character) {
      this._requestedAnimeLightCharacters.push(character);
    };
  }

  Game_Temp_AnimeLightMixIn(Game_Temp.prototype);

  /**
   * @param {Game_CharacterBase.prototype} gameCharacterBase
   */
  function Game_CharacterBase_AnimeLightMixIn(gameCharacterBase) {
    gameCharacterBase.animeLightSetting = function () {
      return null;
    };
  }

  Game_CharacterBase_AnimeLightMixIn(Game_CharacterBase.prototype);

  /**
   * @param {Game_Event.prototype} gameEvent
   */
  function Game_Event_AnimeLightMixIn(gameEvent) {
    gameEvent.hasAnimeLight = function () {
      return !!this.event() && !!this.event().meta.animeLight;
    };

    gameEvent.isMarkedAsAnimeLight = function () {
      return !!this.event() && this.event().meta.animeLight === true;
    };

    gameEvent.animeLightSetting = function () {
      if (this.hasAnimeLight()) {
        if (this.isMarkedAsAnimeLight()) {
          const command = this.page().list.find(
            (command) =>
              command.code === 357 &&
              command.parameters.includes(pluginName) &&
              command.parameters.includes(command_markAsLight)
          );
          if (command) {
            const parsedArgs = parseArgs_markAsLight(command.parameters[3]);
            return new Data_AnimeLight(
              parsedArgs.filename,
              parsedArgs.opacity,
              parsedArgs.offsetX,
              parsedArgs.offsetY,
              parsedArgs.z,
              parsedArgs.scale,
              parsedArgs.frameLength
            );
          }
        } else {
          return Data_AnimeLight.fromEventMeta(this.event().meta.animeLight);
        }
      }
      return null;
    };
  }

  Game_Event_AnimeLightMixIn(Game_Event.prototype);

  /**
   * @param {Spriteset_Map.prototype} spritesetMap
   */
  function Spriteset_Map_AnimeLightMixIn(spritesetMap) {
    const _initialize = spritesetMap.initialize;
    spritesetMap.initialize = function () {
      _initialize.call(this);
      this._animeLightSprites = [];
      this.initAnimeLights();
    };

    spritesetMap.initAnimeLights = function () {
      $gameMap
        .events()
        .filter((event) => event.hasAnimeLight())
        .forEach((event) => $gameTemp.requestAnimeLight(event));
    };

    const _update = spritesetMap.update;
    spritesetMap.update = function () {
      _update.call(this);
      this.updateAnimeLight();
    };

    spritesetMap.updateAnimeLight = function () {
      let character;
      while ((character = $gameTemp.requestedAnimeLightCharacter())) {
        const sprite = new Sprite_AnimeLight(character);
        this._tilemap.addChild(sprite);
        this._animeLightSprites.push(sprite);
      }
    };
  }

  Spriteset_Map_AnimeLightMixIn(Spriteset_Map.prototype);

  class Sprite_AnimeLight extends Sprite {
    /**
     * @param {Game_CharacterBase} character
     */
    initialize(character) {
      super.initialize();
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this.blendMode = PIXI.BLEND_MODES.ADD;
      this._animationFrame = 0;
      this._character = character;
      this.setup();
    }

    setup() {
      const animeLightSetting = this._character.animeLightSetting();
      this._setting = animeLightSetting;
      this.bitmap = animeLightSetting.bitmap();
      this.opacity = animeLightSetting.opacity;
      this.z = animeLightSetting.z;
    }

    stopAnimation() {
      this._stopped = true;
    }

    startAnimation() {
      this._stopped = false;
    }

    update() {
      super.update();
      if (!this._stopped) {
        this._animationFrame++;
        if (this._animationFrame >= this._setting.frameLength) {
          this._animationFrame = 0;
        }
        this.x = this._character.screenX() + this._setting.offsetX;
        this.y = this._character.screenY() + this._setting.offsetY;
        this.scale.set(this._setting.sinTable[this._animationFrame]);
      }
    }
  }
})();
