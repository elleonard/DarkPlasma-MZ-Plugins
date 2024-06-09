// DarkPlasma_StepImageAndSound 1.0.2
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/06/09 1.0.2 イベントテストでエラーが出る不具合を修正
 * 2023/10/30 1.0.1 1フレームだけ意図しない位置に足跡がちらつく不具合を修正
 * 2022/09/23 1.0.0 公開
 */

/*:
 * @plugindesc 足跡画像を表示し、足音SEを再生する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param cellWidth
 * @text 足跡セル横幅
 * @type number
 * @default 48
 *
 * @param animationSpeed
 * @text 足跡再生スピード
 * @type number
 * @default 8
 *
 * @param stepOffset
 * @desc 設定した値の半分ずつ、足跡画像がマップマスの中心からズレて表示されます。
 * @text 中心からのズレ
 * @type number
 * @default 8
 *
 * @param audioDistance
 * @desc プレイヤー以外の足音が聞こえる距離を設定します。
 * @text 足音距離
 * @type number
 * @default 10
 *
 * @param excludeEventTag
 * @desc このメモタグのうちいずれか1つ以上が設定されたイベントは、足跡を表示せず足音も再生しません。
 * @text 除外イベントタグ
 * @type string[]
 * @default []
 *
 * @noteParam ステップエフェクト0
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト1
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト2
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト3
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト4
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト5
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト6
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップエフェクト7
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド0
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド1
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド2
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド3
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド4
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド5
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド6
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam ステップサウンド7
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect0
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect1
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect2
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect3
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect4
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect5
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect6
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepEffect7
 * @noteDir img/systems/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound0
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound1
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound2
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound3
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound4
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound5
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound6
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @noteParam StepSound7
 * @noteDir audio/se/
 * @noteType file
 * @noteData tilesets
 *
 * @help
 * version: 1.0.2
 * タイルセットの設定に応じて、足跡画像を表示したり、足音SEを再生します。
 *
 * タイルセットに対して、メモ欄に地形タグごとに足跡画像と足音SEの設定を行います。
 *
 * 設定例:
 * <ステップエフェクト1:Footprint>
 * <ステップエフェクト設定1:0,12,fitAngle,fitStep,animeSpeed16>
 * <ステップサウンド1:sand>
 * <ステップサウンド設定1:30-50,130>
 *
 * タイルセットのメモタグ設定は、YanaさんのStepEffect.jsと互換性があります。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    cellWidth: Number(pluginParameters.cellWidth || 48),
    animationSpeed: Number(pluginParameters.animationSpeed || 8),
    stepOffset: Number(pluginParameters.stepOffset || 8),
    audioDistance: Number(pluginParameters.audioDistance || 10),
    excludeEventTag: JSON.parse(pluginParameters.excludeEventTag || '[]').map((e) => {
      return String(e || ``);
    }),
  };

  class StepImageRequest {
    constructor(setting, x, y, character) {
      this.setting = setting;
      this.x = x;
      this.y = y;
      this.dir = character.direction();
      this.character = character;
    }
  }
  class StepImageSetting {
    constructor(filename, meta) {
      this._filename = filename;
      const settingList = meta.split(',').map((s) => s.trim());
      this._offsetX = Number(settingList[0]);
      this._offsetY = Number(settingList[1]);
      this._scale = Number(
        settingList.find((setting) => /^(\d+)[%％]$/.test(setting))?.match(/^(\d+)[%％]$/)[1] || 100,
      );
      this._fitAngle = settingList.some((setting) => /^fitAngle$/.test(setting));
      this._fitStep = settingList.some((setting) => /^fitStep$/.test(setting));
      this._dry = settingList.some((setting) => /^dry$/.test(setting));
      this._wet = Number(settingList.find((setting) => /^wet(\d+)$/.test(setting))?.match(/^wet(\d+)$/)[1] || -1);
      this._speed = Number(
        settingList.find((setting) => /^animeSpeed(\d+)$/.test(setting))?.match(/^animeSpeed(\d+)$/)[1] ||
          settings.animationSpeed,
      );
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
    constructor(filename, meta) {
      this._filename = filename;
      const settingList = meta.split(',').map((s) => s.trim());
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
      return this._minVolume === this._maxVolume
        ? this._minVolume
        : Math.randomInt(this._maxVolume - this._minVolume) + this._minVolume;
    }
    get pitch() {
      return this._minPitch === this._maxPitch
        ? this._minPitch
        : Math.randomInt(this._maxPitch - this._minPitch) + this._minPitch;
    }
  }
  function DataManager_StepImageAndSoundMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (isTileset(data)) {
        data.stepImageSetting = [];
        data.stepSoundSetting = [];
        [...Array(7).keys()]
          .filter((terrainTag) => data.meta[`ステップエフェクト${terrainTag}`] || data.meta[`StepEffect${terrainTag}`])
          .forEach((terrainTag) => {
            data.stepImageSetting[terrainTag] = new StepImageSetting(
              String(data.meta[`ステップエフェクト${terrainTag}`] || data.meta[`StepEffect${terrainTag}`]),
              String(data.meta[`ステップエフェクト設定${terrainTag}`] || data.meta[`StepEffectSetting${terrainTag}`]),
            );
          });
        [...Array(7).keys()]
          .filter((terrainTag) => data.meta[`ステップサウンド${terrainTag}`] || data.meta[`StepSound${terrainTag}`])
          .forEach((terrainTag) => {
            data.stepSoundSetting[terrainTag] = new StepSoundSetting(
              String(data.meta[`ステップサウンド${terrainTag}`] || data.meta[`StepSound${terrainTag}`]),
              String(data.meta[`ステップサウンド設定${terrainTag}`] || data.meta[`StepSoundSetting${terrainTag}`]),
            );
          });
      }
    };
    function isTileset(data) {
      return data && $dataTilesets && $dataTilesets.includes(data);
    }
  }
  DataManager_StepImageAndSoundMixIn(DataManager);
  function Game_Temp_StepImageMixIn(gameTemp) {
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
  function Game_CharacterBase_StepImageAndSoundMixIn(gameCharacterBase) {
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
        const stepImageSettingOnMap = $gameMap.tileset()?.stepImageSetting[tag];
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
          const stepImageSetting = $gameMap.tileset().stepImageSetting[stepSettingTag];
          if (stepImageSetting) {
            $gameTemp.requestStepImage(new StepImageRequest(stepImageSetting, this._realX, this._realY, this));
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
    gameCharacterBase.stepSpeed = function () {
      return this.realMoveSpeed() === 6 ? 4 : 8;
    };
    gameCharacterBase.StepSeVolumeRate = function () {
      return Math.max(
        1.0 - $gameMap.distance(this.x, this.y, $gamePlayer.x, $gamePlayer.y) / settings.audioDistance,
        0,
      );
    };
  }
  Game_CharacterBase_StepImageAndSoundMixIn(Game_CharacterBase.prototype);
  function Game_Vehicle_StepImageAndSoundMixIn(gameVehicle) {
    gameVehicle.isStepImageAndSoundEnabled = function () {
      return false;
    };
  }
  Game_Vehicle_StepImageAndSoundMixIn(Game_Vehicle.prototype);
  function Game_Player_StepImageAndSoundMixIn(gamePlayer) {
    gamePlayer.isStepImageAndSoundEnabled = function () {
      return !this.isInVehicle();
    };
  }
  Game_Player_StepImageAndSoundMixIn(Game_Player.prototype);
  function Game_Follower_StepImageAndSoundMixIn(gameFollower) {
    gameFollower.isStepImageAndSoundEnabled = function () {
      return this.isVisible();
    };
  }
  Game_Follower_StepImageAndSoundMixIn(Game_Follower.prototype);
  function Game_Event_StepImageAndSoundMixIn(gameEvent) {
    gameEvent.isStepImageAndSoundEnabled = function () {
      return !settings.excludeEventTag.some((tag) => this.event().meta[tag]);
    };
  }
  Game_Event_StepImageAndSoundMixIn(Game_Event.prototype);
  class Sprite_StepAnimation extends Sprite {
    constructor(request) {
      super();
      this.initialize(request);
    }
    initialize(request) {
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
            this.rotation = (Math.PI * 270) / 180;
            break;
          case 6:
            this.rotation = (Math.PI * 90) / 180;
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
          return ((this._stepCount % 2) - 0.5) * settings.stepOffset;
        case 2:
          return (0.5 - (this._stepCount % 2)) * settings.stepOffset;
        default:
          return -settings.stepOffset / 2;
      }
    }
    fitStepOffsetY() {
      if (!this._fitStep) {
        return 0;
      }
      switch (this._dir) {
        case 6:
          return ((this._stepCount % 2) - 0.5) * settings.stepOffset;
        case 4:
          return (0.5 - (this._stepCount % 2)) * settings.stepOffset;
        default:
          return -settings.stepOffset / 2;
      }
    }
    canvasX() {
      const dx = this._defaultX < $gameMap.displayX() ? $gameMap.displayX() - $gameMap.width() : $gameMap.displayX();
      return (
        (this._defaultX - dx) * $gameMap.tileWidth() + settings.cellWidth / 2 + this._offsetX + this.fitStepOffsetX()
      );
    }
    canvasY() {
      const dy = this._defaultY < $gameMap.displayY() ? $gameMap.displayY() - $gameMap.height() : $gameMap.displayY();
      return (
        (this._defaultY - dy) * $gameMap.tileHeight() + settings.cellWidth / 2 + this._offsetY + this.fitStepOffsetY()
      );
    }
    updatePosition() {
      this.x = this.canvasX();
      this.y = this.canvasY();
    }
  }
  function Spriteset_Map_StepImageMixIn(spritesetMap) {
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
        .filter((sprite) => !sprite.isPlaying())
        .forEach((sprite) => this._stepContainer.removeChild(sprite));
      this._stepSprites = this._stepSprites.filter((sprite) => sprite.isPlaying());
      while ($gameTemp.isStepImageRequested()) {
        const request = $gameTemp.fetchRequestStepImage();
        const sprite = new Sprite_StepAnimation(request);
        this._stepContainer.addChild(sprite);
        this._stepSprites.push(sprite);
        request.character.increaseStepCount();
      }
    };
  }
  Spriteset_Map_StepImageMixIn(Spriteset_Map.prototype);
})();
