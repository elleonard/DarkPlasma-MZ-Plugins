// DarkPlasma_LoseAllItems 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/01/16 1.0.0 公開
 */

/*:
 * @plugindesc 所持しているアイテムを全て捨てるプラグインコマンド
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command LoseAllItems
 * @text アイテムを破棄する
 * @desc 指定カテゴリに属する全てのアイテムを破棄します。
 * @arg loseItems
 * @desc アイテムを破棄します。大事なものは破棄しません。
 * @text アイテムを破棄する
 * @type boolean
 * @default true
 * @arg loseWeapons
 * @desc 武器を破棄します。装備している武器は破棄しません。
 * @text 武器を破棄する
 * @type boolean
 * @default false
 * @arg loseArmors
 * @desc 防具を破棄します。装備している防具は破棄しません。
 * @text 防具を破棄する
 * @type boolean
 * @default false
 * @arg loseKeyItems
 * @desc 大事なものを破棄します。
 * @text 大事なものを破棄する
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.0.0
 * 所持しているアイテムを全て捨てるプラグインコマンドを提供します。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_LoseAllItems(args) {
    return {
      loseItems: String(args.loseItems || true) === 'true',
      loseWeapons: String(args.loseWeapons || false) === 'true',
      loseArmors: String(args.loseArmors || false) === 'true',
      loseKeyItems: String(args.loseKeyItems || false) === 'true',
    };
  }

  const command_LoseAllItems = 'LoseAllItems';

  PluginManager.registerCommand(pluginName, command_LoseAllItems, function (args) {
    const parsedArgs = parseArgs_LoseAllItems(args);
    if (parsedArgs.loseItems) {
      $gameParty.loseAllItems('item');
    }
    if (parsedArgs.loseWeapons) {
      $gameParty.loseAllItems('weapon');
    }
    if (parsedArgs.loseArmors) {
      $gameParty.loseAllItems('armor');
    }
    if (parsedArgs.loseKeyItems) {
      $gameParty.loseAllItems('keyItem');
    }
  });
  function Game_Party_LoseAllItemsMixIn(gameParty) {
    gameParty.loseAllItems = function (category) {
      switch (category) {
        case 'item':
          this.items()
            .filter((item) => item.itypeId !== 2)
            .forEach((item) => this.loseItem(item, this.numItems(item), false));
          break;
        case 'weapon':
          this.weapons().forEach((weapon) => this.loseItem(weapon, this.numItems(weapon), false));
          break;
        case 'armor':
          this.armors().forEach((armor) => this.loseItem(armor, this.numItems(armor), false));
          break;
        case 'keyItem':
          this.items()
            .filter((item) => item.itypeId === 2)
            .forEach((item) => this.loseItem(item, this.numItems(item), false));
          break;
      }
    };
  }
  Game_Party_LoseAllItemsMixIn(Game_Party.prototype);
})();
