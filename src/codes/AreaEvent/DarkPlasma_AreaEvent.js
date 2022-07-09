import { pluginName } from '../../common/pluginName';
import { command_registerArea, parseArgs_registerArea } from './_build/DarkPlasma_AreaEvent_commands';

const ORIGIN = {
  TOP_LEFT: 7,
  TOP_CENTER: 8,
  TOP_RIGHT: 9,

  MIDDLE_LEFT: 4,
  MIDDLE_CENTER: 5,
  MIDDLE_RIGHT: 6,

  BOTTOM_LEFT: 1,
  BOTTOM_CENTER: 2,
  BOTTOM_RIGHT: 3,
};

const COMMAND_CODE = {
  PLUGIN_COMMAND: 357,
};

class Game_EventArea {
  /**
   * @param {number} width
   * @param {number} height
   * @param {number} originType
   */
  constructor(width, height, originType) {
    this._width = width;
    this._height = height;
    this._originType = originType;
  }

  static default() {
    return new Game_EventArea(1, 1, ORIGIN.TOP_LEFT);
  }

  /**
   * @param {number} eventX
   * @param {number} eventY
   * @return {Rectangle}
   */
  rectangle(eventX, eventY) {
    const x = (() => {
      if (this._originType % 3 === 1) {
        return eventX - Math.floor(this._width / 2);
      } else if (this._originType % 3 === 2) {
        return eventX;
      }
      return eventX + Math.floor(this._width / 2);
    })();
    const y = (() => {
      if (this._originType > 6) {
        return eventY - Math.floor(this._height / 2);
      } else if (this._originType < 4) {
        return eventY + Math.floor(this._height / 2);
      }
      return eventY;
    })();
    return new Rectangle(x, y, this._width, this._height);
  }
}

/**
 * @param {Game_Event.prototype} gameEvent
 */
function Game_Event_AreaEventMixIn(gameEvent) {
  const _clearPageSettings = gameEvent.clearPageSettings;
  gameEvent.clearPageSettings = function () {
    _clearPageSettings.call(this);
    this._area = Game_EventArea.default();
  };

  const _setupPageSettings = gameEvent.setupPageSettings;
  gameEvent.setupPageSettings = function () {
    _setupPageSettings.call(this);
    this.setupArea();
  };

  gameEvent.isAreaEvent = function () {
    return this.event() && this.event().meta && this.event().meta.areaEvent;
  };

  gameEvent.setupArea = function () {
    if (this.isAreaEvent() && this.page()) {
      const command = this.page().list.find(
        (command) =>
          command.code === COMMAND_CODE.PLUGIN_COMMAND &&
          command.parameters.includes(pluginName) &&
          command.parameters.includes(command_registerArea)
      );
      const args = parseArgs_registerArea(command.parameters[3]);
      this._area = new Game_EventArea(args.width, args.height, args.origin);
    } else {
      this._area = Game_EventArea.default();
    }
  };

  /**
   * 範囲判定にするため上書き
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  gameEvent.pos = function (x, y) {
    const rect = this._area.rectangle(this._x, this._y);
    return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
  };
}

Game_Event_AreaEventMixIn(Game_Event.prototype);
