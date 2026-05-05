/// <reference path="./AlwaysCritical.d.ts" />

function Game_Action_AlwaysCriticalMixIn(gameAction: Game_Action) {
  const _itemCri = gameAction.itemCri;
  gameAction.itemCri = function (target) {
    if (this.item()?.meta.alwaysCritical) {
      return 1;
    }
    return _itemCri.call(this, target);
  };
}

Game_Action_AlwaysCriticalMixIn(Game_Action.prototype);
