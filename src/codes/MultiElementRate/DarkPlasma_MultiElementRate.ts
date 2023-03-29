/// <reference path="./MultiElementRate.d.ts" />

import { settings } from "./_build/DarkPlasma_MultiElementRate_parameters";

function Game_Action_MultiElementRateMixIn(gameAction: Game_Action) {
  const _elementsMaxRate = gameAction.elementsMaxRate;
  gameAction.elementsMaxRate = function (target, elements) {
    if (elements.length > 0) {
      return elements.reduce((result, elementId) => {
        return settings.addition ? result + target.elementRate(elementId) : result * target.elementRate(elementId);
      }, 1);
    }
    return _elementsMaxRate.call(this, target, elements);
  };
}

Game_Action_MultiElementRateMixIn(Game_Action.prototype);
