import { pluginName } from './../../common/pluginName';
import { settings } from './_build/DarkPlasma_MaxItemCount_parameters';

const PLUGIN_COMMAND_NAME = {
  CHANGE_DEFAULT_MAX_ITEM_COUNT: 'changeDefaultMaxItemCount',
  CHANGE_MAX_ITEM_COUNT: 'changeMaxItemCount',
  CHANGE_MAX_WEAPON_COUNT: 'changeMaxWeaponCount',
  CHANGE_MAX_ARMOR_COUNT: 'changeMaxArmorCount',
};

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_DEFAULT_MAX_ITEM_COUNT, function (args) {
  $gameParty.changeDefaultMaxItemCount(Number(args.count));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_MAX_ITEM_COUNT, function (args) {
  $gameParty.changeMaxItemCount($dataItems[Number(args.id)], Number(args.count));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_MAX_WEAPON_COUNT, function (args) {
  $gameParty.changeMaxItemCount($dataWeapons[Number(args.id)], Number(args.count));
});

PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CHANGE_MAX_ARMOR_COUNT, function (args) {
  $gameParty.changeMaxItemCount($dataArmors[Number(args.id)], Number(args.count));
});

/**
 * 全アイテムの所持最大数をゲーム中に変更する
 * @param {number} count 変更後の最大数
 */
Game_Party.prototype.changeDefaultMaxItemCount = function (count) {
  this._defaultMaxItemCount = count;
  this.items()
    .filter((item) => this.hasMaxItems(item))
    .forEach((item) => this.setItemCountToMax(item));
};

/**
 * アイテムの所持最大数をゲーム中に変更する
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
 * @param {number} count 変更後の最大数
 */
Game_Party.prototype.changeMaxItemCount = function (item, count) {
  if (!this._maxItemCount) {
    this._maxItemCount = {};
  }
  const key = this.itemMaxCountKey(item);
  if (!key) {
    return;
  }
  this._maxItemCount[key] = count;
  if (this.hasMaxItems(item)) {
    this.setItemCountToMax(item);
  }
};

/**
 * 指定したアイテムの所持数を最大にする
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
 */
Game_Party.prototype.setItemCountToMax = function (item) {
  const container = this.itemContainer(item);
  if (container) {
    container[item.id] = this.maxItems(item);
    if (container[item.id] === 0) {
      delete container[item.id];
    }
  }
};

/**
 * ゲーム中に変更されたアイテムの所持最大数を返す
 * ゲーム中に変更されていない場合はnullを返す
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
 * @return {number|null}
 */
Game_Party.prototype.changedMaxItemCount = function (item) {
  if (!this._maxItemCount) {
    return null;
  }
  const key = this.itemMaxCountKey(item);
  if (!key || this._maxItemCount[key] === undefined) {
    return null;
  }
  return this._maxItemCount[key];
};

/**
 * アイテム所持最大数のキーを返す
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
 * @return {string|null}
 */
Game_Party.prototype.itemMaxCountKey = function (item) {
  if (DataManager.isItem(item)) {
    return `item_${item.id}`;
  }
  if (DataManager.isWeapon(item)) {
    return `weapon_${item.id}`;
  }
  if (DataManager.isArmor(item)) {
    return `armor_${item.id}`;
  }
  return null;
};

/**
 * アイテムの所持最大数を返す
 * @param {MZ.Item | MZ.Weapon | MZ.Armor} item アイテムデータ
 * @return {number}
 */
Game_Party.prototype.maxItems = function (item) {
  const changedMaxCount = this.changedMaxItemCount(item);
  if (changedMaxCount !== null) {
    return changedMaxCount;
  }
  if (item.meta.maxCount !== undefined) {
    return Number(item.meta.maxCount);
  }
  if (this._defaultMaxItemCount !== undefined) {
    return this._defaultMaxItemCount;
  }
  return settings.defaultMaxItemCount;
};

/**
 * アイテム最大所持数のうち、最も大きいものを返す
 * @return {number}
 */
Game_Party.prototype.maxOfMaxItemCount = function () {
  return $dataItems
    .filter((item) => !!item && item.meta.maxCount !== undefined)
    .map((item) => item.meta.maxCount)
    .concat(Object.values(this._maxItemCount || {}))
    .concat([settings.defaultMaxItemCount, this._defaultMaxItemCount || 0])
    .reduce((a, b) => Math.max(a, b), 0);
};

Window_ItemList.prototype.drawItemNumber = function (item, x, y, width) {
  if (this.needsNumber()) {
    this.drawText(':', x, y, width - this.textWidth($gameParty.maxOfMaxItemCount().toString()), 'right');
    this.drawText($gameParty.numItems(item), x, y, width, 'right');
  }
};
