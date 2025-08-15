/// <reference path="./DarkMap.d.ts" />
import { isMapMetaDataAvailable } from '../../../common/mapMetaData';
import { settings } from '../config/_build/DarkPlasma_DarkMap_parameters';
import { command_turnOffLight, command_turnOnLight, parseArgs_turnOffLight, parseArgs_turnOnLight } from '../config/_build/DarkPlasma_DarkMap_commands';
import { pluginName } from '../../../common/pluginName';

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

function convertColor(color: {red: number, green: number, blue: number}): string {
return `#${((1 << 24) + (color.red << 16) + (color.green << 8) + color.blue)
    .toString(16)
    .slice(1)}`;
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

PluginManager.registerCommand(pluginName, command_turnOnLight, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_turnOnLight(args);

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
  target?.turnOnLight();
});

PluginManager.registerCommand(pluginName, command_turnOffLight, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_turnOffLight(args);

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

  target?.turnOffLight();
});

function Bitmap_DarkMapMixIn(bitmap: Bitmap) {
  bitmap.fillGradientCircle = function (this: Bitmap, centerX: number, centerY: number, radius: number, lightColor: string) {
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

function Game_Map_DarkMapMixIn(gameMap: Game_Map) {
  gameMap.isDark = function () {
    return isMapMetaDataAvailable() && !!$dataMap!.meta.dark;
  };

  gameMap.lightEvents = function (this: Game_Map) {
    return this.events().filter((event) => event.isLightOn());
  };
}

Game_Map_DarkMapMixIn(Game_Map.prototype);

function Game_CharacterBase_DarkMapMixIn(gameCharacterBase: Game_CharacterBase) {
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

function Game_Event_DarkMapMixIn(gameEvent: Game_Event) {
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
      $gameSystem.storeEventLight(this._mapId, this.eventId(), this._light)
    }
  };

  gameEvent.mustSaveLight = function () {
    return !!this.event()?.meta.saveLight;
  };
}

Game_Event_DarkMapMixIn(Game_Event.prototype);

function Game_System_DarkMapMixIn(gameSystem: Game_System) {
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

function Game_Player_DarkMapMixIn(gamePlayer: Game_Player) {
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
      if ($gamePlayer.isLightOn()) {
        this._bitmap.fillGradientCircle(
          $gamePlayer.screenX(),
          $gamePlayer.screenY(),
          $gamePlayer.lightRadius(),
          $gamePlayer.lightColor()
        );
      }
      $gameMap.lightEvents().forEach((event) => {
        this._bitmap.fillGradientCircle(
          event.screenX(),
          event.screenY(),
          event.lightRadius(),
          event.lightColor()
        );
      });
    }
  }
}
