/// <reference path="./RandomGainItem.d.ts" />

import { pluginName } from '../../common/pluginName';
import { command_randomGainItem, parseArgs_randomGainItem } from './_build/DarkPlasma_RandomGainItem_commands';

type RandomItem = {
  id: number;
  weight: number;
};

PluginManager.registerCommand(pluginName, command_randomGainItem, function (args) {
  const parsedArgs: {
    items: RandomItem[];
    weapons: RandomItem[];
    armors: RandomItem[];
    nameVariable: number;
  } = parseArgs_randomGainItem(args);
  const randomItems = parsedArgs.items.map(item => {
    return { ...item, kind: 0 };
  }).concat(parsedArgs.weapons.map(item => {
    return { ...item, kind: 1 };
  })).concat(parsedArgs.armors.map(item => {
    return { ...item, kind: 2 };
  }));
  const totalWeight = randomItems.reduce((result, current) => result + current.weight, 0);
  const lottery = Math.randomInt(totalWeight);
  let weight = 0;
  const resultItem = randomItems.find(randomItem => {
    weight += randomItem.weight;
    return lottery < weight;
  })!;

  const resultItemData = (() => {
    switch (resultItem.kind) {
      case 0:
        return $dataItems[resultItem.id];
      case 1:
        return $dataWeapons[resultItem.id];
      case 2:
        return $dataArmors[resultItem.id];
    }
    return undefined;
  })();

  if (resultItemData) {
    $gameParty.gainItem(resultItemData, 1);
    if (parsedArgs.nameVariable > 0) {
      $gameVariables.setValue(parsedArgs.nameVariable, resultItemData.name);
    }
  }
});
