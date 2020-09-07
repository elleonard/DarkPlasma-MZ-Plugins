import { settings } from './_build/DarkPlasma_BuffRate_parameters';

const PARAM_ID = {
  ATTACK: 2,
  DEFENSE: 3,
  MAGIC_ATTACK: 4,
  MAGIC_DEFENSE: 5,
  AGILITY: 6,
  LUCK: 7,
};

const parsedParameters = {
  [PARAM_ID.ATTACK]: settings.attack,
  [PARAM_ID.DEFENSE]: settings.defense,
  [PARAM_ID.MAGIC_ATTACK]: settings.magicAttack,
  [PARAM_ID.MAGIC_DEFENSE]: settings.magicDefense,
  [PARAM_ID.AGILITY]: settings.agility,
  [PARAM_ID.LUCK]: settings.luck,
};

function findBuffRateSettings(paramId) {
  return [0, parsedParameters[paramId].buffRate1, parsedParameters[paramId].buffRate2];
}

function findDebuffRateSettings(paramId) {
  return [0, -1.0 * parsedParameters[paramId].debuffRate1, -1.0 * parsedParameters[paramId].debuffRate2];
}

settings.buffRate = {};
settings.debuffRate = {};

Object.entries(PARAM_ID).map((param) => {
  settings.buffRate[param[1]] = findBuffRateSettings(param[1]);
  settings.debuffRate[param[1]] = findDebuffRateSettings(param[1]);
});

const _Game_BattlerBase_paramBuffRate = Game_BattlerBase.prototype.paramBuffRate;
Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
  switch (paramId) {
    case PARAM_ID.ATTACK:
    case PARAM_ID.DEFENSE:
    case PARAM_ID.MAGIC_ATTACK:
    case PARAM_ID.MAGIC_DEFENSE:
    case PARAM_ID.AGILITY:
    case PARAM_ID.LUCK:
      const buffRate =
        this._buffs[paramId] > 0
          ? settings.buffRate[paramId][this._buffs[paramId]]
          : settings.debuffRate[paramId][-1.0 * this._buffs[paramId]];
      return buffRate / 100 + 1.0;
  }
  return _Game_BattlerBase_paramBuffRate.call(this, paramId);
};
