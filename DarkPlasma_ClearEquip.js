// DarkPlasma_ClearEquip 2.0.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @text アクターの装備をすべてはずす
 * @desc 指定したアクターの装備をすべてはずします。
 * @arg actorId
 * @text アクター
 * @type actor
 *
 * @help
 * プラグインパラメータの設定をONにしておくと、パーティからメンバーがはずれたとき、
 * そのメンバーの装備をすべてはずします。
 *
 * プラグインコマンド: アクターの装備をすべてはずす を提供します。
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

  const _Game_Party_removeActor = Game_Party.prototype.removeActor;
  Game_Party.prototype.removeActor = function (actorId) {
    // パーティメンバーがはずれたときに装備をすべてはずす
    if (settings.clearEquipWhenMemberIsOut && this._actors.contains(actorId)) {
      $gameActors.actor(actorId).clearEquipments();
    }
    _Game_Party_removeActor.call(this, actorId);
  };

  PluginManager.registerCommand(pluginName, 'clearEquip', (args) => {
    const actor = $gameParty.members().find((actor) => actor.actorId() === Number(args.actorId));
    if (actor) {
      actor.clearEquipments();
    }
  });
})();
