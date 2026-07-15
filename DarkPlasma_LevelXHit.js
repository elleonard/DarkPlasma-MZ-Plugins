// DarkPlasma_LevelXHit 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/07/15 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc レベルが特定数値の倍数の対象にのみ必中する命中タイプ
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueHitType
 *
 * @help
 * version: 1.0.0
 * スキル・アイテムの命中タイプに
 * レベルが特定の数値の倍数の対象にのみ必中 を追加します。
 *
 * 対象スキル・アイテムのメモ欄に以下のように記述します。
 * <levelXHit:3>
 * レベルが3の倍数の対象に必中し、
 * それ以外の対象には命中しない命中タイプになります。
 *
 * この命中タイプは、対象がレベルを持たない場合には命中しません。
 * 敵キャラは本来レベルを持ちませんが、
 * 敵キャラにレベルを持たせるプラグインを使うことで
 * 敵キャラに対しても有効にすることができます。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueHitType version:1.0.0
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const levelXHitTypes = {};
  function DataManager_LevelXHitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('hitType' in data && data.meta.levelXHit) {
        const base = Number(data.meta.levelXHit || 0);
        if (base === 0) {
          throw Error(`レベル0の倍数指定はできません。 ${data.name}`);
        }
        const hitType = uniqueHitTypeIdCache.allocate(pluginName, base, `レベルが${base}の倍数に必中`);
        if (!levelXHitTypes[base]) {
          levelXHitTypes[base] = hitType;
        }
        data.hitType = hitType.id;
      }
    };
  }
  DataManager_LevelXHitMixIn(DataManager);
  function Game_Action_LevelXHitMixIn(gameAction) {
    const _itemHit = gameAction.itemHit;
    gameAction.itemHit = function (target) {
      const base = Object.keys(levelXHitTypes).find((base) => this.isLevelXHit(Number(base)));
      if (base && target.level !== undefined && target.level % Number(base) === 0) {
        return 1;
      }
      return _itemHit.call(this, target);
    };
    gameAction.isLevelXHit = function (base) {
      return this.isHitType(levelXHitTypes[base].id);
    };
  }
  Game_Action_LevelXHitMixIn(Game_Action.prototype);
})();
