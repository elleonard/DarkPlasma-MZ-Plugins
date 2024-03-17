// DarkPlasma_AreaEvent 1.0.4
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/03/17 1.0.4 TypeScript移行
 * 2022/07/23 1.0.3 エリアイベントがあるマップでセーブしたデータをロードできない不具合を修正
 * 2022/07/14 1.0.2 エリアイベントメモタグをつけたイベントの有効なページにエリア登録がない場合にエラーにしない
 * 2022/07/11 1.0.1 原点設定が正しくない不具合を修正
 * 2022/07/10 1.0.0 公開
 */

/*:
 * @plugindesc イベントの当たり判定 起動判定マスを拡張する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command registerArea
 * @text エリア設定
 * @desc このコマンドを置いたページの当たり判定を拡張します。
 * @arg width
 * @text 横幅
 * @type number
 * @default 1
 * @min 1
 * @arg height
 * @text 縦幅
 * @type number
 * @default 1
 * @min 1
 * @arg origin
 * @text 原点
 * @desc エディタ上で設定するイベントの位置を範囲のどこにおくかを設定します。
 * @type select
 * @option 左上
 * @value 7
 * @option 中央上
 * @value 8
 * @option 右上
 * @value 9
 * @option 左
 * @value 4
 * @option 中央
 * @value 5
 * @option 右
 * @value 6
 * @option 左下
 * @value 1
 * @option 中央下
 * @value 2
 * @option 右下
 * @value 3
 * @default 7
 *
 * @help
 * version: 1.0.4
 * <areaEvent>メタタグのついたイベントの当たり判定 起動判定マスを拡張します。
 * 範囲はページの先頭でプラグインコマンドによって設定します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_registerArea(args) {
    return {
      width: Number(args.width || 1),
      height: Number(args.height || 1),
      origin: Number(args.origin || 7),
    };
  }

  const command_registerArea = 'registerArea';

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
          return eventX;
        } else if (this._originType % 3 === 2) {
          return eventX - Math.floor(this._width / 2);
        }
        return eventX + Math.floor(this._width / 2);
      })();
      const y = (() => {
        if (this._originType > 6) {
          return eventY;
        } else if (this._originType < 4) {
          return eventY + Math.floor(this._height / 2);
        }
        return eventY - Math.floor(this._height / 2);
      })();
      return new Rectangle(x, y, this._width, this._height);
    }
  }
  globalThis.Game_EventArea = Game_EventArea;
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
      return !!this.event()?.meta.areaEvent;
    };
    gameEvent.setupArea = function () {
      if (this.isAreaEvent() && this.page()) {
        const command = this.page().list.find(
          (command) =>
            command.code === COMMAND_CODE.PLUGIN_COMMAND &&
            command.parameters.includes(pluginName) &&
            command.parameters.includes(command_registerArea),
        );
        if (command) {
          const args = parseArgs_registerArea(command.parameters[3]);
          this._area = new Game_EventArea(args.width, args.height, args.origin);
        } else {
          this._area = Game_EventArea.default();
        }
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
})();
