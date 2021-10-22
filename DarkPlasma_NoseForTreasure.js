// DarkPlasma_NoseForTreasure 1.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/10/22 1.0.1 プラグインコマンドの日本語名を追加
 * 2021/10/21 1.0.0 公開
 */

/*:ja
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
 *
 * @help
 * version: 1.0.1
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

  const PLUGIN_COMMANDS = {
    NOSE_FOR_TREASURE: 'noseForTreasure',
  };

  PluginManager.registerCommand(pluginName, PLUGIN_COMMANDS.NOSE_FOR_TREASURE, function (args) {
    const tag = String(args.tag);
    const variableId = Number(args.variableId);
    const selfSwitches = JSON.parse(args.selfSwitches).map((e) => {
      const parsed = JSON.parse(e);
      return {
        name: String(parsed.name),
        state: String(parsed.state) === 'true',
      };
    });
    $gameVariables.setValue(
      variableId,
      $gameMap
        .events()
        .filter(
          (gameEvent) =>
            gameEvent.event().meta[tag] &&
            selfSwitches.every(
              (selfSwitch) => $gameSelfSwitches.value(gameEvent.selfSwitchKey(selfSwitch.name)) === selfSwitch.state
            )
        ).length
    );
  });

  Game_Event.prototype.selfSwitchKey = function (selfSwitchCh) {
    return [this._mapId, this._eventId, selfSwitchCh];
  };
})();
