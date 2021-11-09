// DarkPlasma_NPCKeepOutRegion 1.1.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/11/09 1.1.0 移動制限無視をメモ欄で制御するように変更
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/04/20 1.0.0 公開
 */

/*:ja
 * @plugindesc イベントが通れないリージョンを指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param regions
 * @desc イベントが通行できないリージョン一覧を設定します。
 * @text リージョン一覧
 * @type number[]
 * @default []
 *
 * @help
 * version: 1.1.0
 * プラグインパラメータで指定したリージョンのマスについて、
 * イベントが通行できなくなります。
 *
 * イベントのメモ欄に特定の記述をすることで、この通行制限を無視できます。
 *
 * <ignoreKeepOut>
 * このメモタグが記述されたイベントは無条件で通行制限を無視する
 *
 * <ignoreKeepOut:A>
 * このメモタグが記述されたイベントは、
 * セルフスイッチAがONの場合に通行制限を無視する
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    regions: JSON.parse(pluginParameters.regions || '[]').map((e) => {
      return Number(e || 0);
    }),
  };

  Game_Map.prototype.isEventKeepOutRegion = function (x, y) {
    return settings.regions.includes(this.regionId(x, y));
  };

  /**
   * @param {Game_Event.prototype} gameEvent
   */
  function Game_Event_KeepOutRegionMixIn(gameEvent) {
    const _isMapPassable = gameEvent.isMapPassable;
    gameEvent.isMapPassable = function (x, y, d) {
      const x2 = $gameMap.roundXWithDirection(x, d);
      const y2 = $gameMap.roundYWithDirection(y, d);
      if (!this.ignoreKeepOut() && $gameMap.isEventKeepOutRegion(x2, y2)) {
        return false;
      }
      return _isMapPassable.call(this, x, y, d);
    };

    gameEvent.ignoreKeepOut = function () {
      if (!this.event()) {
        return false;
      }
      const selfSwitchCh = this.event().meta.ignoreKeepOut;
      return selfSwitchCh === true || $gameSelfSwitches.value([this._mapId, this._eventId, selfSwitchCh]);
    };
  }

  Game_Event_KeepOutRegionMixIn(Game_Event.prototype);
})();
