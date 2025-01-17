// DarkPlasma_EvacuateAllItems 1.0.0
// Copyright (c) 2025 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/01/17 1.0.0 公開
 */

/*:
 * @plugindesc アイテムを退避するプラグインコマンド
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command EvacuateAllItems
 * @text アイテムを退避する
 * @desc 所持している全てのアイテムを一時的に退避します。
 * @arg evacuateItems
 * @desc アイテムを退避します。大事なものは退避しません。
 * @text アイテムを退避する
 * @type boolean
 * @default true
 * @arg evacuateWeapons
 * @desc 武器を退避します。装備している武器は退避しません。
 * @text 武器を退避する
 * @type boolean
 * @default false
 * @arg evacuateArmors
 * @desc 防具を退避します。装備している防具は退避しません。
 * @text 防具を退避する
 * @type boolean
 * @default false
 * @arg evacuateKeyItems
 * @desc 大事なものを退避します。
 * @text 大事なものを退避する
 * @type boolean
 * @default false
 *
 * @command RegainItems
 * @text 退避したアイテムを戻す
 * @desc 退避したアイテムを戻します。所持数上限を超えたアイテムは捨てられます。
 *
 * @help
 * version: 1.0.0
 * 所持しているアイテムを一時的に退避するプラグインコマンドを提供します。
 * 退避したアイテムはインベントリから消えます。
 * 退避したアイテムを戻すコマンドによって再びインベントリに戻すことができます。
 *
 * 本プラグインはセーブデータを拡張します。
 * 退避したアイテムのIDと個数をセーブデータに含みます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function parseArgs_EvacuateAllItems(args) {
    return {
      evacuateItems: String(args.evacuateItems || true) === 'true',
      evacuateWeapons: String(args.evacuateWeapons || false) === 'true',
      evacuateArmors: String(args.evacuateArmors || false) === 'true',
      evacuateKeyItems: String(args.evacuateKeyItems || false) === 'true',
    };
  }

  const command_EvacuateAllItems = 'EvacuateAllItems';

  const command_RegainItems = 'RegainItems';

  PluginManager.registerCommand(pluginName, command_EvacuateAllItems, function (args) {
    const parsedArgs = parseArgs_EvacuateAllItems(args);
    if (parsedArgs.evacuateItems) {
      $gameParty.evacuateAllItems('item');
    }
    if (parsedArgs.evacuateWeapons) {
      $gameParty.evacuateAllItems('weapon');
    }
    if (parsedArgs.evacuateArmors) {
      $gameParty.evacuateAllItems('armor');
    }
    if (parsedArgs.evacuateKeyItems) {
      $gameParty.evacuateAllItems('keyItem');
    }
  });
  PluginManager.registerCommand(pluginName, command_RegainItems, function (args) {
    $gameParty.regainEvacuatedItems();
  });
  function Game_Party_EvacuateAllItemsMixIn(gameParty) {
    gameParty.evacuatedInventory = function () {
      if (!this._evacuatedInventory) {
        this._evacuatedInventory = new Game_EvacuatedInventory();
      }
      return this._evacuatedInventory;
    };
    gameParty.evacuateAllItems = function (category) {
      switch (category) {
        case 'item':
          this.items()
            .filter((item) => item.itypeId !== 2)
            .forEach((item) => this.evacuateItem(item, this.numItems(item)));
          break;
        case 'weapon':
          this.weapons().forEach((weapon) => this.evacuateItem(weapon, this.numItems(weapon)));
          break;
        case 'armor':
          this.armors().forEach((armor) => this.evacuateItem(armor, this.numItems(armor)));
          break;
        case 'keyItem':
          this.items()
            .filter((item) => item.itypeId === 2)
            .forEach((item) => this.evacuateItem(item, this.numItems(item)));
          break;
      }
    };
    gameParty.evacuateItem = function (item, amount) {
      this.evacuatedInventory().pushItem(item, amount);
      this.loseItem(item, amount, false);
    };
    gameParty.regainEvacuatedItems = function () {
      this.evacuatedInventory()
        .popAllItems()
        .forEach((regain) => this.gainItem(regain.item, regain.amount));
    };
  }
  Game_Party_EvacuateAllItemsMixIn(Game_Party.prototype);
  class Game_EvacuatedInventory {
    constructor() {
      this.initialize();
    }
    initialize() {
      this._items = {};
      this._weapons = {};
      this._armors = {};
    }
    itemContainer(item) {
      if (DataManager.isItem(item)) {
        return this._items;
      } else if (DataManager.isWeapon(item)) {
        return this._weapons;
      } else {
        return this._armors;
      }
    }
    pushItem(item, amount) {
      const container = this.itemContainer(item);
      if (!container[item.id]) {
        container[item.id] = 0;
      }
      container[item.id] += amount;
    }
    popAllItems() {
      const result = Object.keys(this._items)
        .map((id) => {
          return {
            item: $dataItems[Number(id)],
            amount: this._items[Number(id)],
          };
        })
        .concat(
          Object.keys(this._weapons).map((id) => {
            return {
              item: $dataWeapons[Number(id)],
              amount: this._weapons[Number(id)],
            };
          }),
        )
        .concat(
          Object.keys(this._armors).map((id) => {
            return {
              item: $dataArmors[Number(id)],
              amount: this._armors[Number(id)],
            };
          }),
        );
      this._items = {};
      this._weapons = {};
      this._armors = {};
      return result;
    }
  }
  globalThis.Game_EvacuatedInventory = Game_EvacuatedInventory;
})();
