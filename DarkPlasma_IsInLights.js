// DarkPlasma_IsInLights 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/02/23 1.0.0 公開
 */

/*:
 * @plugindesc 明かりの中にいるかどうか判定するプラグインコマンド
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_DarkMap
 *
 * @command isInLights
 * @text 明かりの中にいるか判定
 * @desc 明かりの中にいる場合指定したスイッチをONにします。
 * @arg switchId
 * @desc 対象が明かりの中にいる場合ONにするスイッチを指定します。
 * @text スイッチ
 * @type switch
 * @default 0
 * @arg target
 * @desc 明かりの中にいるかどうか判定する対象を選択します。
 * @text 対象
 * @type select
 * @option プレイヤー
 * @value player
 * @option このイベント
 * @value thisEvent
 * @option 他のイベント
 * @value otherEvent
 * @default player
 * @arg eventId
 * @desc 対象が他のイベントの場合に、イベントIDを指定します。
 * @text イベントID
 * @type number
 * @default 0
 *
 * @help
 * version: 1.0.0
 * 暗いマップにおいて明かりの中にいるかどうか判定し、
 * 結果をスイッチに反映するプラグインコマンドを提供します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_DarkMap version:2.2.0
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_isInLights(args) {
    return {
      switchId: Number(args.switchId || 0),
      target: String(args.target || `player`),
      eventId: Number(args.eventId || 0),
    };
  }

  const command_isInLights = 'isInLights';

  PluginManager.registerCommand(pluginName, command_isInLights, function (args) {
    const parsedArgs = parseArgs_isInLights(args);
    const target = (() => {
      switch (parsedArgs.target) {
        case 'player':
          return $gamePlayer;
        case 'thisEvent':
          return this.character(0);
        case 'otherEvent':
          return this.character(parsedArgs.eventId);
        default:
          return null;
      }
    })();
    $gameSwitches.setValue(parsedArgs.switchId, target?.isInLights() || false);
  });
  function Game_Map_IsInLightsMixIn(gameMap) {
    gameMap.crowFlyDistance = function (x1, x2, y1, y2) {
      return Math.sqrt(Math.pow(this.deltaX(x1, x2), 2) + Math.pow(this.deltaY(y1, y2), 2));
    };
  }
  Game_Map_IsInLightsMixIn(Game_Map.prototype);
  function Game_CharacterBase_IsInLightsMixIn(gameCharacterBase) {
    gameCharacterBase.isInLights = function () {
      return $gameMap.isDark() && $gameMap.lightEvents().some((event) => event.lightCovers(this.x, this.y));
    };
    gameCharacterBase.lightCovers = function (x, y) {
      return (
        this.hasLight() && $gameMap.crowFlyDistance(this.x, x, this.y, y) * $gameMap.tileWidth() < this.lightRadius()
      );
    };
  }
  Game_CharacterBase_IsInLightsMixIn(Game_CharacterBase.prototype);
})();
