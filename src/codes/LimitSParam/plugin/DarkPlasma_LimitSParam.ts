/// <reference path="./LimitSParam.d.ts" />

import { settings } from '../config/_build/DarkPlasma_LimitSParam_parameters';

const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'] as const;

function Game_BattlerBase_LimitSParamMixIn(gameBattlerBase: Game_BattlerBase) {
  const _sparam = gameBattlerBase.sparam;
  gameBattlerBase.sparam = function (paramId) {
    const value = _sparam.call(this, paramId);
    const limitSetting = this.sparamLimitSetting(paramId);
    if (limitSetting.enableLowerLimit) {
      if (limitSetting.enableUpperLimit) {
        return value.clamp(
          limitSetting.lowerLimit,
          limitSetting.upperLimit
        );
      } else {
        return Math.max(limitSetting.lowerLimit, value);
      }
    } else {
      if (limitSetting.enableUpperLimit) {
        return Math.min(limitSetting.upperLimit, value);
      }
    }
    return value;
  };

  gameBattlerBase.sparamLimitSetting = function (paramId) {
    return settings.statusLimit[SPARAM_KEYS[paramId]];
  };
}

Game_BattlerBase_LimitSParamMixIn(Game_BattlerBase.prototype);
