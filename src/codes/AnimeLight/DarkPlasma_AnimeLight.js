import { pluginName } from '../../common/pluginName';
import { command_markAsLight, parseArgs_markAsLight } from './_build/DarkPlasma_AnimeLight_commands';
import { settings } from './_build/DarkPlasma_AnimeLight_parameters';

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
