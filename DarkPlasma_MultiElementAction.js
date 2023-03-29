// DarkPlasma_MultiElementAction 1.1.0
// Copyright (c) 2023 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/29 1.1.0 行動の攻撃属性一覧を取得するインターフェースを追加
 *            1.0.0 公開
 */

/*:
 * @plugindesc 複数の属性を持つスキル・アイテム
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.1.0
 * スキルやアイテムに属性を追加します。
 *
 * 属性を追加したいスキルやアイテムのメモ欄に
 * <additionalElements:(属性名)>
 * と記述してください。
 * 属性名はタイプで指定されている属性の名前です。
 *
 * 例えば、物理属性のスキルに火属性を追加したい場合は
 * <additionalElements:火>
 * と記述します。
 *
 * 複数の属性を追加する場合は、カンマで区切って追加します。
 * <additionalElements:火,氷,雷>
 *
 * システムのタイプに存在しない名前を設定した場合、
 * 通常攻撃属性が追加されます。
 *
 * 実際のダメージ計算に利用される属性は、
 * RPGツクールMZのデフォルトでは最も有効な属性のみになります。
 * 本プラグインで追加した属性全てをダメージ計算に利用したい場合、
 * DarkPlasma_MultiElementRate の利用を検討してください。
 */

(() => {
  'use strict';

  function Game_Action_MultiElementActionMixIn(gameAction) {
    gameAction.calcElementRate = function (target) {
      return this.elementsMaxRate(target, this.actionAttackElements());
    };
    gameAction.actionAttackElements = function () {
      const additionalElementIds = String(this.item().meta.additionalElements || '')
        .split(',')
        .map((elementName) => $dataSystem.elements.indexOf(elementName));
      if (additionalElementIds.some((elementId) => elementId < 0) || this.item().damage.elementId < 0) {
        return this.subject()
          .attackElements()
          .concat([this.item().damage.elementId], additionalElementIds)
          .filter((elementId) => elementId >= 0);
      }
      return additionalElementIds.concat([this.item().damage.elementId]);
    };
  }
  Game_Action_MultiElementActionMixIn(Game_Action.prototype);
})();
