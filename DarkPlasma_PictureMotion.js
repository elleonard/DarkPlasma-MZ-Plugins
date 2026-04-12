// DarkPlasma_PictureMotion 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/04/13 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc ピクチャの複雑な移動
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command slide
 * @text スライド
 * @desc ピクチャをスライド移動します。
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 0
 * @arg direction
 * @desc スライド移動する方向を指定します。
 * @text 方向
 * @type select
 * @option 下
 * @value 2
 * @option 左
 * @value 4
 * @option 右
 * @value 6
 * @option 上
 * @value 8
 * @default 2
 * @arg distance
 * @desc スライド移動する距離を指定します。
 * @text 距離
 * @type number
 * @default 0
 * @arg easingType
 * @desc スライド移動のイージングタイプを設定します。
 * @text イージングタイプ
 * @type select
 * @option 一定速度
 * @value 0
 * @option ゆっくり始まる
 * @value 1
 * @option ゆっくり終わる
 * @value 2
 * @option ゆっくり始まってゆっくり終わる
 * @value 3
 * @default 0
 * @arg duration
 * @text フレーム数
 * @type number
 * @min 1
 * @default 0
 * @arg wait
 * @text 完了までウェイト
 * @type boolean
 * @default false
 *
 * @command shake
 * @text 震える
 * @desc ピクチャが震えます。
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 0
 * @arg power
 * @text 強さ
 * @type number
 * @min 1
 * @default 1
 * @arg speed
 * @text 速さ
 * @type number
 * @min 1
 * @default 1
 * @arg duration
 * @text フレーム数
 * @type number
 * @min 1
 * @default 0
 * @arg wait
 * @text 完了までウェイト
 * @type boolean
 * @default false
 *
 * @command hopping
 * @text 跳ねる
 * @desc ピクチャが跳ねます。
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 0
 * @arg count
 * @text 回数
 * @type number
 * @min 1
 * @default 3
 * @arg height
 * @text 高さ
 * @type number
 * @min 1
 * @default 200
 * @arg speed
 * @text 速さ
 * @type number
 * @min 1
 * @default 10
 * @arg damping
 * @text 高さ減衰率
 * @type number
 * @decimals 1
 * @max 1
 * @default 0
 * @arg wait
 * @text 完了までウェイト
 * @type boolean
 * @default false
 *
 * @command flicker
 * @text 点滅する
 * @desc ピクチャが点滅します。
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 0
 * @arg count
 * @text 回数
 * @type number
 * @min 1
 * @default 3
 * @arg interval
 * @text インターバル
 * @type number
 * @min 1
 * @default 10
 * @arg wait
 * @text 完了までウェイト
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.0.0
 * ピクチャの複雑な移動を実現します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_slide(args) {
    return {
      pictureId: Number(args.pictureId || 0),
      direction: Number(args.direction || 2),
      distance: Number(args.distance || 0),
      easingType: Number(args.easingType || 0),
      duration: Number(args.duration || 0),
      wait: String(args.wait || false) === 'true',
    };
  }

  function parseArgs_shake(args) {
    return {
      pictureId: Number(args.pictureId || 0),
      power: Number(args.power || 1),
      speed: Number(args.speed || 1),
      duration: Number(args.duration || 0),
      wait: String(args.wait || false) === 'true',
    };
  }

  function parseArgs_hopping(args) {
    return {
      pictureId: Number(args.pictureId || 0),
      count: Number(args.count || 3),
      height: Number(args.height || 200),
      speed: Number(args.speed || 10),
      damping: Number(args.damping || 0),
      wait: String(args.wait || false) === 'true',
    };
  }

  function parseArgs_flicker(args) {
    return {
      pictureId: Number(args.pictureId || 0),
      count: Number(args.count || 3),
      interval: Number(args.interval || 10),
      wait: String(args.wait || false) === 'true',
    };
  }

  const command_slide = 'slide';

  const command_shake = 'shake';

  const command_hopping = 'hopping';

  const command_flicker = 'flicker';

  const WAIT_MODE_PICTURE_MOTION = 'pictureMotion';
  PluginManager.registerCommand(pluginName, command_slide, function (args) {
    const parsedArgs = parseArgs_slide(args);
    if ([0, 1, 2, 3].includes(parsedArgs.easingType)) {
      $gameScreen.slidePicture(
        parsedArgs.pictureId,
        parsedArgs.direction,
        parsedArgs.distance,
        parsedArgs.easingType,
        parsedArgs.duration,
      );
      if (parsedArgs.wait) {
        this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
      }
    }
  });
  PluginManager.registerCommand(pluginName, command_shake, function (args) {
    const parsedArgs = parseArgs_shake(args);
    $gameScreen.shakePicture(parsedArgs.pictureId, parsedArgs.power, parsedArgs.speed, parsedArgs.duration);
    if (parsedArgs.wait) {
      this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
    }
  });
  PluginManager.registerCommand(pluginName, command_hopping, function (args) {
    const parsedArgs = parseArgs_hopping(args);
    $gameScreen.hoppingPicture(
      parsedArgs.pictureId,
      parsedArgs.count,
      parsedArgs.speed,
      parsedArgs.height,
      parsedArgs.damping,
    );
    if (parsedArgs.wait) {
      this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
    }
  });
  PluginManager.registerCommand(pluginName, command_flicker, function (args) {
    const parsedArgs = parseArgs_flicker(args);
    $gameScreen.flickerPicture(parsedArgs.pictureId, parsedArgs.count, parsedArgs.interval);
    if (parsedArgs.wait) {
      this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
    }
  });
  class Easing {
    static easeIn(t, exponent) {
      return Math.pow(t, exponent);
    }
    static easeOut(t, exponent) {
      return 1 - Math.pow(1 - t, exponent);
    }
    static easeInOut(t, exponent) {
      return t < 0.5 ? this.easeIn(t * 2, exponent) / 2 : this.easeOut(t * 2 - 1, exponent) / 2 + 0.5;
    }
  }
  class Game_PictureMotion {
    isMoving() {
      return false;
    }
    update() {}
    x() {
      return 0;
    }
    y() {
      return 0;
    }
    opacityRate() {
      return 1;
    }
  }
  class Game_PictureSlide extends Game_PictureMotion {
    constructor(_distanceX, _distanceY, _easingType, _duration) {
      super();
      this._distanceX = _distanceX;
      this._distanceY = _distanceY;
      this._easingType = _easingType;
      this._duration = _duration;
      this._currentOffsetX = 0;
      this._currentOffsetY = 0;
      this._wholeDuration = _duration;
    }
    isMoving() {
      return this._duration > 0;
    }
    x() {
      return this._currentOffsetX;
    }
    y() {
      return this._currentOffsetY;
    }
    update() {
      if (this._duration > 0) {
        this._currentOffsetX = this.applyEasing(this._currentOffsetX, this._distanceX);
        this._currentOffsetY = this.applyEasing(this._currentOffsetY, this._distanceY);
        this._duration--;
      }
    }
    applyEasing(current, target) {
      const d = this._duration;
      const wd = this._wholeDuration;
      const lt = this.calcEasing((wd - d) / wd);
      const t = this.calcEasing((wd - d + 1) / wd);
      const start = (current - target * lt) / (1 - lt);
      return start + (target - start) * t;
    }
    calcEasing(t) {
      switch (this._easingType) {
        case 1:
          return Easing.easeIn(t, 2);
        case 2:
          return Easing.easeOut(t, 2);
        case 3:
          return Easing.easeInOut(t, 2);
        default:
          return t;
      }
    }
  }
  class Game_PictureShake extends Game_PictureMotion {
    /**
     * @param _power 強さ
     * @param _speed 速さ
     * @param _duration 時間
     */
    constructor(_power, _speed, _duration) {
      super();
      this._power = _power;
      this._speed = _speed;
      this._duration = _duration;
      this._shake = 0;
      this._direction = 1;
    }
    isMoving() {
      return this._duration > 0;
    }
    update() {
      if (this._duration > 0) {
        const delta = (this._power * this._speed * this._direction) / 10;
        if (this._duration <= 1 && this._shake * (this._shake + delta) < 0) {
          this._shake = 0;
        } else {
          this._shake += delta;
        }
        if (this._shake > this._power * 2) {
          this._direction = -1;
        } else if (this._shake < -this._power * 2) {
          this._direction = 1;
        }
        this._duration--;
      }
    }
    x() {
      return this._shake;
    }
  }
  class Game_PictureHopping extends Game_PictureMotion {
    /**
     * @param _count 跳ねる回数
     * @param _speed 速さ
     * @param _height 最高到達点
     * @param _damping 高さ減衰率 (<1)
     */
    constructor(_count, _speed, _height, _damping) {
      super();
      this._count = _count;
      this._speed = _speed;
      this._height = _height;
      this._damping = _damping;
      this._y = 0;
      this._direction = -1;
      this._hoppingCount = 0;
    }
    isMoving() {
      return this._count > 0;
    }
    update() {
      if (this._count > 0) {
        const delta = ((this._speed * this._speed) / 10) * this._direction;
        if (this._count <= 1 && this._y + delta > 0) {
          this._y = 0;
        } else {
          this._y += delta;
        }
        if (this._y >= 0) {
          /**
           * 着地したら1回ジャンプしたとカウントする
           */
          this._count--;
          this._hoppingCount++;
          this._direction = -1;
        } else if (Math.abs(this._y) >= this.maxHeight()) {
          this._direction = 1;
        }
      }
    }
    maxHeight() {
      return this._height * Math.pow(1 - this._damping, this._hoppingCount);
    }
    y() {
      return this._y;
    }
  }
  class Game_PictureFlicker extends Game_PictureMotion {
    constructor(_count, _interval) {
      super();
      this._count = _count;
      this._interval = _interval;
      this._flashCount = 0;
      this._opacityRate = 1;
      this._frameCount = 0;
    }
    isMoving() {
      return this._count > 0;
    }
    update() {
      if (this._count > 0) {
        if (this._frameCount >= this._interval) {
          this._frameCount = 0;
          this._opacityRate ^= 1;
          if (this._opacityRate === 1) {
            this._count--;
          }
        } else {
          this._frameCount++;
        }
      }
    }
    opacityRate() {
      return this._opacityRate;
    }
  }
  function Game_Screen_PictureMotionMixIn(gameScreen) {
    gameScreen.isPictureMoving = function (pictureId) {
      return this.picture(pictureId)?.isMoving() || false;
    };
    gameScreen.hasMovingPicture = function () {
      return this._pictures.some((picture) => picture?.isMoving());
    };
    gameScreen.slidePicture = function (pictureId, direction, distance, easingType, duration) {
      this.picture(pictureId)?.slide(direction, distance, easingType, duration);
    };
    gameScreen.shakePicture = function (pictureId, power, speed, duration) {
      this.picture(pictureId)?.shake(power, speed, duration);
    };
    gameScreen.hoppingPicture = function (pictureId, count, speed, height, damping) {
      this.picture(pictureId)?.hopping(count, speed, height, damping);
    };
    gameScreen.flickerPicture = function (pictureId, count, interval) {
      this.picture(pictureId)?.flicker(count, interval);
    };
  }
  Game_Screen_PictureMotionMixIn(Game_Screen.prototype);
  function Game_Picture_PictureMotionMixIn(gamePicture) {
    const _initBasic = gamePicture.initBasic;
    gamePicture.initBasic = function () {
      _initBasic.call(this);
      this._motions = [];
    };
    gamePicture.isMoving = function () {
      return this._duration > 0 || !!this._motions?.some((motion) => motion.isMoving());
    };
    const _update = gamePicture.update;
    gamePicture.update = function () {
      _update.call(this);
      this.updateMotion();
    };
    gamePicture.updateMotion = function () {
      const finishedMotions = this._motions?.filter((motion) => !motion.isMoving()) || [];
      this._x += finishedMotions.reduce((value, motion) => value + motion.x(), 0);
      this._y += finishedMotions.reduce((value, motion) => value + motion.y(), 0);
      this._motions = this._motions?.filter((motion) => motion.isMoving()) || [];
      this._motions.forEach((motion) => motion.update());
    };
    gamePicture.pushMotion = function (motion) {
      if (!this._motions) {
        this._motions = [];
      }
      this._motions.push(motion);
    };
    gamePicture.slide = function (direction, distance, easingType, duration) {
      const d = (() => {
        switch (direction) {
          case 2:
            return [0, distance];
          case 4:
            return [-distance, 0];
          case 6:
            return [distance, 0];
          case 8:
            return [0, -distance];
          default:
            return [0, 0];
        }
      })();
      this.pushMotion(new Game_PictureSlide(d[0], d[1], easingType, duration));
    };
    gamePicture.shake = function (power, speed, duration) {
      this.pushMotion(new Game_PictureShake(power, speed, duration));
    };
    gamePicture.hopping = function (count, speed, height, damping) {
      this.pushMotion(new Game_PictureHopping(count, speed, height, damping));
    };
    gamePicture.flicker = function (count, interval) {
      this.pushMotion(new Game_PictureFlicker(count, interval));
    };
    const _x = gamePicture.x;
    gamePicture.x = function () {
      return _x.call(this) + (this._motions?.reduce((result, motion) => result + motion.x(), 0) || 0);
    };
    const _y = gamePicture.y;
    gamePicture.y = function () {
      return _y.call(this) + (this._motions?.reduce((result, motion) => result + motion.y(), 0) || 0);
    };
    const _opacity = gamePicture.opacity;
    gamePicture.opacity = function () {
      return _opacity.call(this) * (this._motions || []).reduce((result, motion) => result * motion.opacityRate(), 1);
    };
  }
  Game_Picture_PictureMotionMixIn(Game_Picture.prototype);
  function Game_Interpreter_PictureMotionMixIn(gameInterpreter) {
    const _updateWaitMode = gameInterpreter.updateWaitMode;
    gameInterpreter.updateWaitMode = function () {
      if (this._waitMode === WAIT_MODE_PICTURE_MOTION) {
        if ($gameScreen.hasMovingPicture()) {
          return true;
        }
      }
      return _updateWaitMode.call(this);
    };
  }
  Game_Interpreter_PictureMotionMixIn(Game_Interpreter.prototype);
})();
