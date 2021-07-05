// DarkPlasma_NPCKeepOutRegion 1.0.2
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/04/20 1.0.0 公開
 */

/*:ja
 * @plugindesc ランダム移動やプレイヤーへ近づくNPCが通れないリージョンを指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param regions
 * @desc NPCがカスタム以外の自律移動で通行できないリージョン一覧
 * @text リージョン一覧
 * @type number[]
 * @default []
 *
 * @help
 * version: 1.0.2
 * プラグインパラメータで指定したリージョンのマスについて、
 * イベントがランダムまたは近づく自律移動で通行できなくなります。
 *
 * カスタム移動や移動ルートの指定では通行できます。
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

  const MOVE_TYPE_CUSTOM = 3;

  Game_Map.prototype.isEventKeepOutRegion = function (x, y) {
    return settings.regions.includes(this.regionId(x, y));
  };

  const _Game_Event_isMapPassable = Game_Event.prototype.isMapPassable;
  Game_Event.prototype.isMapPassable = function (x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isMoveRangeLimited() && $gameMap.isEventKeepOutRegion(x2, y2)) {
      return false;
    }
    return _Game_Event_isMapPassable.call(this, x, y, d);
  };

  Game_Event.prototype.isMoveRangeLimited = function () {
    return this._moveType !== MOVE_TYPE_CUSTOM && !this.isMoveRouteForcing();
  };
})();
