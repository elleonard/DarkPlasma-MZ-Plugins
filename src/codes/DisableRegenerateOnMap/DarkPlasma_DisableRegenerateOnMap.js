const _Game_Actor_regenerateAll = Game_Actor.prototype.regenerateAll;
Game_Actor.prototype.regenerateAll = function () {
  if (!$gameParty.inBattle()) {
    return;
  }
  _Game_Actor_regenerateAll.call(this);
};
