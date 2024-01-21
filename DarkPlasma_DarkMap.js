// DarkPlasma_DarkMap 2.0.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @help
 * version: 2.0.0
 * 暗いマップと、プレイヤーやイベントの周囲を照らす明かりを提供します。
 *
 * マップのメモ欄:
 * <dark> 暗いマップにします。
 *
 * イベントのメモ欄:
 * <light> イベントの周囲を照らします。
 * <lightColor:#ffbb73> 明かりの色を設定します。
 * <lightRadius:155> 明かりの範囲を設定します。
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
  };

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
  function lightColor() {
    return `#${(
      (1 << 24) +
      (settings.lightColor.red << 16) +
      (settings.lightColor.green << 8) +
      settings.lightColor.blue
    )
      .toString(16)
      .slice(1)}`;
  }
  function defaultLightRadius() {
    if (settings.lightRadiusVariable) {
      return $gameVariables.value(settings.lightRadiusVariable);
    }
    return settings.lightRadius;
  }
  Bitmap.prototype.fillGradientCircle = function (centerX, centerY, radius, lightColor) {
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
  /**
   * @param {Game_Map.prototype} gameMap
   */
  function Game_Map_DarkMapMixIn(gameMap) {
    gameMap.isDark = function () {
      return isMapMetaDataAvailable() && !!$dataMap.meta.dark;
    };
    gameMap.lightEvents = function () {
      return this.events().filter((event) => event.hasLight());
    };
  }
  Game_Map_DarkMapMixIn(Game_Map.prototype);
  /**
   * @param {Game_Event.prototype} gameEvent
   */
  function Game_Event_DarKMapMixIn(gameEvent) {
    gameEvent.hasLight = function () {
      return this.event() && !!this.event().meta.light;
    };
    gameEvent.lightRadius = function () {
      if (!this.hasLight()) {
        return 0;
      }
      return this.event().meta.lightRadius ? Number(this.event().meta.lightRadius) : defaultLightRadius();
    };
    gameEvent.lightColor = function () {
      if (!this.hasLight()) {
        return null;
      }
      return String(this.event().meta.lightColor || lightColor());
    };
  }
  Game_Event_DarKMapMixIn(Game_Event.prototype);
  function Game_Player_DarkMapMixIn(gamePlayer) {
    gamePlayer.lightRadius = function () {
      return defaultLightRadius();
    };
  }
  Game_Player_DarkMapMixIn(Game_Player.prototype);
  /**
   * @param {Spriteset_Map.prototype} spritesetMap
   */
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
        this._bitmap.fillGradientCircle(
          $gamePlayer.screenX(),
          $gamePlayer.screenY(),
          $gamePlayer.lightRadius(),
          lightColor(),
        );
        $gameMap.lightEvents().forEach((event) => {
          this._bitmap.fillGradientCircle(event.screenX(), event.screenY(), event.lightRadius(), event.lightColor());
        });
      }
    }
  }
})();
