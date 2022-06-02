/**
 * @param {Game_BattlerBase.prototype} gameBattlerBase
 */
function Game_BattlerBase_UnusableItemWithMapEvntMixIn(gameBattlerBase) {
  const _isOccasionOk = gameBattlerBase.isOccasionOk;
  gameBattlerBase.isOccasionOk = function (item) {
    return _isOccasionOk.call(this, item) && (!item.meta.unusableWithMapEvent || !$gameMap.isEventRunning());
  };
}

Game_BattlerBase_UnusableItemWithMapEvntMixIn(Game_BattlerBase.prototype);
