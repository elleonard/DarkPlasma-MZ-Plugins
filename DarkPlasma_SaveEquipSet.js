// DarkPlasma_SaveEquipSet 1.0.0
// Copyright (c) 2022 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/04/22 1.0.0 公開
 */

/*:ja
 * @plugindesc パーティメンバーの装備セットを記録する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @command saveEquipSet
 * @text 装備セットを記録する
 * @desc 現在のパーティメンバーの装備セットを記録します。
 *
 * @command loadEquipSet
 * @text 装備セットを復元する
 * @desc 記録した装備セットを現在のパーティメンバーに復元します。
 *
 * @help
 * version: 1.0.0
 * パーティメンバーの装備セットを記録し、復元するプラグインコマンドを提供します。
 *
 * 以下に該当する場合、復元時にその装備は無視され、復元されません。
 * - 記録したセットの中に手放した装備がある
 * - 記録したセットの中に装備不可な装備がある
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const command_saveEquipSet = 'saveEquipSet';

  const command_loadEquipSet = 'loadEquipSet';

  PluginManager.registerCommand(pluginName, command_saveEquipSet, function () {
    $gameParty.allMembers().forEach((actor) => actor.saveEquipSet());
  });

  PluginManager.registerCommand(pluginName, command_loadEquipSet, function () {
    /**
     * 全員の装備を外してから、所持しているものの中で記録を復元する
     */
    $gameParty.allMembers().forEach((actor) => actor.clearEquipments());
    $gameParty.allMembers().forEach((actor) => actor.loadEquipSet());
  });

  class Game_EquipSlot {
    /**
     * @param {number} slotId
     * @param {MZ.Weapon | MZ.Armor} item
     */
    constructor(slotId, item) {
      this._slotId = slotId;
      this._item = item;
    }

    get slotId() {
      return this._slotId;
    }

    get item() {
      return this._item;
    }
  }

  globalThis.Game_EquipSlot = Game_EquipSlot;

  /**
   * @param {Game_Actor.prototype} gameActor
   */
  function Game_Actor_SaveEquipSetMixIn(gameActor) {
    gameActor.saveEquipSet = function () {
      this._equipSet = this.equips().map((equip, slotId) => new Game_EquipSlot(slotId, equip));
    };

    gameActor.loadEquipSet = function () {
      if (this._equipSet) {
        this._equipSet
          .filter(
            (equipSlot) =>
              $gameParty.hasItem(equipSlot.item) &&
              this.canEquip(equipSlot.item) &&
              this.isEquipChangeOk(equipSlot.slotId)
          )
          .forEach((equipSlot) => this.changeEquip(equipSlot.slotId, equipSlot.item));
      }
    };
  }

  Game_Actor_SaveEquipSetMixIn(Game_Actor.prototype);
})();
