/// <reference path="./EvacuateAllItems.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_EvacuateAllItems, command_RegainItems, parseArgs_EvacuateAllItems } from '../config/_build/DarkPlasma_EvacuateAllItems_commands';

PluginManager.registerCommand(pluginName, command_EvacuateAllItems, function (args) {
  const parsedArgs = parseArgs_EvacuateAllItems(args);
  if (parsedArgs.evacuateItems) {
    $gameParty.evacuateAllItems("item");
  }
  if (parsedArgs.evacuateWeapons) {
    $gameParty.evacuateAllItems("weapon");
  }
  if (parsedArgs.evacuateArmors) {
    $gameParty.evacuateAllItems("armor");
  }
  if (parsedArgs.evacuateKeyItems) {
    $gameParty.evacuateAllItems("keyItem");
  }
});

PluginManager.registerCommand(pluginName, command_RegainItems, function (args) {
  $gameParty.regainEvacuatedItems();
});

function Game_Party_EvacuateAllItemsMixIn(gameParty: Game_Party) {
  gameParty.evacuatedInventory = function () {
    if (!this._evacuatedInventory) {
      this._evacuatedInventory = new Game_EvacuatedInventory();
    }
    return this._evacuatedInventory;
  };

  gameParty.evacuateAllItems = function (category) {
    switch (category) {
      case "item":
        this.items()
          .filter(item => item.itypeId !== 2)
          .forEach(item => this.evacuateItem(item, this.numItems(item)));
        break;
      case "weapon":
        this.weapons()
          .forEach(weapon => this.evacuateItem(weapon, this.numItems(weapon)));
        break;
      case "armor":
        this.armors()
          .forEach(armor => this.evacuateItem(armor, this.numItems(armor)));
        break;
      case "keyItem":
        this.items()
          .filter(item => item.itypeId === 2)
          .forEach(item => this.evacuateItem(item, this.numItems(item)));
        break;
    }
  };

  gameParty.evacuateItem = function (item, amount) {
    this.evacuatedInventory().pushItem(item, amount);
    this.loseItem(item, amount, false);
  };

  gameParty.regainEvacuatedItems = function () {
    this.evacuatedInventory().popAllItems()
      .forEach(regain => this.gainItem(regain.item, regain.amount));
  };
}

Game_Party_EvacuateAllItemsMixIn(Game_Party.prototype);

type PopItem = {item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number};

class Game_EvacuatedInventory {
  _items: {
    [id: number]: number;
  };
  _weapons: {
    [id: number]: number;
  };
  _armors: {
    [id: number]: number;
  };

  constructor() {
    this.initialize();
  }

  initialize() {
    this._items = {};
    this._weapons = {};
    this._armors = {};
  }

  itemContainer(item: MZ.Item|MZ.Weapon|MZ.Armor): {
    [id: number]: number;
  } {
    if (DataManager.isItem(item)) {
      return this._items;
    } else if (DataManager.isWeapon(item)) {
      return this._weapons;
    } else {
      return this._armors;
    }
  }
  pushItem(item: MZ.Item|MZ.Weapon|MZ.Armor, amount: number): void {
    const container = this.itemContainer(item);
    if (!container[item.id]) {
      container[item.id] = 0;
    }
    container[item.id] += amount;
  }
  popAllItems(): PopItem[] {
    const result: PopItem[] = Object.keys(this._items).map((id): PopItem => {
      return {
        item: $dataItems[Number(id)],
        amount: this._items[Number(id)],
      };
    }).concat(Object.keys(this._weapons).map(id => {
      return {
        item: $dataWeapons[Number(id)],
        amount: this._weapons[Number(id)],
      };
    })).concat(Object.keys(this._armors).map(id => {
      return {
        item: $dataArmors[Number(id)],
        amount: this._armors[Number(id)],
      };
    }));
    this._items = {};
    this._weapons = {};
    this._armors = {};
    return result;
  }
}

type _Game_EvacuatedInventory = typeof Game_EvacuatedInventory;
declare global {
  var Game_EvacuatedInventory: _Game_EvacuatedInventory;
}
globalThis.Game_EvacuatedInventory = Game_EvacuatedInventory;
