/// <reference path="./MaxItemCount.d.ts" />
import { pluginName } from './../../common/pluginName';
import { command_changeDefaultMaxItemCount, command_changeMaxArmorCount, command_changeMaxItemCount, command_changeMaxWeaponCount, parseArgs_changeDefaultMaxItemCount, parseArgs_changeMaxArmorCount, parseArgs_changeMaxItemCount, parseArgs_changeMaxWeaponCount } from './_build/DarkPlasma_MaxItemCount_commands';
import { settings } from './_build/DarkPlasma_MaxItemCount_parameters';

PluginManager.registerCommand(pluginName, command_changeDefaultMaxItemCount, function (args) {
  const parsedArgs = parseArgs_changeDefaultMaxItemCount(args);
  $gameParty.changeDefaultMaxItemCount(parsedArgs.count);
});

PluginManager.registerCommand(pluginName, command_changeMaxItemCount, function (args) {
  const parsedArgs = parseArgs_changeMaxItemCount(args);
  $gameParty.changeMaxItemCount($dataItems[parsedArgs.id], parsedArgs.count);
});

PluginManager.registerCommand(pluginName, command_changeMaxWeaponCount, function (args) {
  const parsedArgs = parseArgs_changeMaxWeaponCount(args);
  $gameParty.changeMaxItemCount($dataWeapons[parsedArgs.id], parsedArgs.count);
});

PluginManager.registerCommand(pluginName, command_changeMaxArmorCount, function (args) {
  const parsedArgs = parseArgs_changeMaxArmorCount(args);
  $gameParty.changeMaxItemCount($dataArmors[parsedArgs.id], parsedArgs.count);
});

function Game_Party_MaxItemCountMixIn(gameParty: Game_Party) {
  /**
   * 全アイテムの所持最大数をゲーム中に変更する
   * @param {number} count 変更後の最大数
   */
  gameParty.changeDefaultMaxItemCount = function (this: Game_Party, count: number): void {
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
  gameParty.changeMaxItemCount = function (this: Game_Party, item: MZ.Item|MZ.Weapon|MZ.Armor, count: number): void {
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
  gameParty.setItemCountToMax = function (this: Game_Party, item: MZ.Item|MZ.Weapon|MZ.Armor) {
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
  gameParty.changedMaxItemCount = function (this: Game_Party, item: MZ.Item|MZ.Weapon|MZ.Armor) {
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
  gameParty.itemMaxCountKey = function (this: Game_Party, item: MZ.Item|MZ.Weapon|MZ.Armor) {
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
  gameParty.maxItems = function (this: Game_Party, item: MZ.Item|MZ.Weapon|MZ.Armor) {
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
  gameParty.maxOfMaxItemCount = function (this: Game_Party) {
    return $dataItems
      .filter((item) => !!item && item.meta.maxCount !== undefined)
      .map((item) => Number(item.meta.maxCount))
      .concat(Object.values(this._maxItemCount || {}))
      .concat([settings.defaultMaxItemCount, this._defaultMaxItemCount || 0])
      .reduce((a, b) => Math.max(a, b), 0);
  };
}

Game_Party_MaxItemCountMixIn(Game_Party.prototype);

Window_ItemList.prototype.drawItemNumber = function (this: Window_ItemList, item, x, y, width) {
  if (this.needsNumber()) {
    this.drawText(':', x, y, width - this.textWidth($gameParty.maxOfMaxItemCount().toString()), 'right');
    this.drawText(`${$gameParty.numItems(item)}`, x, y, width, 'right');
  }
};
