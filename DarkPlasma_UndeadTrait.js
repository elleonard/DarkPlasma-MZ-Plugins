// DarkPlasma_UndeadTrait 1.0.0
// Copyright (c) 2026 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/05/04 1.0.0 最初のバージョン
 */

/*:
 * @plugindesc 回復・即死を反転する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitDataId
 * @orderAfter DarkPlasma_AllocateUniqueTraitDataId
 *
 * @help
 * version: 1.0.0
 * 各種回復や即死を反転する特徴特殊フラグを提供します。
 *
 * <reverseHpRecover>
 * 得られるHP回復をダメージに変換します。
 * 以下が反転の対象です。
 * - ダメージタイプ「HP回復」による回復
 * - 使用効果「HP回復」による回復
 * - ターン終了時の「HP再生率」による回復・ダメージ
 *
 * <reverseMpRecover>
 * 得られるMP回復をMPダメージに変換します。
 * 以下が反転の対象です。
 * - ダメージタイプ「MP回復」による回復
 * - 使用効果「MP回復」による回復
 * - ターン終了時の「MP再生率」による回復・ダメージ
 *
 * <reverseHpDrain>
 * ダメージタイプ「HP吸収」を受ける際の回復・ダメージを反転します。
 *
 * <reverseMpDrain>
 * ダメージタイプ「MP吸収」を受ける際の回復・ダメージを反転します。
 *
 * <reverseDeathState>
 * 戦闘不能を直接付加される場合、
 * 戦闘不能にならずにHPを全回復します。
 *
 * <antiReverse>
 * この行動は、反転特徴を無視します。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitDataId version:1.0.2
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_AllocateUniqueTraitDataId
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const reverseHpRecoverSpecialFlagId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPECIAL_FLAG,
    0,
    'HP回復反転',
  );
  const reverseMpRecoverSpecialFlagId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPECIAL_FLAG,
    1,
    'MP回復反転',
  );
  const reverseHpDrainSpecialFlagId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPECIAL_FLAG,
    2,
    'HP吸収反転',
  );
  const reverseMpDrainSpecialFlagId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPECIAL_FLAG,
    3,
    'MP吸収反転',
  );
  const reverseDeathStateSpecialFlagId = uniqueTraitDataIdCache.allocate(
    pluginName,
    Game_BattlerBase.TRAIT_SPECIAL_FLAG,
    4,
    '即死反転',
  );
  const X_PARAM_ID = {
    HP_REGENERATION_RATE: 7,
    MP_REGENERATION_RATE: 8,
  };
  function DataManager_UndeadTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        if (data.meta.reverseHpRecover) {
          data.traits.push({
            code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
            dataId: reverseHpRecoverSpecialFlagId.id,
            value: 0,
          });
        }
        if (data.meta.reverseMpRecover) {
          data.traits.push({
            code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
            dataId: reverseMpRecoverSpecialFlagId.id,
            value: 0,
          });
        }
        if (data.meta.reverseHpDrain) {
          data.traits.push({
            code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
            dataId: reverseHpDrainSpecialFlagId.id,
            value: 0,
          });
        }
        if (data.meta.reverseMpDrain) {
          data.traits.push({
            code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
            dataId: reverseMpDrainSpecialFlagId.id,
            value: 0,
          });
        }
        if (data.meta.reverseDeathState) {
          data.traits.push({
            code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
            dataId: reverseDeathStateSpecialFlagId.id,
            value: 0,
          });
        }
      }
    };
  }
  DataManager_UndeadTraitMixIn(DataManager);
  function Game_Action_UndeadTraitMixIn(gameAction) {
    const _makeDamageValue = gameAction.makeDamageValue;
    gameAction.makeDamageValue = function (target, critical) {
      const value = _makeDamageValue.call(this, target, critical);
      if (!this.isAntiReverse()) {
        if (this.isHpRecover() && target.specialFlag(reverseHpRecoverSpecialFlagId.id)) {
          return -value;
        }
        if (this.isMpRecover() && target.specialFlag(reverseMpRecoverSpecialFlagId.id)) {
          return -value;
        }
        if (this.isHpEffect() && this.isDrain() && target.specialFlag(reverseHpDrainSpecialFlagId.id)) {
          return -value;
        }
        if (this.isMpEffect() && this.isDrain() && target.specialFlag(reverseMpDrainSpecialFlagId.id)) {
          return -value;
        }
      }
      return value;
    };
    const _itemEffectRecoverHp = gameAction.itemEffectRecoverHp;
    gameAction.itemEffectRecoverHp = function (target, effect) {
      if (!this.isAntiReverse() && target.specialFlag(reverseHpRecoverSpecialFlagId.id)) {
        _itemEffectRecoverHp.call(this, target, {
          code: Game_Action.EFFECT_RECOVER_HP,
          dataId: 0,
          value1: -effect.value1,
          value2: -effect.value2,
        });
      } else {
        _itemEffectRecoverHp.call(this, target, effect);
      }
    };
    const _itemEffectRecoverMp = gameAction.itemEffectRecoverMp;
    gameAction.itemEffectRecoverMp = function (target, effect) {
      if (!this.isAntiReverse() && target.specialFlag(reverseMpRecoverSpecialFlagId.id)) {
        _itemEffectRecoverMp.call(this, target, {
          code: Game_Action.EFFECT_RECOVER_MP,
          dataId: 0,
          value1: -effect.value1,
          value2: -effect.value2,
        });
      } else {
        _itemEffectRecoverMp.call(this, target, effect);
      }
    };
    gameAction.isAntiReverse = function () {
      return !!this.item()?.meta.antiReverse;
    };
    const _itemEffectAddState = gameAction.itemEffectAddState;
    gameAction.itemEffectAddState = function (target, effect) {
      if (this.isAntiReverse()) {
        target.markAntiReverse();
      }
      _itemEffectAddState.call(this, target, effect);
      target.clearAntiReverse();
    };
  }
  Game_Action_UndeadTraitMixIn(Game_Action.prototype);
  function Game_ActionResult_UndeadTraitMixIn(gameActionResult) {
    const _clear = gameActionResult.clear;
    gameActionResult.clear = function () {
      _clear.call(this);
      this.reverseDeathState = false;
    };
    const _pushAddedState = gameActionResult.pushAddedState;
    gameActionResult.pushAddedState = function (stateId) {
      _pushAddedState.call(this, stateId);
      if (this.reverseDeathState && stateId === 1) {
        this.addedStates.remove(stateId);
      }
    };
  }
  Game_ActionResult_UndeadTraitMixIn(Game_ActionResult.prototype);
  function Game_BattlerBase_UndeadTraitMixIn(gameBattlerBase) {
    const _xparam = gameBattlerBase.xparam;
    gameBattlerBase.xparam = function (xparamId) {
      if (xparamId === X_PARAM_ID.HP_REGENERATION_RATE && this.specialFlag(reverseHpRecoverSpecialFlagId.id)) {
        return -_xparam.call(this, xparamId);
      } else if (xparamId === X_PARAM_ID.MP_REGENERATION_RATE && this.specialFlag(reverseMpRecoverSpecialFlagId.id)) {
        return -_xparam.call(this, xparamId);
      }
      return _xparam.call(this, xparamId);
    };
    const _addNewState = gameBattlerBase.addNewState;
    gameBattlerBase.addNewState = function (stateId) {
      if (
        !this._markedAntiReverse &&
        this.hp > 0 &&
        stateId === this.deathStateId() &&
        this.specialFlag(reverseDeathStateSpecialFlagId.id)
      ) {
        this.gainHpFull();
      } else {
        _addNewState.call(this, stateId);
      }
    };
    gameBattlerBase.gainHpFull = function () {};
    gameBattlerBase.markAntiReverse = function () {
      this._markedAntiReverse = true;
    };
    gameBattlerBase.clearAntiReverse = function () {
      this._markedAntiReverse = false;
    };
  }
  Game_BattlerBase_UndeadTraitMixIn(Game_BattlerBase.prototype);
  function Game_Battler_UndeadTraitMixIn(gameBattler) {
    gameBattler.gainHpFull = function () {
      this.gainHp(this.mhp);
      this._result.reverseDeathState = true;
    };
  }
  Game_Battler_UndeadTraitMixIn(Game_Battler.prototype);
})();
