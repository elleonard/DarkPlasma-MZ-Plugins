// DarkPlasma_SaveFormation 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/04/19 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc パーティの並び順を保存して復元する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command saveFormation
 * @text 並び順を保存する
 * @desc パーティメンバーの現在の並び順を保存します。
 * @arg key
 * @desc 保存する並び順に名前をつけます。同じ名前で保存された並び順は上書きされます。
 * @text 識別名
 * @type string
 *
 * @command loadFormation
 * @text 並び順を復元する
 * @desc 保存した並び順を復元します。保存されていない識別名を指定すると何も起きません。
 * @arg key
 * @desc 保存の際につけた名前を指定します。
 * @text 識別名
 * @type string
 *
 * @help
 * version: 1.0.0
 * パーティの並び順を保存して復元するプラグインコマンドを提供します。
 *
 * 復元の際にパーティメンバーの構成が変更されていた場合
 * 元々いたメンバーを先頭に配置し、いなかったメンバーを後ろに配置します。
 *
 * 戦闘中にパーティメンバーを復元することは推奨しません。
 *
 * 本プラグインはセーブデータに以下の情報を追加します。
 * - 保存したパーティメンバーの並び順
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_saveFormation(args) {
    return {
      key: String(args.key || ``),
    };
  }

  function parseArgs_loadFormation(args) {
    return {
      key: String(args.key || ``),
    };
  }

  const command_saveFormation = 'saveFormation';

  const command_loadFormation = 'loadFormation';

  PluginManager.registerCommand(pluginName, command_saveFormation, function (args) {
    const parsedArgs = parseArgs_saveFormation(args);
    $gameParty.saveMemberFormation(parsedArgs.key);
  });
  PluginManager.registerCommand(pluginName, command_loadFormation, function (args) {
    const parsedArgs = parseArgs_loadFormation(args);
    $gameParty.loadMemberFormation(parsedArgs.key);
  });
  function Game_Party_SaveFormationMixIn(gameParty) {
    gameParty.initializeMemberFormations = function () {
      this._savedMemberFormations = new Map();
    };
    gameParty.saveMemberFormation = function (key) {
      if (!this._savedMemberFormations) {
        this.initializeMemberFormations();
      }
      this._savedMemberFormations?.set(key, [...this._actors]);
    };
    gameParty.loadMemberFormation = function (key) {
      if (!this._savedMemberFormations) {
        this.initializeMemberFormations();
      }
      const members = this._savedMemberFormations?.get(key);
      if (members) {
        this._actors = [...members];
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
        $gameTemp.requestBattleRefresh();
      }
    };
  }
  Game_Party_SaveFormationMixIn(Game_Party.prototype);
})();
