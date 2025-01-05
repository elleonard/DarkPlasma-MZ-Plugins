/// <reference path="./MultiElementAction.d.ts" />

function Game_Action_MultiElementActionMixIn(gameAction: Game_Action) {
  gameAction.calcElementRate = function (target) {
    return this.elementsMaxRate(target,this.actionAttackElements());
  };

  gameAction.actionAttackElements = function () {
    const additionalElementIds = String(this.item()!.meta.additionalElements || "")
      .split(',')
      .map(elementName => $dataSystem.elements.indexOf(elementName));
    if (additionalElementIds.some(elementId => elementId < 0) || this.item()!.damage.elementId < 0) {
      return [...new Set(this.subject().attackElements()
        .concat(
          [this.item()!.damage.elementId],
          additionalElementIds
        ).filter(elementId => elementId >= 0))];
    }
    return [...new Set(additionalElementIds.concat([this.item()!.damage.elementId]))];
  };
}

Game_Action_MultiElementActionMixIn(Game_Action.prototype);
