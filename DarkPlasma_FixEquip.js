// DarkPlasma_FixEquip 1.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2020/10/30 1.0.0 公開
 */

/*:ja
 * @plugindesc 装備固定モードを実現する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param fixEquips
 * @desc スイッチと装備タイプ一覧の組を設定します。
 * @text 固定装備設定
 * @type struct<FixEquip>[]
 * @default []
 *
 * @help
 * version: 1.0.2
 * 装備固定モードを実現します。
 *
 * プラグインパラメータにスイッチと装備タイプ一覧の組を登録し、
 * 登録したスイッチをONにすると、対応する装備タイプが変更できなくなります。
 */
/*~struct~FixEquip:
 * @param switchId
 * @desc 装備固定モードを表すスイッチを設定します。
 * @text スイッチ
 * @type switch
 * @default 0
 *
 * @param equipTypes
 * @desc 装備固定モードで固定する装備タイプ一覧を設定します。
 * @text 装備タイプ一覧
 * @type number[]
 * @default []
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    fixEquips: JSON.parse(pluginParameters.fixEquips || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          switchId: Number(parsed.switchId || 0),
          equipTypes: JSON.parse(parsed.equipTypes || '[]').map((e) => {
            return Number(e || 0);
          }),
        };
      })(e || '{}');
    }),
  };

  const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
  Game_Actor.prototype.isEquipChangeOk = function (slotId) {
    return _Game_Actor_isEquipChangeOk.call(this, slotId) && !this.isEquipTypeFixed(this.equipSlots()[slotId]);
  };

  Game_Actor.prototype.isEquipTypeFixed = function (etypeId) {
    return settings.fixEquips
      .filter((fixEquip) => fixEquip.switchId > 0 && $gameSwitches.value(fixEquip.switchId))
      .some((fixEquip) => fixEquip.equipTypes.includes(etypeId));
  };
})();
