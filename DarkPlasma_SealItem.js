// DarkPlasma_SealItem 1.0.2
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/03/13 1.0.0 公開
 */

/*:ja
 * @plugindesc アイテムを封印する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.2
 * メモ欄に特定の書式で記述することにより、特定のアイテムを使用不能にします。
 * <sealItems:1,2>
 *  アイテムID1及び2のアイテムが使用できなくなります。
 * <sealHealItem>
 *  HPまたはMP回復アイテムが使用不能になります。
 * <sealResurrectionItem>
 *  戦闘不能解除の効果を持つアイテムが使用不能になります。
 *
 * アクターのメモ欄: 対象のアクターは使用不能
 * 職業のメモ欄: 対象の職業のアクターは使用不能
 * 武器・防具のメモ欄: 対象を装備したアクターは使用不能
 * ステート: 対象ステートにかかったアクターは使用不能
 */

(() => {
  'use strict';

  const _Game_Actor_meetsItemConditions = Game_Actor.prototype.meetsItemConditions;
  Game_Actor.prototype.meetsItemConditions = function (item) {
    return _Game_Actor_meetsItemConditions.call(this, item) && !this.isItemSealed(item);
  };

  Game_Actor.prototype.isItemSealed = function (item) {
    return this.traitObjects().some((object) => {
      return (
        DataManager.sealItems(object).includes(item.id) ||
        (object.meta.sealHealItem && DataManager.isHealItem(item)) ||
        (object.meta.sealResurrectionItem && DataManager.isResurrectionItem(item))
      );
    });
  };

  /**
   * 特徴を持つオブジェクトから、封印アイテムID一覧を取得する
   * @param { {traits: MZ.Trait[]} } object 特徴を持つオブジェクト
   * @return {Number[]}
   */
  DataManager.sealItems = function (object) {
    return object.meta.sealItems ? object.meta.sealItems.split(',').map((itemId) => Number(itemId)) : [];
  };

  /**
   * ダメージタイプが回復であるようなアイテムか
   * @param {MZ.Item} item アイテムデータ
   * @return {boolean}
   */
  DataManager.isHealItem = function (item) {
    return [3, 4].includes(item.damage.type);
  };

  /**
   * 戦闘不能を解除する効果を持つアイテムか
   * @param {MZ.Item} item アイテムデータ
   * @return {boolean}
   */
  DataManager.isResurrectionItem = function (item) {
    return item.effects.some(
      (effect) =>
        effect.code === Game_Action.EFFECT_REMOVE_STATE && effect.dataId === Game_BattlerBase.prototype.deathStateId()
    );
  };
})();
