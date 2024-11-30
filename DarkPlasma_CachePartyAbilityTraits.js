// DarkPlasma_CachePartyAbilityTraits 1.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/30 1.0.0 公開
 */

/*:
 * @plugindesc パーティ能力特徴をキャッシュする
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param clearCache
 * @desc キャッシュクリアの設定を行います。
 * @text キャッシュクリア
 * @type struct<ClearCache>
 * @default {"changeEquip":"true","changeState":"true","changeClass":"true"}
 *
 * @help
 * version: 1.0.0
 * DarkPlasma_PartyAbilityTraitExtensionで追加するパーティ能力特徴をキャッシュし、
 * 再計算を抑制します。
 * パーティ能力特徴によってパフォーマンスに影響が出ていると感じた場合にお試しください。
 *
 * 以下のタイミングで再計算を行います。
 * - パーティメンバーが増減した時
 * - 装備を変更した時
 * - アクターにステートが付加されたり、解除された時
 * - 職業が変わった時
 */
/*~struct~ClearCache:
 * @param changeEquip
 * @desc 装備にパーティ能力特徴を設定する場合はONにします。
 * @text 装備変更
 * @type boolean
 * @default true
 *
 * @param changeState
 * @desc ステートにパーティ能力特徴を設定する場合はONにします。
 * @text ステート変更
 * @type boolean
 * @default true
 *
 * @param changeClass
 * @desc 職業にパーティ能力特徴を設定する場合はONにします。
 * @text 職業変更
 * @type boolean
 * @default true
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    clearCache: pluginParameters.clearCache
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            changeEquip: String(parsed.changeEquip || true) === 'true',
            changeState: String(parsed.changeState || true) === 'true',
            changeClass: String(parsed.changeClass || true) === 'true',
          };
        })(pluginParameters.clearCache)
      : { changeEquip: true, changeState: true, changeClass: true },
  };

  function Game_Temp_CachePartyAbilityTraitsMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._partyAbilityTraitsCache = new Map();
    };
    gameTemp.partyAbilityTraitsCacheKey = function (type, paramId) {
      return `${type}_${paramId}`;
    };
    gameTemp.cachedPartyAbilityTrait = function (type, paramId) {
      return this._partyAbilityTraitsCache.get(this.partyAbilityTraitsCacheKey(type, paramId));
    };
    gameTemp.cachePartyAbilityTraits = function (type, paramId, value) {
      this._partyAbilityTraitsCache.set(this.partyAbilityTraitsCacheKey(type, paramId), value);
    };
    gameTemp.clearPartyAbilityTraitsCache = function () {
      this._partyAbilityTraitsCache.clear();
    };
  }
  Game_Temp_CachePartyAbilityTraitsMixIn(Game_Temp.prototype);
  function Game_Party_CachePartyAbilityTraitsMixIn(gameParty) {
    const _calcPartyAbilityTraitMethodWithCache = function (originalMethod, type) {
      return function (paramId) {
        const cached = $gameTemp.cachedPartyAbilityTrait(type, paramId);
        if (cached === undefined) {
          const value = originalMethod.call(this, paramId);
          $gameTemp.cachePartyAbilityTraits(type, paramId, value);
          return value;
        }
        return cached;
      };
    };
    gameParty.paramPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.paramPlusByPartyAbility,
      'paramPlus',
    );
    gameParty.paramRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.paramRateByPartyAbility,
      'paramRate',
    );
    gameParty.xparamPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.xparamPlusByPartyAbility,
      'xparamPlus',
    );
    gameParty.xparamRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.xparamRateByPartyAbility,
      'xparamRate',
    );
    gameParty.sparamPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.sparamPlusByPartyAbility,
      'sparamPlus',
    );
    gameParty.sparamRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(
      gameParty.sparamRateByPartyAbility,
      'sparamRate',
    );
    const _addActor = gameParty.addActor;
    gameParty.addActor = function (actorId) {
      _addActor.call(this, actorId);
      $gameTemp.clearPartyAbilityTraitsCache();
    };
    const _removeActor = gameParty.removeActor;
    gameParty.removeActor = function (actorId) {
      _removeActor.call(this, actorId);
      $gameTemp.clearPartyAbilityTraitsCache();
    };
  }
  Game_Party_CachePartyAbilityTraitsMixIn(Game_Party.prototype);
  function Game_System_CachePartyAbilityTraitsMixIn(gameSystem) {
    const _onAfterLoad = gameSystem.onAfterLoad;
    gameSystem.onAfterLoad = function () {
      _onAfterLoad.call(this);
      /**
       * 導入前のセーブデータに対応
       */
      $gameActors.setEquipsClearCacheMixIn();
    };
  }
  Game_System_CachePartyAbilityTraitsMixIn(Game_System.prototype);
  function Game_Actors_CachePartyAbilityTraitsMixIn(gameActors) {
    gameActors.setEquipsClearCacheMixIn = function () {
      this._data.filter((actor) => !!actor).forEach((actor) => actor.setEquipsClearCacheMixIn());
    };
  }
  Game_Actors_CachePartyAbilityTraitsMixIn(Game_Actors.prototype);
  function Game_BattlerBase_CachePartyAbilityTraitsMixIn(gameBattlerBase) {
    const _addNewState = gameBattlerBase.addNewState;
    gameBattlerBase.addNewState = function (stateId) {
      _addNewState.call(this, stateId);
      if (settings.clearCache.changeState && this.isActor()) {
        $gameTemp.clearPartyAbilityTraitsCache();
      }
    };
    const _clearStates = gameBattlerBase.clearStates;
    gameBattlerBase.clearStates = function () {
      _clearStates.call(this);
      if (settings.clearCache.changeState && this.isActor()) {
        $gameTemp.clearPartyAbilityTraitsCache();
      }
    };
  }
  Game_BattlerBase_CachePartyAbilityTraitsMixIn(Game_BattlerBase.prototype);
  function Game_Actor_CachePartyAbilityTraitsMixIn(gameActor) {
    const _initEquips = gameActor.initEquips;
    gameActor.initEquips = function (equips) {
      _initEquips.call(this, equips);
      this.setEquipsClearCacheMixIn();
    };
    gameActor.setEquipsClearCacheMixIn = function () {
      if (settings.clearCache.changeEquip) {
        this._equips.forEach((e) => Game_Item_CachePartyAbilityTraitsMixIn(e));
      }
    };
    const _eraseState = gameActor.eraseState;
    gameActor.eraseState = function (stateId) {
      _eraseState.call(this, stateId);
      if (settings.clearCache.changeState) {
        $gameTemp.clearPartyAbilityTraitsCache();
      }
    };
    const _changeClass = gameActor.changeClass;
    gameActor.changeClass = function (classId, keepExp) {
      if (settings.clearCache.changeClass) {
        $gameTemp.clearPartyAbilityTraitsCache();
      }
      _changeClass.call(this, classId, keepExp);
    };
  }
  Game_Actor_CachePartyAbilityTraitsMixIn(Game_Actor.prototype);
  function Game_Item_CachePartyAbilityTraitsMixIn(gameItem) {
    gameItem.setObject = function (item) {
      Game_Item.prototype.setObject.call(this, item);
      $gameTemp.clearPartyAbilityTraitsCache();
    };
  }
})();
