/**
 * @param {Game_CharacterBase.prototype} gameCharacterBase
 */
function Game_CharacterBase_TriggerTouchWithThroughMixIn(gameCharacterBase) {
  gameCharacterBase.canThroughPlayer = function () {
    return this.isThrough() || this.isDebugThrough();
  };

  gameCharacterBase.isCollidedWithPlayerCharacters = function (x, y) {
    return false;
  };

  const _canPass = gameCharacterBase.canPass;
  gameCharacterBase.canPass = function (x, y, d) {
    const result = _canPass.call(this, x, y, d);
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if (result && !this.canThroughPlayer() && this.isCollidedWithPlayerCharacters(x2, y2)) {
      return false;
    }
    return result;
  };
}

Game_CharacterBase_TriggerTouchWithThroughMixIn(Game_CharacterBase.prototype);

/**
 * @param {Game_Player.prototype} gamePlayer
 */
function Game_Player_TriggerTouchWithThroughMixIn(gamePlayer) {
  gamePlayer.isCollidedWithEvents = function (x, y) {
    return $gameMap.eventsXyCannotThroughPlayer(x, y).some((event) => event.isNormalPriority());
  };
}

Game_Player_TriggerTouchWithThroughMixIn(Game_Player.prototype);

/**
 * @param {Game_Event.prototype} gameEvent
 */
function Game_Event_TriggerTouchWithThroughMixIn(gameEvent) {
  gameEvent.canThroughPlayer = function () {
    return (
      (this.isThrough() || this.isDebugThrough()) &&
      ((this.isPrefab && this.isPrefab()) || !this.event().meta.triggerTouch)
    );
  };
}

Game_Event_TriggerTouchWithThroughMixIn(Game_Event.prototype);

/**
 * @param {Game_Map.prototype} gameMap
 */
function Game_Map_TriggerTouchWithThroughMixIn(gameMap) {
  gameMap.eventsXyCannotThroughPlayer = function (x, y) {
    return this.events().filter((event) => event.pos(x, y) && !event.canThroughPlayer());
  };
}

Game_Map_TriggerTouchWithThroughMixIn(Game_Map.prototype);
