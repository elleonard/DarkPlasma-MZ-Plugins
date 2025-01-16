/// <reference path="./LoseAllItems.d.ts" />

import { pluginName } from '../../../common/pluginName';
import { command_LoseAllItems, parseArgs_LoseAllItems } from '../config/_build/DarkPlasma_LoseAllItems_commands';

PluginManager.registerCommand(pluginName, command_LoseAllItems, function(args) {
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

function Game_Party_LoseAllItemsMixIn(gameParty: Game_Party) {
  gameParty.loseAllItems = function (category) {
    switch (category) {
      case "item":
        this.items()
          .filter(item => item.itypeId !== 2)
          .forEach(item => this.loseItem(item, this.numItems(item), false));
        break;
      case "weapon":
        this.weapons()
          .forEach(weapon => this.loseItem(weapon, this.numItems(weapon), false));
        break;
      case "armor":
        this.armors()
          .forEach(armor => this.loseItem(armor, this.numItems(armor), false));
        break;
      case "keyItem":
        this.items()
          .filter(item => item.itypeId === 2)
          .forEach(item => this.loseItem(item, this.numItems(item), false));
        break;
    }
  };
}

Game_Party_LoseAllItemsMixIn(Game_Party.prototype);
