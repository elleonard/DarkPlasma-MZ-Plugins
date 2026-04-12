/// <reference path="./PictureMotion.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_flicker, command_hopping, command_shake, command_slide, parseArgs_flicker, parseArgs_hopping, parseArgs_shake, parseArgs_slide } from '../config/_build/DarkPlasma_PictureMotion_commands';

const WAIT_MODE_PICTURE_MOTION = "pictureMotion";

PluginManager.registerCommand(pluginName, command_slide, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_slide(args);
  if ([0, 1, 2, 3].includes(parsedArgs.easingType)) {
    $gameScreen.slidePicture(
      parsedArgs.pictureId,
      parsedArgs.direction,
      parsedArgs.distance,
      parsedArgs.easingType as 0|1|2|3,
      parsedArgs.duration
    );

    if (parsedArgs.wait) {
      this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
    }
  }
});

PluginManager.registerCommand(pluginName, command_shake, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_shake(args);

  $gameScreen.shakePicture(
    parsedArgs.pictureId,
    parsedArgs.power,
    parsedArgs.speed,
    parsedArgs.duration
  );

  if (parsedArgs.wait) {
    this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
  }
});

PluginManager.registerCommand(pluginName, command_hopping, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_hopping(args);

  $gameScreen.hoppingPicture(
    parsedArgs.pictureId,
    parsedArgs.count,
    parsedArgs.speed,
    parsedArgs.height,
    parsedArgs.damping
  );

  if (parsedArgs.wait) {
    this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
  }
});

PluginManager.registerCommand(pluginName, command_flicker, function (this: Game_Interpreter, args) {
  const parsedArgs = parseArgs_flicker(args);

  $gameScreen.flickerPicture(
    parsedArgs.pictureId,
    parsedArgs.count,
    parsedArgs.interval
  );

  if (parsedArgs.wait) {
    this.setWaitMode(WAIT_MODE_PICTURE_MOTION);
  }
});

class Easing {
  static easeIn(t: number, exponent: number): number {
    return Math.pow(t, exponent);
  }

  static easeOut(t: number, exponent: number): number {
    return 1 - Math.pow(1 - t, exponent);
  }

  static easeInOut(t: number, exponent: number): number {
    return t < 0.5 ? this.easeIn(t * 2, exponent) / 2 : this.easeOut(t * 2 - 1, exponent) / 2 + 0.5;
  }
}

class Game_PictureMotion {
  isMoving() {
    return false;
  }

  update() {
  }

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
  _wholeDuration: number;
  _currentOffsetX: number;
  _currentOffsetY: number;

  constructor(
    private _distanceX: number,
    private _distanceY: number,
    private _easingType: 0|1|2|3,
    private _duration: number
  ) {
    super();
    this._currentOffsetX = 0;
    this._currentOffsetY = 0;
    this._wholeDuration = _duration;
  }

  isMoving(): boolean {
    return this._duration > 0;
  }

  x(): number {
    return this._currentOffsetX;
  }

  y(): number {
    return this._currentOffsetY;
  }

  update(): void {
    if (this._duration > 0) {
      this._currentOffsetX = this.applyEasing(this._currentOffsetX, this._distanceX);
      this._currentOffsetY = this.applyEasing(this._currentOffsetY, this._distanceY);
      this._duration--;
    }
  }

  applyEasing(current: number, target: number) {
    const d = this._duration;
    const wd = this._wholeDuration;
    const lt = this.calcEasing((wd - d) / wd);
    const t = this.calcEasing((wd - d + 1) / wd);
    const start = (current - target * lt) / (1 - lt);
    return start + (target - start) * t;
  }

  calcEasing(t: number): number {
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
  _shake: number;
  _direction: number;

  /**
   * @param _power 強さ
   * @param _speed 速さ
   * @param _duration 時間
   */
  constructor(private _power: number, private _speed: number, private _duration: number) {
    super();
    this._shake = 0;
    this._direction = 1;
  }

  isMoving() {
    return this._duration > 0;
  }

  update() {
    if (this._duration > 0) {
      const delta = this._power * this._speed * this._direction / 10;
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
  _y: number;
  _direction: number;
  _hoppingCount: number;

  /**
   * @param _count 跳ねる回数
   * @param _speed 速さ
   * @param _height 最高到達点
   * @param _damping 高さ減衰率 (<1)
   */
  constructor(private _count: number, private _speed: number, private _height: number, private _damping: number) {
    super();
    this._y = 0;
    this._direction = -1;
    this._hoppingCount = 0;
  }

  isMoving(): boolean {
    return this._count > 0;
  }

  update () {
    if (this._count > 0) {
      const delta = this._speed * this._speed / 10 * this._direction;
      if (this._count <= 1 && (this._y + delta) > 0) {
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
        this._direction = 1
      }
    }
  }

  maxHeight() {
    return this._height * Math.pow((1 - this._damping), this._hoppingCount);
  }

  y() {
    return this._y;
  }
}

class Game_PictureFlicker extends Game_PictureMotion {
  _flashCount: number;
  _opacityRate: number;
  _frameCount: number;

  constructor(private _count: number, private _interval: number) {
    super();
    this._flashCount = 0;
    this._opacityRate = 1;
    this._frameCount = 0;
  }

  isMoving(): boolean {
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

  opacityRate(): number {
    return this._opacityRate;
  }
}

function Game_Screen_PictureMotionMixIn(gameScreen: Game_Screen) {
  gameScreen.isPictureMoving = function (pictureId) {
    return this.picture(pictureId)?.isMoving() || false;
  };

  gameScreen.hasMovingPicture = function () {
    return this._pictures.some(picture => picture?.isMoving());
  };

  gameScreen.slidePicture = function (
    pictureId: number,
    direction: number,
    distance: number,
    easingType: 0|1|2|3,
    duration: number
  ) {
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

function Game_Picture_PictureMotionMixIn(gamePicture: Game_Picture) {
  const _initBasic = gamePicture.initBasic;
  gamePicture.initBasic = function () {
    _initBasic.call(this);
    this._motions = [];
  };

  gamePicture.isMoving = function () {
    return this._duration > 0 || !!this._motions?.some(motion => motion.isMoving());
  };

  const _update = gamePicture.update;
  gamePicture.update = function () {
    _update.call(this);
    this.updateMotion();
  };

  gamePicture.updateMotion = function () {
    const finishedMotions = this._motions?.filter(motion => !motion.isMoving()) || [];
    this._x += finishedMotions.reduce((value, motion) => value + motion.x(), 0);
    this._y += finishedMotions.reduce((value, motion) => value + motion.y(), 0);
    this._motions = this._motions?.filter(motion => motion.isMoving()) || [];
    this._motions.forEach(motion => motion.update());
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

  gamePicture.hopping = function(count, speed, height, damping) {
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

function Game_Interpreter_PictureMotionMixIn(gameInterpreter: Game_Interpreter) {
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
