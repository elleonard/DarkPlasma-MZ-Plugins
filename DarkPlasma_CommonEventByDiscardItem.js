// DarkPlasma_CommonEventByDiscardItem 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/01/21 1.0.0 公開
 */

/*:
 * @plugindesc アイテムを捨てたときにコモンイベントを実行する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_DiscardItemCommand
 *
 * @param itemDiscardCommonEvent
 * @desc アイテムを捨てたときに実行するコモンイベントを設定します。
 * @text アイテムコモンイベント
 * @type common_event
 * @default 0
 *
 * @param weaponDiscardCommonEvent
 * @desc 武器を捨てたときに実行するコモンイベントを設定します。
 * @text 武器コモンイベント
 * @type common_event
 * @default 0
 *
 * @param armorDiscardCommonEvent
 * @desc 防具を捨てたときに実行するコモンイベントを設定します。
 * @text 防具コモンイベント
 * @type common_event
 * @default 0
 *
 * @param discardItemVariable
 * @desc 捨てたアイテムのIDを指定した変数に保存します。
 * @text 捨てたアイテム変数
 * @type variable
 * @default 0
 *
 * @help
 * version: 1.0.0
 * DarkPlasma_DiscardItemCommandの捨てるコマンドによってアイテムを捨てた際に
 * コモンイベントを実行します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_DiscardItemCommand version:1.0.0
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    itemDiscardCommonEvent: Number(pluginParameters.itemDiscardCommonEvent || 0),
    weaponDiscardCommonEvent: Number(pluginParameters.weaponDiscardCommonEvent || 0),
    armorDiscardCommonEvent: Number(pluginParameters.armorDiscardCommonEvent || 0),
    discardItemVariable: Number(pluginParameters.discardItemVariable || 0),
  };

  function Scene_Item_CommonEventByDiscardItemMixIn(sceneItem) {
    const _discardItem = sceneItem.discardItem;
    sceneItem.discardItem = function () {
      const item = this.item();
      $gameVariables.setValue(settings.discardItemVariable, item.id);
      _discardItem.call(this);
      if (DataManager.isItem(item)) {
        $gameTemp.reserveCommonEvent(settings.itemDiscardCommonEvent);
      } else if (DataManager.isWeapon(item)) {
        $gameTemp.reserveCommonEvent(settings.weaponDiscardCommonEvent);
      } else if (DataManager.isArmor(item)) {
        $gameTemp.reserveCommonEvent(settings.armorDiscardCommonEvent);
      }
      this.checkCommonEvent();
    };
  }
  Scene_Item_CommonEventByDiscardItemMixIn(Scene_Item.prototype);
})();
