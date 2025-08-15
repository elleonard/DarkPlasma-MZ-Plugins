// DarkPlasma_DarkMap 3.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/08/15 3.0.0 明かりを点ける, 消すプラグインコマンドの追加
 *                  明かり判定インターフェースに破壊的変更
 * 2024/02/23 2.2.0 プレイヤー、イベント以外にも対応できるようにインターフェースを追加
 * 2024/01/23 2.1.0 プレイヤーの明かりの広さを設定可能に
 * 2024/01/21 2.0.0 暗闇の色をRGBすべてについて設定可能に
 *                  デフォルトの明かりの広さを変数で設定可能に
 * 2024/01/15 1.0.3 ビルド方式を変更 (configをTypeScript化)
 * 2022/08/19 1.0.2 typescript移行
 * 2022/03/31 1.0.1 TemplateEvent.jsと併用すると戦闘テストできない不具合を修正
 * 2021/11/19 1.0.0 公開
 */

/*:
 * @plugindesc 暗いマップと明かり
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param darknessColor
 * @text 暗闇の色
 * @type struct<Color>
 * @default {"red":"0","green":"0","blue":"0"}
 *
 * @param lightColor
 * @text 明かりの色
 * @type struct<Color>
 * @default {"red":"255","green":"255","blue":"255"}
 *
 * @param lightRadius
 * @desc デフォルトの明かりの広さを設定します。
 * @text 明かりの広さ
 * @type number
 * @default 200
 *
 * @param lightRadiusVariable
 * @desc デフォルトの明かりの広さを変数で設定します。
 * @text 明かりの広さ(変数)
 * @type variable
 * @default 0
 *
 * @param lightRadiusPlayer
 * @desc プレイヤーの明かりの広さを設定します。負の値を設定するとデフォルトの広さを使用します。
 * @text 明かりの広さ(プレイヤー)
 * @type number
 * @min -1
 * @default -1
 *
 * @command turnOnLight
 * @text 明かりを点ける
 * @desc 指定した対象の明かりを点けます。
 * @arg target
 * @desc 明かりを点ける対象を選択します。
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
 * @arg lightColor
 * @text 明かりの色
 * @type struct<Color>
 * @default {"red":"255","green":"255","blue":"255"}
 * @arg lightRadius
 * @desc 明かりの広さを設定します。
 * @text 明かりの広さ
 * @type number
 * @default 200
 *
 * @command turnOffLight
 * @text 明かりを消す
 * @desc 指定した対象の明かりを消します。
 * @arg target
 * @desc 明かりを消す対象を選択します。
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
 * version: 3.0.0
 * 暗いマップと、プレイヤーやイベントの周囲を照らす明かりを提供します。
 *
 * マップのメモ欄:
 * <dark> 暗いマップにします。
 *
 * イベントのメモ欄:
 * <light> デフォルトでイベントの周囲を照らします。
 * <lightColor:#ffbb73> 明かりの色を設定します。
 * <lightRadius:155> 明かりの範囲を設定します。
 * <saveLight> このイベントの明かりの状態を別マップに移動した後も保存します。
 *
 * 本プラグインはセーブデータを拡張します。
 * マップ上のキャラクターについて、下記のデータを追加します。
 * - 明かりが点いているかどうか
 * - 明かりの色
 * - 明かりの広さ
 *
 */
/*~struct~Color:
 * @param red
 * @text 赤
 * @type number
 * @max 255
 * @default 255
 *
 * @param green
 * @text 緑
 * @type number
 * @max 255
 * @default 255
 *
 * @param blue
 * @text 青
 * @type number
 * @max 255
 * @default 255
 */
(() => {
  'use strict';

  /**
   * マップのメタデータを取得できるか
   * @return {boolean}
   */
  function isMapMetaDataAvailable() {
    return $dataMap && $dataMap.meta;
  }

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    darknessColor: pluginParameters.darknessColor
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            red: Number(parsed.red || 255),
            green: Number(parsed.green || 255),
            blue: Number(parsed.blue || 255),
          };
        })(pluginParameters.darknessColor)
      : { red: 0, green: 0, blue: 0 },
    lightColor: pluginParameters.lightColor
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            red: Number(parsed.red || 255),
            green: Number(parsed.green || 255),
            blue: Number(parsed.blue || 255),
          };
        })(pluginParameters.lightColor)
      : { red: 255, green: 255, blue: 255 },
    lightRadius: Number(pluginParameters.lightRadius || 200),
    lightRadiusVariable: Number(pluginParameters.lightRadiusVariable || 0),
    lightRadiusPlayer: Number(pluginParameters.lightRadiusPlayer || -1),
  };

  function parseArgs_turnOnLight(args) {
    return {
      target: String(args.target || `player`),
      eventId: Number(args.eventId || 0),
      lightColor: args.lightColor
        ? ((parameter) => {
            const parsed = JSON.parse(parameter);
            return {
              red: Number(parsed.red || 255),
              green: Number(parsed.green || 255),
              blue: Number(parsed.blue || 255),
            };
          })(args.lightColor)
        : { red: 255, green: 255, blue: 255 },
      lightRadius: Number(args.lightRadius || 200),
    };
  }

  function parseArgs_turnOffLight(args) {
    return {
      target: String(args.target || `player`),
      eventId: Number(args.eventId || 0),
    };
  }

  const command_turnOnLight = 'turnOnLight';

  const command_turnOffLight = 'turnOffLight';

  function darkColor() {
    return `#${(
      (1 << 24) +
      (settings.darknessColor.red << 16) +
      (settings.darknessColor.green << 8) +
      settings.darknessColor.blue
    )
      .toString(16)
      .slice(1)}`;
  }
  function convertColor(color) {
    return `#${((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue).toString(16).slice(1)}`;
  }
  function defaultLightColor() {
    return convertColor(settings.lightColor);
  }
  function defaultLightRadius() {
    if (settings.lightRadiusVariable) {
      return $gameVariables.value(settings.lightRadiusVariable);
    }
    return settings.lightRadius;
  }
  PluginManager.registerCommand(pluginName, command_turnOnLight, function (args) {
    const parsedArgs = parseArgs_turnOnLight(args);
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
    target?.turnOnLight();
  });
  PluginManager.registerCommand(pluginName, command_turnOffLight, function (args) {
    const parsedArgs = parseArgs_turnOffLight(args);
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
    target?.turnOffLight();
  });
  function Bitmap_DarkMapMixIn(bitmap) {
    bitmap.fillGradientCircle = function (centerX, centerY, radius, lightColor) {
      const context = this._context;
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, lightColor);
      gradient.addColorStop(1, darkColor());
      context.save();
      context.globalCompositeOperation = 'lighter';
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.fill();
      context.restore();
      this._baseTexture.update();
    };
  }
  Bitmap_DarkMapMixIn(Bitmap.prototype);
  function Game_Map_DarkMapMixIn(gameMap) {
    gameMap.isDark = function () {
      return isMapMetaDataAvailable() && !!$dataMap.meta.dark;
    };
    gameMap.lightEvents = function () {
      return this.events().filter((event) => event.isLightOn());
    };
  }
  Game_Map_DarkMapMixIn(Game_Map.prototype);
  function Game_CharacterBase_DarkMapMixIn(gameCharacterBase) {
    const _initMembers = gameCharacterBase.initMembers;
    gameCharacterBase.initMembers = function () {
      _initMembers.call(this);
      this.initializeLight();
    };
    gameCharacterBase.initializeLight = function () {
      this._light = {
        isOn: false,
        radius: 0,
      };
    };
    gameCharacterBase.isLightOn = function () {
      return this._light?.isOn || false;
    };
    gameCharacterBase.turnOnLight = function () {
      if (!this._light) {
        this.initializeLight();
      }
      this._light.isOn = true;
      this.onLightChange();
    };
    gameCharacterBase.turnOffLight = function () {
      if (!this._light) {
        this.initializeLight();
      }
      this._light.isOn = false;
      this.onLightChange();
    };
    gameCharacterBase.lightRadius = function () {
      return this.isLightOn() ? this._light?.radius || defaultLightRadius() : 0;
    };
    gameCharacterBase.setLightRadius = function (radius) {
      if (!this._light) {
        this.initializeLight();
      }
      this._light.radius = radius;
      this.onLightChange();
    };
    gameCharacterBase.lightColor = function () {
      return this._light?.color || defaultLightColor();
    };
    gameCharacterBase.setLightColor = function (color) {
      if (!this._light) {
        this.initializeLight();
      }
      this._light.color = color;
      this.onLightChange();
    };
    gameCharacterBase.onLightChange = function () {};
  }
  Game_CharacterBase_DarkMapMixIn(Game_CharacterBase.prototype);
  function Game_Event_DarkMapMixIn(gameEvent) {
    const _initialize = gameEvent.initialize;
    gameEvent.initialize = function (mapId, eventId) {
      _initialize.call(this, mapId, eventId);
      this.initializeLight();
    };
    gameEvent.initializeLight = function () {
      const savedLight = $gameSystem.fetchEventLight(this._mapId, this.eventId());
      this._light = savedLight || {
        isOn: !!this.event()?.meta.light,
        radius: Number(this.event()?.meta.lightRadius || defaultLightRadius()),
        color: String(this.event()?.meta.lightColor || defaultLightColor()),
      };
    };
    gameEvent.onLightChange = function () {
      if (this.mustSaveLight()) {
        $gameSystem.storeEventLight(this._mapId, this.eventId(), this._light);
      }
    };
    gameEvent.mustSaveLight = function () {
      return !!this.event()?.meta.saveLight;
    };
  }
  Game_Event_DarkMapMixIn(Game_Event.prototype);
  function Game_System_DarkMapMixIn(gameSystem) {
    gameSystem.eventLights = function () {
      if (!this._eventLights) {
        this._eventLights = {};
      }
      return this._eventLights;
    };
    gameSystem.eventLightKey = function (mapId, eventId) {
      return `${mapId}_${eventId}`;
    };
    gameSystem.storeEventLight = function (mapId, eventId, light) {
      const key = this.eventLightKey(mapId, eventId);
      this.eventLights()[key] = light;
    };
    gameSystem.fetchEventLight = function (mapId, eventId) {
      return this.eventLights()[this.eventLightKey(mapId, eventId)];
    };
  }
  Game_System_DarkMapMixIn(Game_System.prototype);
  function Game_Player_DarkMapMixIn(gamePlayer) {
    const _initMembers = gamePlayer.initMembers;
    gamePlayer.initMembers = function () {
      _initMembers.call(this);
      this.turnOnLight();
    };
    gamePlayer.lightRadius = function () {
      return settings.lightRadiusPlayer < 0 ? defaultLightRadius() : settings.lightRadiusPlayer;
    };
  }
  Game_Player_DarkMapMixIn(Game_Player.prototype);
  function Spriteset_Map_DarkMapMixIn(spritesetMap) {
    const _createLowerLayer = spritesetMap.createLowerLayer;
    spritesetMap.createLowerLayer = function () {
      _createLowerLayer.call(this);
      this.createDarknessLayer();
    };
    spritesetMap.createDarknessLayer = function () {
      this._darknessLayer = new DarknessLayer();
      this.addChild(this._darknessLayer);
    };
  }
  Spriteset_Map_DarkMapMixIn(Spriteset_Map.prototype);
  class DarknessLayer extends PIXI.Container {
    constructor() {
      super();
      this._width = Graphics.width;
      this._height = Graphics.height;
      this._bitmap = new Bitmap(this._width, this._height);
      this.createSprite();
    }
    createSprite() {
      const sprite = new Sprite(null);
      sprite.bitmap = this._bitmap;
      sprite.opacity = 255;
      sprite.blendMode = 2;
      sprite.x = 0;
      sprite.y = 0;
      this.addChild(sprite);
    }
    update() {
      if ($gameMap.isDark()) {
        this._bitmap.fillRect(0, 0, this._width, this._height, darkColor());
        if ($gamePlayer.isLightOn()) {
          this._bitmap.fillGradientCircle(
            $gamePlayer.screenX(),
            $gamePlayer.screenY(),
            $gamePlayer.lightRadius(),
            $gamePlayer.lightColor(),
          );
        }
        $gameMap.lightEvents().forEach((event) => {
          this._bitmap.fillGradientCircle(event.screenX(), event.screenY(), event.lightRadius(), event.lightColor());
        });
      }
    }
  }
})();
