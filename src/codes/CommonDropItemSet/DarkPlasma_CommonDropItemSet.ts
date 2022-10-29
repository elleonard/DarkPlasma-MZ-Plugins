/// <reference path="./CommonDropItemSet.d.ts" />

import { settings } from "./_build/DarkPlasma_CommonDropItemSet_parameters";

function Game_Troop_CommonDropItemSetMixIn(gameTroop: Game_Troop) {
  const _makeDropItems = gameTroop.makeDropItems;
  gameTroop.makeDropItems = function () {
    return _makeDropItems.call(this).concat(this.makeCommonDropItems());
  };

  gameTroop.isCommonItemDropSetEnabled = function () {
    return true;
  };

  gameTroop.makeCommonDropItems = function () {
    return this.isCommonItemDropSetEnabled() ? settings.dropItemSetList
      .filter((dropItemSet: DropItemSet) => dropItemSet.dropRate > Math.randomInt(100))
      .map((dropItemSet: DropItemSet) => {
        const dropItems: (MZ.Item | MZ.Weapon | MZ.Armor)[] = dropItemSet.items.map<(MZ.Item | MZ.Weapon | MZ.Armor)>(id => $dataItems[id])
          .concat(dropItemSet.weapons.map(id => $dataWeapons[id]))
          .concat(dropItemSet.armors.map(id => $dataArmors[id]));
        return dropItems[Math.randomInt(dropItems.length)];
      }) : [];
  };
}

Game_Troop_CommonDropItemSetMixIn(Game_Troop.prototype);
