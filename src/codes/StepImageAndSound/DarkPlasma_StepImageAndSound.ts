/// <reference path="./StepImageAndSound.d.ts" />

import { settings } from "./_build/DarkPlasma_StepImageAndSound_parameters";

class StepImageRequest {
  setting: StepImageSetting;
  x: number;
  y: number;
  dir: number;
  character: Game_CharacterBase;

  constructor(setting: StepImageSetting, x: number, y: number, character: Game_CharacterBase) {
    this.setting = setting;
    this.x = x;
    this.y = y;
    this.dir = character.direction();
    this.character = character;
  }
}

class StepImageSetting {
  _filename: string;
  _offsetX: number;
  _offsetY: number;
  _scale: number;
  _fitAngle: boolean;
  _fitStep: boolean;
  _dry: boolean;
  _wet: number;
  _speed: number;

  constructor(filename: string, meta: string) {
    this._filename = filename;
    const settingList = meta.split(',').map(s => s.trim());
    this._offsetX = Number(settingList[0]);
    this._offsetY = Number(settingList[1]);
    this._scale = Number(settingList.find(setting => /^(\d+)[%％]$/.test(setting))?.match(/^(\d+)[%％]$/)![1] || 100);
    this._fitAngle = settingList.some(setting => /^fitAngle$/.test(setting));
    this._fitStep = settingList.some(setting => /^fitStep$/.test(setting));
    this._dry = settingList.some(setting => /^dry$/.test(setting));
    this._wet = Number(settingList.find(setting => /^wet(\d+)$/.test(setting))?.match(/^wet(\d+)$/)![1] || -1);
    this._speed = Number(settingList.find(setting => /^animeSpeed(\d+)$/.test(setting))?.match(/^animeSpeed(\d+)$/)![1] || settings.animationSpeed);
  }

  get filename() {
    return this._filename;
  }

  get offsetX() {
    return this._offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  get scale() {
    return this._scale / 100;
  }

  get fitAngle() {
    return this._fitAngle;
  }

  get fitStep() {
    return this._fitStep;
  }

  get speed() {
    return this._speed;
  }

  get isDry() {
    return this._dry;
  }

  get isWet() {
    return this._wet >= 0;
  }

  get wet() {
    return this._wet;
  }
}

class StepSoundSetting {
  _filename: string;
  _minVolume: number;
  _maxVolume: number;
  _minPitch: number;
  _maxPitch: number;

  constructor(filename: string, meta: string) {
    this._filename = filename;
    const settingList = meta.split(',').map(s => s.trim());
    if (settingList[0].includes('-')) {
      this._minVolume = Number(settingList[0].split('-')[0]);
      this._maxVolume = Number(settingList[0].split('-')[1]);
    } else {
      this._minVolume = Number(settingList[0]);
      this._maxVolume = Number(settingList[0]);
    }
    if (settingList[1].includes('-')) {
      this._minPitch = Number(settingList[1].split('-')[0]);
      this._maxPitch = Number(settingList[1].split('-')[1]);
    } else {
      this._minPitch = Number(settingList[1]);
      this._maxPitch = Number(settingList[1]);
    }
  }

  get filename() {
    return this._filename;
  }

  get volume() {
    return this._minVolume === this._maxVolume ? this._minVolume : Math.randomInt(this._maxVolume - this._minVolume) + this._minVolume;
  }

  get pitch() {
    return this._minPitch === this._maxPitch ? this._minPitch : Math.randomInt(this._maxPitch - this._minPitch) + this._minPitch;
  }
}

function DataManager_StepImageAndSoundMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (isTileset(data)) {
      data.stepImageSetting = [];
      data.stepSoundSetting = [];
      [...Array(7).keys()]
        .filter(terrainTag => data.meta[`ステップエフェクト${terrainTag}`] || data.meta[`StepEffect${terrainTag}`])
        .forEach(terrainTag => {
          data.stepImageSetting[terrainTag] = new StepImageSetting(
            String(data.meta[`ステップエフェクト${terrainTag}`] || data.meta[`StepEffect${terrainTag}`]),
            String(data.meta[`ステップエフェクト設定${terrainTag}`] || data.meta[`StepEffectSetting${terrainTag}`])
          );
        });
      [...Array(7).keys()]
        .filter(terrainTag => data.meta[`ステップサウンド${terrainTag}`] || data.meta[`StepSound${terrainTag}`])
        .forEach(terrainTag => {
          data.stepSoundSetting[terrainTag] = new StepSoundSetting(
            String(data.meta[`ステップサウンド${terrainTag}`] || data.meta[`StepSound${terrainTag}`]),
            String(data.meta[`ステップサウンド設定${terrainTag}`] || data.meta[`StepSoundSetting${terrainTag}`])
          );
        });
    }
  };

  function isTileset(data: DataManager.NoteHolder): data is MZ.Tileset {
    return data && $dataTilesets && $dataTilesets.includes(data as MZ.Tileset);
  }
}

DataManager_StepImageAndSoundMixIn(DataManager);

function Game_Temp_StepImageMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._stepImageRequests = [];
  };

  gameTemp.requestStepImage = function (request) {
    this._stepImageRequests.push(request);
  };

  gameTemp.fetchRequestStepImage = function () {
    return this._stepImageRequests.shift();
  };

  gameTemp.isStepImageRequested = function () {
    return this._stepImageRequests.length > 0;
  };
}

Game_Temp_StepImageMixIn(Game_Temp.prototype);

function Game_CharacterBase_StepImageAndSoundMixIn(gameCharacterBase: Game_CharacterBase) {
  gameCharacterBase.setStepWet = function (wet) {
    this._wet = wet;
    this._wetStepCount = this._stepCount;
  };

  gameCharacterBase.clearStepWet = function () {
    this._wet = -1;
    this._wetStepCount = 0;
  };

  gameCharacterBase.isWetStep = function () {
    return this._wet !== undefined && this._wet >= 0;
  };

  gameCharacterBase.stepCount = function () {
    return this._stepCount || 0;
  };

  gameCharacterBase.increaseStepCount = function () {
    this._stepCount = this.stepCount() + 1;
  };

  gameCharacterBase.isStepImageAndSoundEnabled = function () {
    return true;
  };

  const _updateMove = gameCharacterBase.updateMove;
  gameCharacterBase.updateMove = function () {
    _updateMove.call(this);
    if (!this.isStepImageAndSoundEnabled()) {
      return;
    }
    if (this._moveCount === undefined) {
      this._moveCount = 0;
    }
    this._moveCount++;
    if (this._moveCount % this.stepSpeed() === 0) {
      const tag = this.terrainTag();
      const stepImageSettingOnMap = $gameMap.tileset().stepImageSetting[tag];

      if (stepImageSettingOnMap) {
        const stepSettingTag = stepImageSettingOnMap.isDry && this.isWetStep() ? this._wet : tag;
        const stepSoundSetting = $gameMap.tileset().stepSoundSetting[stepSettingTag];
        const stepSoundFrequency = this.realMoveSpeed() === 6 ? 0.5 : 6 - this.realMoveSpeed();
        const mustPlaySe = this._moveCount % (this.stepSpeed() * stepSoundFrequency) === 0;
        if (stepSoundSetting && mustPlaySe) {
          const pan = (() => {
            if (this.x < $gamePlayer.x) {
              return -100;
            } else if (this.x > $gamePlayer.x) {
              return 100;
            }
            return 0;
          })();
          AudioManager.playSe({
            name: stepSoundSetting.filename,
            pitch: stepSoundSetting.pitch,
            volume: stepSoundSetting.volume * this.StepSeVolumeRate(),
            pan: pan,
          });
        }
        const stepImageSetting: StepImageSetting = $gameMap.tileset().stepImageSetting[stepSettingTag];
        if (stepImageSetting) {
          $gameTemp.requestStepImage(new StepImageRequest(
            stepImageSetting,
            this._realX,
            this._realY,
            this
          ));
        }
        if (stepImageSettingOnMap.isWet) {
          this.setStepWet(stepImageSettingOnMap.wet);
        }
      }
      /**
       * 湿っていないセルを11歩歩いたら乾く
       */
      if (this.isWetStep() && this._stepCount > this._wetStepCount + 10) {
        this.clearStepWet();
      }
    }
  };

  /**
   * このフレーム数に一度だけ足跡画像の処理を行う
   * @return {number}
   */
  gameCharacterBase.stepSpeed = function (): number {
    return this.realMoveSpeed() === 6 ? 4 : 8;
  };

  gameCharacterBase.StepSeVolumeRate = function () {
    return Math.max(1.0 - $gameMap.distance(this.x, this.y, $gamePlayer.x, $gamePlayer.y) / settings.audioDistance, 0);
  };
}

Game_CharacterBase_StepImageAndSoundMixIn(Game_CharacterBase.prototype);

function Game_Vehicle_StepImageAndSoundMixIn(gameVehicle: Game_Vehicle) {
  gameVehicle.isStepImageAndSoundEnabled = function () {
    return false;
  };
}

Game_Vehicle_StepImageAndSoundMixIn(Game_Vehicle.prototype);

function Game_Player_StepImageAndSoundMixIn(gamePlayer: Game_Player) {
  gamePlayer.isStepImageAndSoundEnabled = function () {
    return !this.isInVehicle();
  };
}

Game_Player_StepImageAndSoundMixIn(Game_Player.prototype);

function Game_Follower_StepImageAndSoundMixIn(gameFollower: Game_Follower) {
  gameFollower.isStepImageAndSoundEnabled = function () {
    return this.isVisible();
  };
}

Game_Follower_StepImageAndSoundMixIn(Game_Follower.prototype);

function Game_Event_StepImageAndSoundMixIn(gameEvent: Game_Event) {
  gameEvent.isStepImageAndSoundEnabled = function () {
    return !settings.excludeEventTag.some((tag: string) => this.event().meta[tag]);
  };
}

Game_Event_StepImageAndSoundMixIn(Game_Event.prototype);

class Sprite_StepAnimation extends Sprite {
  _animationFrame: number;
  _animationSpeed: number;
  _defaultX: number;
  _defaultY: number;
  _offsetX: number;
  _offsetY: number;
  _dir: number;

  _stepCount: number;
  _fitStep: boolean;

  constructor(request: StepImageRequest) {
    super();
    this.initialize(request);
  }

  initialize(request: StepImageRequest) {
    if (!request) {
      return;
    }
    super.initialize(ImageManager.loadSystem(request.setting.filename));
    this.scale.x = request.setting.scale;
    this.scale.y = request.setting.scale;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this._stepCount = request.character.stepCount();

    if (request.setting.fitAngle) {
      switch (request.dir) {
        case 2:
          this.rotation = Math.PI;
          break;
        case 4:
          this.rotation = Math.PI * 270 / 180;
          break;
        case 6:
          this.rotation = Math.PI * 90 / 180;
          break;
      }
      /**
       * 奇数歩の足跡は反転する
       */
      if (this._stepCount % 2 === 1) {
        this.scale.x *= -1;
      }
    }
    this._animationFrame = 0;
    this._animationSpeed = request.setting.speed;

    this._dir = request.dir;

    this._defaultX = request.x;
    this._defaultY = request.y;
    this._offsetX = request.setting.offsetX;
    this._offsetY = request.setting.offsetY;

    this._fitStep = request.setting.fitStep;

    /**
     * 最初の1フレーム
     */
    this.updateFrame();
    this.updatePosition();
  }

  isPlaying() {
    return this._animationFrame < this.maxAnimationFrame();
  }

  maxAnimationFrame() {
    return this.bitmap ? Math.floor(this.bitmap.width / settings.cellWidth) * this._animationSpeed : 0;
  }

  update() {
    super.update();
    if (!this.isPlaying() || !this.bitmap || !this.bitmap.isReady()) {
      return;
    }
    this.updateFrame();
    this.updatePosition();
  }

  updateFrame() {
    if (!this.isPlaying() || !this.bitmap || !this.bitmap.isReady()) {
      return;
    }
    const frame = Math.floor(this._animationFrame / this._animationSpeed);
    this.setFrame(settings.cellWidth * frame, 0, settings.cellWidth, this.bitmap.height);
    this._animationFrame++;
  }

  fitStepOffsetX() {
    if (!this._fitStep) {
      return 0;
    }
    switch (this._dir) {
      case 8:
        return (this._stepCount % 2 - 0.5) * settings.stepOffset;
      case 2:
        return (0.5 - this._stepCount % 2) * settings.stepOffset;
      default:
        return -settings.stepOffset/2;
    }
  }

  fitStepOffsetY() {
    if (!this._fitStep) {
      return 0;
    }
    switch (this._dir) {
      case 6:
        return (this._stepCount % 2 - 0.5) * settings.stepOffset;
      case 4:
        return (0.5 - this._stepCount % 2) * settings.stepOffset;
      default:
        return -settings.stepOffset/2;
    }
  }

  canvasX() {
    const dx = this._defaultX < $gameMap.displayX() ? $gameMap.displayX() - $gameMap.width() : $gameMap.displayX();
    return (this._defaultX - dx) * $gameMap.tileWidth() + settings.cellWidth / 2 + this._offsetX + this.fitStepOffsetX();
  }

  canvasY() {
    const dy = this._defaultY < $gameMap.displayY() ? $gameMap.displayY() - $gameMap.height() : $gameMap.displayY();
    return (this._defaultY - dy) * $gameMap.tileHeight() + settings.cellWidth / 2 + this._offsetY + this.fitStepOffsetY();
  }

  updatePosition() {
    this.x = this.canvasX();
    this.y = this.canvasY();
  }
}

function Spriteset_Map_StepImageMixIn(spritesetMap: Spriteset_Map) {
  const _createTilemap = spritesetMap.createTilemap;
  spritesetMap.createTilemap = function () {
    _createTilemap.call(this);
    this.createStepContainer();
  };

  spritesetMap.createStepContainer = function () {
    this._stepContainer = new Sprite();
    this._stepContainer.setFrame(0, 0, this.width, this.height);
    this._stepContainer.z = 2;
    this._tilemap.addChild(this._stepContainer);
    this._stepSprites = [];
  };

  const _update = spritesetMap.update;
  spritesetMap.update = function () {
    _update.call(this);
    this.updateStepSprites();
  };

  spritesetMap.updateStepSprites = function () {
    this._stepSprites
      .filter(sprite => !sprite.isPlaying())
      .forEach(sprite => this._stepContainer.removeChild(sprite));
    this._stepSprites = this._stepSprites.filter(sprite => sprite.isPlaying());

    while ($gameTemp.isStepImageRequested()) {
      const request = $gameTemp.fetchRequestStepImage()
      const sprite = new Sprite_StepAnimation(request);
      this._stepContainer.addChild(sprite);
      this._stepSprites.push(sprite);
      request.character.increaseStepCount();
    }
  };
}

Spriteset_Map_StepImageMixIn(Spriteset_Map.prototype);
