import { settings } from './_build/DarkPlasma_BattleItemVisibility_parameters';

const _DataManager_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function (data) {
  _DataManager_extractMetadata.call(this, data);
  if (data.meta.VisibleInBattle !== undefined) {
    data.visibleInBattle = true;
  }
};

const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
Window_BattleItem.prototype.includes = function (item) {
  if (!item) {
    return false;
  }
  const usableSecretItemCondition = settings.showUsableSecretItems || (item.itypeId !== 3 && item.itypeId !== 4);
  return (
    (_Window_BattleItem_includes.call(this, item) && usableSecretItemCondition) ||
    (settings.showOnlyMenuItems && DataManager.isItem(item) && item.itypeId === 1 && item.occasion === 2) ||
    (settings.showUnusableItems && DataManager.isItem(item) && item.itypeId === 1 && item.occasion === 3) ||
    (settings.showUnusableSecretItemsA &&
      DataManager.isItem(item) &&
      item.itypeId === 3 &&
      (item.occasion === 2 || item.occasion === 3)) ||
    (settings.showUnusableSecretItemsB &&
      DataManager.isItem(item) &&
      item.itypeId === 4 &&
      (item.occasion === 2 || item.occasion === 3)) ||
    (settings.showWeapons && DataManager.isWeapon(item)) ||
    (settings.showArmors && DataManager.isArmor(item)) ||
    item.visibleInBattle
  );
};
