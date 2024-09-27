// DarkPlasma_SelfDestructingEffect 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/09/27 1.0.0 公開
 */

/*:
 * @plugindesc 使用効果 自滅
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.0
 * 使用効果 自滅を実装します。
 * この使用効果をスキルやアイテムに設定すると、使用者を戦闘不能にします。
 *
 * 以下のメモタグで設定することができます。
 * <selfDestructing>
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const selfDestructingEffect = uniqueEffectCodeCache.allocate(pluginName, 0);
  function DataManager_SelfDestructingMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('effects' in data && data.meta.selfDestructing) {
        data.effects.push({
          code: selfDestructingEffect.code,
          dataId: 0,
          value1: 0,
          value2: 0,
        });
      }
    };
  }
  DataManager_SelfDestructingMixIn(DataManager);
  function Game_Action_SelfDestructingMixIn(gameAction) {
    const _testItemEffect = gameAction.testItemEffect;
    gameAction.testItemEffect = function (target, effect) {
      if (effect.code === selfDestructingEffect.code) {
        return this.subject().isAlive();
      }
      return _testItemEffect.call(this, target, effect);
    };
    const _applyItemEffect = gameAction.applyItemEffect;
    gameAction.applyItemEffect = function (target, effect) {
      if (effect.code === selfDestructingEffect.code) {
        this.subject().die();
        this.subject().refresh();
        this.subject().performCollapse();
      }
      _applyItemEffect.call(this, target, effect);
    };
  }
  Game_Action_SelfDestructingMixIn(Game_Action.prototype);
})();
