// DarkPlasma_NoseForTreasure 1.1.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/02/28 1.1.1 TypeScript移行
 * 2021/10/23 1.1.0 特定イベントの上にバルーンを表示する機能を追加
 * 2021/10/22 1.0.1 プラグインコマンドの日本語名を追加
 * 2021/10/21 1.0.0 公開
 */

/*:
 * @plugindesc マップ上にある特定のイベントの数を取得する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command noseForTreasure
 * @text マップ内特定イベントの数取得
 * @arg tag
 * @text タグ
 * @desc 探すイベント種別を表すタグを指定します。
 * @type string
 * @arg variableId
 * @text 変数
 * @desc 探した種類のイベントの数を取得する変数を指定します。
 * @type variable
 * @arg selfSwitches
 * @text セルフスイッチ
 * @desc 特定セルフスイッチの状態で探すイベントを絞り込みます。
 * @type struct<SelfSwitch>[]
 * @default ["{\"name\":\"A\",\"state\":\"false\"}"]
 * @arg balloon
 * @text フキダシ
 * @desc 探した種類のイベントに表示するフキダシ
 * @type select
 * @option なし
 * @value 0
 * @option びっくり
 * @value 1
 * @option はてな
 * @value 2
 * @option 音符
 * @value 3
 * @option ハート
 * @value 4
 * @option 怒り
 * @value 5
 * @option 汗
 * @value 6
 * @option くしゃくしゃ
 * @value 7
 * @option 沈黙
 * @value 8
 * @option 電球
 * @value 9
 * @option Zzz
 * @value 10
 * @option ユーザー定義1
 * @value 11
 * @option ユーザー定義2
 * @value 12
 * @option ユーザー定義3
 * @value 13
 * @option ユーザー定義4
 * @value 14
 * @option ユーザー定義5
 * @value 15
 * @default 0
 *
 * @help
 * version: 1.1.1
 * イベントのメモ欄にイベントの種類を表すタグを記入した上で
 * プラグインコマンドを実行すると、
 * 指定した変数にその種類のイベントの数を取得します。
 */
/*~struct~SelfSwitch:
 * @param name
 * @desc セルフスイッチの名前を指定します。
 * @text セルフスイッチ名
 * @type select
 * @option A
 * @value A
 * @option B
 * @value B
 * @option C
 * @value C
 * @option D
 * @value D
 * @default A
 *
 * @param state
 * @text ON/OFF
 * @type boolean
 * @default false
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_noseForTreasure(args) {
    return {
      tag: String(args.tag || ``),
      variableId: Number(args.variableId || 0),
      selfSwitches: JSON.parse(args.selfSwitches || '[{"name":"A","state":"false"}]').map((e) => {
        return ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            name: String(parsed.name || `A`),
            state: String(parsed.state || false) === 'true',
          };
        })(e || '{}');
      }),
      balloon: Number(args.balloon || 0),
    };
  }

  const PLUGIN_COMMANDS = {
    NOSE_FOR_TREASURE: 'noseForTreasure',
  };
  PluginManager.registerCommand(pluginName, PLUGIN_COMMANDS.NOSE_FOR_TREASURE, function (args) {
    const parsedArgs = parseArgs_noseForTreasure(args);
    const targetEvents = $gameMap
      .events()
      .filter(
        (gameEvent) =>
          gameEvent.event().meta[parsedArgs.tag] &&
          parsedArgs.selfSwitches.every(
            (selfSwitch) => $gameSelfSwitches.value(gameEvent.selfSwitchKey(selfSwitch.name)) === selfSwitch.state,
          ),
      );
    $gameVariables.setValue(parsedArgs.variableId, targetEvents.length);
    if (parsedArgs.balloon) {
      targetEvents.forEach((event) => $gameTemp.requestBalloon(event, parsedArgs.balloon));
    }
  });
  function Game_Event_NoseForTreasureMixIn(gameEvent) {
    gameEvent.selfSwitchKey = function (selfSwitchCh) {
      return [this._mapId, this._eventId, selfSwitchCh];
    };
  }
  Game_Event_NoseForTreasureMixIn(Game_Event.prototype);
})();
