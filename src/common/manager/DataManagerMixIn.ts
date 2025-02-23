/// <reference path="./DataManagerMixIn.d.ts" />

const KIND = {
  ITEM: 1,
  WEAPON: 2,
  ARMOR: 3,
};

export function DataManagerMixIn(dataManager: typeof DataManager) {
  dataManager.kindOf = function (data) {
    if (DataManager.isItem(data)) {
      return KIND.ITEM;
    } else if (DataManager.isWeapon(data)) {
      return KIND.WEAPON;
    } else if (DataManager.isArmor(data)) {
      return KIND.ARMOR;
    } else {
      return undefined;
    }
  };

  dataManager.dataObject = function (kind, dataId) {
    switch (kind) {
      case KIND.ITEM:
        return $dataItems[dataId];
      case KIND.WEAPON:
        return $dataWeapons[dataId];
      case KIND.ARMOR:
        return $dataArmors[dataId];
      default:
        return null;
    }
  };
}
