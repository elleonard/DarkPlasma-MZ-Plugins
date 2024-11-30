/// <reference path="./CachePartyAbilityTraits.d.ts" />

import { settings } from '../config/_build/DarkPlasma_CachePartyAbilityTraits_parameters';

// TODO: tempPartyの場合はキャッシュ貫通

function Game_Temp_CachePartyAbilityTraitsMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function () {
    _initialize.call(this);
    this._partyAbilityTraitsCache = new Map<string, number>();
  };

  gameTemp.partyAbilityTraitsCacheKey = function (type, paramId) {
    return `${type}_${paramId}`;
  };

  gameTemp.cachedPartyAbilityTrait = function (type, paramId) {
    return this._partyAbilityTraitsCache.get(
      this.partyAbilityTraitsCacheKey(type, paramId)
    );
  };

  gameTemp.cachePartyAbilityTraits = function (type, paramId, value) {
    this._partyAbilityTraitsCache.set(
      this.partyAbilityTraitsCacheKey(type, paramId),
      value
    );
  };

  gameTemp.clearPartyAbilityTraitsCache = function () {
    this._partyAbilityTraitsCache.clear();
  };
}

Game_Temp_CachePartyAbilityTraitsMixIn(Game_Temp.prototype);

function Game_Party_CachePartyAbilityTraitsMixIn(gameParty: Game_Party) {
  const _calcPartyAbilityTraitMethodWithCache = function (originalMethod: (paramId: number) => number, type: PartyAbilityTraitType) {
    return function (this: Game_Party, paramId: number) {
      if (this._ignorePartyAbilityCache) {
        return originalMethod.call(this, paramId);
      }
      const cached = $gameTemp.cachedPartyAbilityTrait(type, paramId);
      if (cached === undefined) {
        const value = originalMethod.call(this, paramId);
        $gameTemp.cachePartyAbilityTraits(type, paramId, value);
        return value;
      }
      return cached;
    };
  };

  gameParty.paramPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.paramPlusByPartyAbility, "paramPlus");
  gameParty.paramRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.paramRateByPartyAbility, "paramRate");
  gameParty.xparamPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.xparamPlusByPartyAbility, "xparamPlus");
  gameParty.xparamRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.xparamRateByPartyAbility, "xparamRate");
  gameParty.sparamPlusByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.sparamPlusByPartyAbility, "sparamPlus");
  gameParty.sparamRateByPartyAbility = _calcPartyAbilityTraitMethodWithCache(gameParty.sparamRateByPartyAbility, "sparamRate");

  gameParty.setIgnorePartyAbilityCache = function () {
    this._ignorePartyAbilityCache = true;
  };

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

function Game_System_CachePartyAbilityTraitsMixIn(gameSystem: Game_System) {
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

function Game_Actors_CachePartyAbilityTraitsMixIn(gameActors: Game_Actors) {
  gameActors.setEquipsClearCacheMixIn = function () {
    this._data.filter(actor => !!actor).forEach(actor => actor.setEquipsClearCacheMixIn());
  };
};

Game_Actors_CachePartyAbilityTraitsMixIn(Game_Actors.prototype);

function Game_BattlerBase_CachePartyAbilityTraitsMixIn(gameBattlerBase: Game_BattlerBase) {
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

function Game_Actor_CachePartyAbilityTraitsMixIn(gameActor: Game_Actor) {
  const _initEquips = gameActor.initEquips;
  gameActor.initEquips = function (equips) {
    _initEquips.call(this, equips);
    this.setEquipsClearCacheMixIn();
  };

  gameActor.setEquipsClearCacheMixIn = function () {
    if (settings.clearCache.changeEquip) {
      this._equips.forEach(e => Game_Item_CachePartyAbilityTraitsMixIn(e));
    }
  };

  const _setTempParty = gameActor.setTempParty;
  gameActor.setTempParty = function (tempParty) {
    /**
     * ステータス差分表示用の一時パーティはキャッシュを参照せず、更新しない
     */
    tempParty.setIgnorePartyAbilityCache();
    _setTempParty.call(this, tempParty);
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

function Game_Item_CachePartyAbilityTraitsMixIn(gameItem: Game_Item) {
  gameItem.setObject = function (item) {
    Game_Item.prototype.setObject.call(this, item);
    $gameTemp.clearPartyAbilityTraitsCache();
  };
}
