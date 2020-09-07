// DarkPlasma_BattleItemVisibility 2.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 戦闘中のアイテムリストに表示するものを制御する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/RPGtkoolMZ-Plugins
 *
 * @param showOnlyMenuItems
 * @desc メニュー画面のみ使用可能なアイテムを表示します
 * @text メニュー画面アイテムを表示
 * @type boolean
 * @default false
 *
 * @param showUnusableItems
 * @desc 使用不可アイテムを表示します
 * @text 使用不可アイテムを表示
 * @type boolean
 * @default false
 *
 * @param showWeapon
 * @desc 武器を表示します
 * @text 武器を表示
 * @type boolean
 * @default false
 *
 * @param showArmors
 * @desc 防具を表示します
 * @text 防具を表示
 * @type boolean
 * @default false
 *
 * @param showImportantItems
 * @desc 大事なものを表示します
 * @text 大事なものを表示
 * @type boolean
 * @default false
 *
 * @param showUsableSecretItems
 * @desc 戦闘中に使用可能な隠しアイテムを表示します
 * @text 使用可能隠しアイテムを表示
 * @type boolean
 * @default false
 *
 * @param showUnusableSecretItemsA
 * @desc 戦闘中に使用不可能な隠しアイテムAを表示します
 * @text 使用不可隠しアイテムAを表示
 * @type boolean
 * @default false
 *
 * @param showUnusableSecretItemsB
 * @desc 戦闘中に使用不可能な隠しアイテムBを表示します
 * @text 使用不可隠しアイテムBを表示
 * @type boolean
 * @default false
 *
 * @help
 * 戦闘中のアイテムコマンドで表示されるアイテム一覧に表示するアイテムを設定します。
 * プラグインパラメータで種別ごとに表示するものを設定できる他、
 * アイテムのメモ欄に以下のように入力したアイテムを表示します。
 *
 * <VisibleInBattle>
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    showOnlyMenuItems: String(pluginParameters.showOnlyMenuItems || false) === 'true',
    showUnusableItems: String(pluginParameters.showUnusableItems || false) === 'true',
    showWeapon: String(pluginParameters.showWeapon || false) === 'true',
    showArmors: String(pluginParameters.showArmors || false) === 'true',
    showImportantItems: String(pluginParameters.showImportantItems || false) === 'true',
    showUsableSecretItems: String(pluginParameters.showUsableSecretItems || false) === 'true',
    showUnusableSecretItemsA: String(pluginParameters.showUnusableSecretItemsA || false) === 'true',
    showUnusableSecretItemsB: String(pluginParameters.showUnusableSecretItemsB || false) === 'true',
  };

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if (data.meta.VisibleInBattle !== undefined) {
      data.visibleInBattle = true;
    }
  };

  const _Window_BattleItem_includes = Window_BattleItem.prototype.includes;
  Window_BattleItem.prototype.includes = function (item) {
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
      settings.showWeapons ||
      (settings.showArmors && DataManager.isArmor(item)) ||
      (item && item.visibleInBattle)
    );
  };
})();
