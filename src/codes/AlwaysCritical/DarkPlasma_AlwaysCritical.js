const _Game_Action_itemCri = Game_Action.prototype.itemCri;
Game_Action.prototype.itemCri = function (target) {
  if (this.item().meta.alwaysCritical) {
    return 1;
  }
  return _Game_Action_itemCri.call(this, target);
};
