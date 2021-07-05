// DarkPlasma_ClearEquip 2.1.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.1.2 MZ 1.3.2に対応
 * 2021/06/22 2.1.1 サブフォルダからの読み込みに対応
 * 2020/10/30 2.1.0 プラグインコマンドを追加
 * 2020/10/10 2.0.2 リファクタ
 * 2020/09/29 2.0.1 プラグインコマンドに説明を追加
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 装備をすべてはずす
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param clearEquipWhenMemberIsOut
 * @desc パーティから外れたときに装備をすべてはずすかどうか
 * @text パーティアウト時装備はずす
 * @type boolean
 * @default false
 *
 * @command clearEquip
 * @text 装備をはずす
 * @desc 指定したアクターの装備をはずします。
 * @arg actorId
 * @text アクター
 * @type actor
 * @arg equipTypes
 * @text 装備タイプID
 * @desc はずす装備タイプ一覧
 * @type number[]
 *
 * @command clearAllMemberEquip
 * @text 全員の装備をはずす
 * @desc パーティメンバー全員の装備をはずします。
 * @arg equipTypes
 * @text 装備タイプID
 * @desc はずす装備タイプ一覧
 * @type number[]
 *
 * @command clearAllEquip
 * @text 装備をすべてはずす
 * @desc 指定したアクターの装備をすべてはずします。
 * @arg actorId
 * @text アクター
 * @type actor
 *
 * @command clearAllMemberAllEquip
 * @text 全員の装備をすべてはずす
 * @desc パーティメンバー全員の装備をすべてはずします。
 *
 * @help
 * version: 2.1.2
 * プラグインパラメータの設定をONにしておくと、
 * パーティからメンバーが脱退したとき、
 * そのメンバーの装備を固定装備を除いてすべてはずします。
 *
 * プラグインコマンドによって、指定アクターやパーティ全員の装備を
 * 装備タイプを指定したり全部位について、固定装備を除いてはずすことができます。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    clearEquipWhenMemberIsOut: String(pluginParameters.clearEquipWhenMemberIsOut || false) === 'true',
  };

  const PLUGIN_COMMAND_NAME = {
    CLEAR_EQUIP: 'clearEquip',
    CLEAR_ALL_MEMBER_EQUIP: 'clearAllMemberEquip',
    CLEAR_ALL_EQUIP: 'clearAllEquip',
    CLEAR_ALL_MEMBER_ALL_EQUIP: 'clearAllMemberAllEquip',
  };

  const _Game_Party_removeActor = Game_Party.prototype.removeActor;
  Game_Party.prototype.removeActor = function (actorId) {
    // パーティメンバーがはずれたときに装備をすべてはずす
    if (settings.clearEquipWhenMemberIsOut && this._actors.includes(actorId)) {
      $gameActors.actor(actorId).clearEquipments();
    }
    _Game_Party_removeActor.call(this, actorId);
  };

  /**
   * 指定した装備タイプIDの装備を可能であればはずす
   * @param {number[]} equipTypes 装備タイプIDリスト
   */
  Game_Actor.prototype.clearEquipByEquipTypes = function (equipTypes) {
    [...Array(this.equipSlots().length).keys()]
      .filter((slotId) => {
        return equipTypes.includes(this.equipSlots()[slotId]) && this.isEquipChangeOk(slotId);
      })
      .forEach((slotId) => this.changeEquip(slotId, null));
  };

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_EQUIP, function (args) {
    const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
    if (actor) {
      const equipTypes = JSON.parse(args.equipTypes).map((equipType) => Number(equipType));
      actor.clearEquipByEquipTypes(equipTypes);
    }
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_EQUIP, function (args) {
    const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
    if (actor) {
      actor.clearEquipments();
    }
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_EQUIP, function (args) {
    const equipTypes = JSON.parse(args.equipTypes).map((equipType) => Number(equipType));
    $gameParty.members().forEach((actor) => actor.clearEquipByEquipTypes(equipTypes));
  });

  PluginManager.registerCommand(pluginName, PLUGIN_COMMAND_NAME.CLEAR_ALL_MEMBER_ALL_EQUIP, function () {
    $gameParty.members().forEach((actor) => actor.clearEquipments());
  });
})();
