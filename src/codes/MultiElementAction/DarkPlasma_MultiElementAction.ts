/// <reference path="./MultiElementAction.d.ts" />

function Game_Action_MultiElementActionMixIn(gameAction: Game_Action) {
  const _calcElementRate = gameAction.calcElementRate;
  gameAction.calcElementRate = function (target) {
    const additionalElementIds = String(this.item()!.meta.additionalElements || "")
      .split(',')
      .map(elementName => $dataSystem.elements.indexOf(elementName));
    if (additionalElementIds.length > 0) {
      if (additionalElementIds.some(elementId => elementId < 0) || this.item()!.damage.elementId < 0) {
        return this.elementsMaxRate(
          target,
          this.subject().attackElements()
            .concat(
              [this.item()!.damage.elementId],
              additionalElementIds
            ).filter(elementId => elementId >= 0)
        );
      }
      return this.elementsMaxRate(target, additionalElementIds.concat([this.item()!.damage.elementId]));
    }
    return _calcElementRate.call(this, target);
  };
}

Game_Action_MultiElementActionMixIn(Game_Action.prototype);
