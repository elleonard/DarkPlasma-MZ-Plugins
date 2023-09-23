/// <reference path="./BuffRate.d.ts" />

import { settings } from './_build/DarkPlasma_BuffRate_parameters';

const paramNames = ["maxHp", "maxMp", "attack", "defense", "magicAttack", "magicDefense", "agility", "luck"] as const;
const buffRates = paramNames
  .map((paramName) => [0, settings[paramName].buffRate1, settings[paramName].buffRate2]);
const debuffRates = paramNames
  .map((paramName) => [0, -1.0 * settings[paramName].debuffRate1, -1.0 * settings[paramName].debuffRate2]);

Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
  const buffRate =
    this._buffs[paramId] > 0
      ? buffRates[paramId][this._buffs[paramId]]
      : debuffRates[paramId][-1.0 * this._buffs[paramId]];
  return buffRate / 100 + 1.0;
};
