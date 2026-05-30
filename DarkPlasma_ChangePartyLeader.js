// DarkPlasma_ChangePartyLeader 1.0.1
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/30 1.0.1 リーダーを変更するコマンド実行時に、変更後のリーダーが現在と同じ場合に、実行直前のリーダーが記録されない不具合の修正
 *                  configをTypeScript移行
 * 2022/11/06 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc パーティの先頭（リーダー）を変更する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command changeLeader
 * @text リーダーを変更する
 * @desc パーティリーダーを指定したアクターに変更します。（元のリーダーと隊列を入れ替えます）
 * @arg actorId
 * @text アクター
 * @type actor
 * @default 0
 *
 * @command resetLeader
 * @text リーダーを元に戻す
 * @desc リーダーを変更プラグインコマンド実行直前の状態に戻します。
 *
 * @help
 * version: 1.0.1
 * 先頭のパーティメンバーを、現在パーティメンバーにいるアクターに
 * 入れ替えるプラグインコマンドを提供します。
 *
 * セーブデータに以下のデータを追加します。
 * - プラグインコマンドでリーダーを変更する直前のリーダー
 *
 * 尚、指定したアクターや元のリーダーがパーティメンバーにいない場合、
 * プラグインコマンドは何もしません。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_changeLeader(args) {
    return {
      actorId: Number(args.actorId || 0),
    };
  }

  const command_changeLeader = 'changeLeader';

  const command_resetLeader = 'resetLeader';

  PluginManager.registerCommand(pluginName, command_changeLeader, function (args) {
    const parsedArgs = parseArgs_changeLeader(args);
    const actor = $gameActors.actor(parsedArgs.actorId);
    if (!actor) {
      return;
    }
    this._leaderActorIdBeforeChange = $gameParty.leader().actorId();
    if (actor.index() === 0) {
      return;
    }
    $gameParty.swapOrder(0, actor.index());
  });
  PluginManager.registerCommand(pluginName, command_resetLeader, function () {
    const actor = $gameActors.actor(this._leaderActorIdBeforeChange || 0);
    if (actor && actor.index() > 0) {
      $gameParty.swapOrder(0, actor.index());
    }
  });
})();
