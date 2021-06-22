// DarkPlasma_SkillCostExtensionTraits 1.0.1
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/01/11 1.0.0 公開
 */

/*:ja
 * @plugindesc スキルコスト拡張プラグインに関する特徴設定
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_SkillCostExtension
 * @orderAfter DarkPlasma_SkillCostExtension
 *
 * @help
 * version: 1.0.1
 * スキルコスト拡張プラグインに関する特徴設定を追加します。
 *
 * アクター、職業、装備のメモ欄に下記の記法で設定を追加します。
 *
 * <hpCostRate:n>
 *  HP消費率
 *  スキルで消費するHP量に割合をかけます。デフォルトはn=1です。
 */

(() => {
  'use strict';

  Game_BattlerBase.prototype.hpCostRate = function () {
    return this.traitObjects()
      .reduce((result, object) => result.concat(object.meta.hpCostRate), [])
      .filter((hpCostRate) => !!hpCostRate)
      .reduce((result, hpCostRate) => result * Number(hpCostRate), 1);
  };
})();
