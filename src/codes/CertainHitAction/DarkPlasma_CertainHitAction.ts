/// <reference path="./CertainHitAction.d.ts" />

function Game_Action_CertainHitMixIn(gameAction: Game_Action) {
  const _itemHit = gameAction.itemHit;
  gameAction.itemHit = function (target) {
    if (this.item()?.meta.certainHit) {
      return 1;
    }
    return _itemHit.call(this, target);
  };

  const _itemEva = gameAction.itemEva;
  gameAction.itemEva = function(target) {
    if (this.item()?.meta.certainHit) {
      return 0;
    }
    return _itemEva.call(this, target);
  };

  const _itemCnt = gameAction.itemCnt;
  gameAction.itemCnt = function (target) {
    if (this.item()?.meta.ignoreCounter) {
      return 0;
    }
    return _itemCnt.call(this, target);
  };

  const _itemMrf = gameAction.itemMrf;
  gameAction.itemMrf = function (target) {
    if (this.item()?.meta.ignoreReflection) {
      return 0;
    }
    return _itemMrf.call(this, target);
  };
}

Game_Action_CertainHitMixIn(Game_Action.prototype);

