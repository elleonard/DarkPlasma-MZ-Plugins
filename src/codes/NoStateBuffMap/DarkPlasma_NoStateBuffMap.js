/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_NoStateBuffMapMixIn(gameAction) {
  const _itemEffectAddBuff = gameAction.itemEffectAddBuff;
  gameAction.itemEffectAddBuff = function (target, effect) {
    if ($gameMap.isNoStateBuffMap()) {
      return;
    }
    _itemEffectAddBuff.call(this, target, effect);
  };

  const _itemEffectAddDebuff = gameAction.itemEffectAddDebuff;
  gameAction.itemEffectAddDebuff = function (target, effect) {
    if ($gameMap.isNoStateBuffMap()) {
      return;
    }
    _itemEffectAddDebuff.call(this, target, effect);
  };

  const _testItemEffect = gameAction.testItemEffect;
  gameAction.testItemEffect = function (target, effect) {
    if (
      $gameMap.isNoStateBuffMap() &&
      (effect.code === Game_Action.EFFECT_ADD_BUFF ||
        effect.code === Game_Action.EFFECT_ADD_DEBUFF ||
        (effect.code === Game_Action.EFFECT_ADD_STATE && effect.dataId !== target.deathStateId()))
    ) {
      return false;
    }
    return _testItemEffect.call(this, target, effect);
  };
}

Game_Action_NoStateBuffMapMixIn(Game_Action.prototype);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_NoStateBuffMapMixIn(gameBattler) {
  const _isStateAddable = gameBattler.isStateAddable;
  gameBattler.isStateAddable = function (stateId) {
    if (stateId !== this.deathStateId() && $gameMap.isNoStateBuffMap()) {
      return false;
    }
    return _isStateAddable.call(this, stateId);
  };

  const _addBuff = gameBattler.addBuff;
  gameBattler.addBuff = function (paramId, turns) {
    if ($gameMap.isNoStateBuffMap()) {
      return;
    }
    _addBuff.call(this, paramId, turns);
  };

  const _addDebuff = gameBattler.addDebuff;
  gameBattler.addDebuff = function (paramId, turns) {
    if ($gameMap.isNoStateBuffMap()) {
      return;
    }
    _addDebuff.call(this, paramId, turns);
  };
}

Game_Battler_NoStateBuffMapMixIn(Game_Battler.prototype);

/**
 * @param {Game_Map.prototype} gameMap
 */
function Game_Map_NoStateBuffMapMixIn(gameMap) {
  const _setup = gameMap.setup;
  gameMap.setup = function (mapId) {
    _setup.call(this, mapId);
    if (this.isNoStateBuffMap()) {
      $gameParty
        .allMembers()
        .filter((actor) => actor.isAlive())
        .forEach((actor) => {
          actor.clearStates();
          actor.clearBuffs();
        });
    }
  };

  gameMap.isNoStateBuffMap = function () {
    return !!$dataMap && $dataMap.meta.noStateBuff;
  };
}

Game_Map_NoStateBuffMapMixIn(Game_Map.prototype);
