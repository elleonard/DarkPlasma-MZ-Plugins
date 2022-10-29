/// <reference path="./CommonDropItemSet.d.ts" />

import { settings } from "./_build/DarkPlasma_CommonDropItemSet_parameters";

function makeDropItems(): (MZ.Item | MZ.Weapon | MZ.Armor | null)[] {
  return settings.dropItemSetList
      .filter((dropItemSet: DropItemSet) => dropItemSet.dropRate > Math.randomInt(100))
      .map((dropItemSet: DropItemSet) => {
        const dropItems: (MZ.Item | MZ.Weapon | MZ.Armor)[] = dropItemSet.items.map<(MZ.Item | MZ.Weapon | MZ.Armor)>(id => $dataItems[id])
          .concat(dropItemSet.weapons.map(id => $dataWeapons[id]))
          .concat(dropItemSet.armors.map(id => $dataArmors[id]));
        return dropItems[Math.randomInt(dropItems.length)];
      });
}

function Game_Troop_CommonDropItemSetMixIn(gameTroop: Game_Troop) {
  const _makeDropItems = gameTroop.makeDropItems;
  gameTroop.makeDropItems = function () {
    return _makeDropItems.call(this).concat(this.makeCommonDropItems());
  };

  gameTroop.isCommonItemDropSetEnabled = function () {
    return !settings.dropOneByOneEnemy;
  };

  gameTroop.makeCommonDropItems = function () {
    return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
  };
}

Game_Troop_CommonDropItemSetMixIn(Game_Troop.prototype);

function Game_Enemy_CommonDropItemSetMixIn(gameEnemy: Game_Enemy) {
  const _makeDropItems = gameEnemy.makeDropItems;
  gameEnemy.makeDropItems = function () {
    return _makeDropItems.call(this).concat(this.makeCommonDropItems());
  };

  gameEnemy.isCommonItemDropSetEnabled = function () {
    return settings.dropOneByOneEnemy;
  };

  gameEnemy.makeCommonDropItems = function () {
    return this.isCommonItemDropSetEnabled() ? makeDropItems() : [];
  };
}

Game_Enemy_CommonDropItemSetMixIn(Game_Enemy.prototype);
