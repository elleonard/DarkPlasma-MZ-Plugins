/// <reference path="./DarkMap.d.ts" />
import { isMapMetaDataAvailable } from '../../../common/mapMetaData';
import { settings } from '../config/_build/DarkPlasma_DarkMap_parameters';

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
  return `#${((1 << 24) + (settings.lightColor.red << 16) + (settings.lightColor.green << 8) + settings.lightColor.blue)
    .toString(16)
    .slice(1)}`;
}

function defaultLightRadius() {
  if (settings.lightRadiusVariable) {
    return $gameVariables.value(settings.lightRadiusVariable);
  }
  return settings.lightRadius;
}

Bitmap.prototype.fillGradientCircle = function (this: Bitmap, centerX: number, centerY: number, radius: number, lightColor: string) {
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
function Game_Map_DarkMapMixIn(gameMap: Game_Map) {
  gameMap.isDark = function () {
    return isMapMetaDataAvailable() && !!$dataMap!.meta.dark;
  };

  gameMap.lightEvents = function (this: Game_Map) {
    return this.events().filter((event) => event.hasLight());
  };
}

Game_Map_DarkMapMixIn(Game_Map.prototype);

/**
 * @param {Game_Event.prototype} gameEvent
 */
function Game_Event_DarKMapMixIn(gameEvent: Game_Event) {
  gameEvent.hasLight = function (this: Game_Event) {
    return this.event() && !!this.event().meta.light;
  };

  gameEvent.lightRadius = function (this: Game_Event) {
    if (!this.hasLight()) {
      return 0;
    }
    return this.event().meta.lightRadius ? Number(this.event().meta.lightRadius) : defaultLightRadius();
  };

  gameEvent.lightColor = function (this: Game_Event) {
    if (!this.hasLight()) {
      return null;
    }
    return String(this.event().meta.lightColor || lightColor());
  };
}

Game_Event_DarKMapMixIn(Game_Event.prototype);

function Game_Player_DarkMapMixIn(gamePlayer: Game_Player) {
  gamePlayer.lightRadius = function () {
    return settings.lightRadiusPlayer < 0 ? defaultLightRadius() : settings.lightRadiusPlayer;
  };
}

Game_Player_DarkMapMixIn(Game_Player.prototype);

/**
 * @param {Spriteset_Map.prototype} spritesetMap
 */
function Spriteset_Map_DarkMapMixIn(spritesetMap: Spriteset_Map) {
  const _createLowerLayer = spritesetMap.createLowerLayer;
  spritesetMap.createLowerLayer = function (this: Spriteset_Map) {
    _createLowerLayer.call(this);
    this.createDarknessLayer();
  };

  spritesetMap.createDarknessLayer = function (this: Spriteset_Map) {
    this._darknessLayer = new DarknessLayer();
    this.addChild(this._darknessLayer);
  };
}

Spriteset_Map_DarkMapMixIn(Spriteset_Map.prototype);

class DarknessLayer extends PIXI.Container {
  _width: number;
  _height: number;
  _bitmap: Bitmap;

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
      this._bitmap.fillGradientCircle($gamePlayer.screenX(), $gamePlayer.screenY(), $gamePlayer.lightRadius(), lightColor());
      $gameMap.lightEvents().forEach((event) => {
        this._bitmap.fillGradientCircle(event.screenX(), event.screenY(), event.lightRadius(), event.lightColor()!);
      });
    }
  }
}
