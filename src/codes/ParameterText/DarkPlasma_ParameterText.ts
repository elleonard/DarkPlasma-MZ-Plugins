/// <reference path="./ParameterText.d.ts" />
import { settings } from './_build/DarkPlasma_ParameterText_parameters';

const TEXT_MANAGER_PARAM_ID = {
  HIT: 8,
  EVASION: 9,
};

const paramNames = {
  extraParamNames: [
    '',
    '',
    settings.extraParamNameCritical,
    settings.extraParamNameCriticalEvasion,
    settings.extraParamNameMagicEvasion,
    settings.extraParamNameMagicReflection,
    settings.extraParamNameCounterAttack,
    settings.extraParamNameHpRegeneration,
    settings.extraParamNameMpRegeneration,
    settings.extraParamNameTpRegeneration,
  ],
  specialParamNames: [
    settings.specialParamNameTargetRate,
    settings.specialParamNameGuardEffectRate,
    settings.specialParamNameRecoveryEffectRate,
    settings.specialParamNamePharmacology,
    settings.specialParamNameMpCostRate,
    settings.specialParamNameTpChargeRate,
    settings.specialParamNamePhysicalDamageRate,
    settings.specialParamNameMagicDamageRate,
    settings.specialParamNameFloorDamageRate,
    settings.specialParamNameExperienceRate,
  ],
};

const _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function (object) {
  _DataManager_onLoad.call(this, object);
  if (object.terms && object.terms.params) {
    paramNames.extraParamNames[0] = TextManager.param(TEXT_MANAGER_PARAM_ID.HIT);
    paramNames.extraParamNames[1] = TextManager.param(TEXT_MANAGER_PARAM_ID.EVASION);
  }
};

/**
 * 追加能力値のテキストを返す
 * @param {number} paramId パラメータID
 * @return {string}
 */
TextManager.xparam = function (paramId: number): string {
  return paramNames.extraParamNames[paramId] || '';
};

/**
 * 特殊能力値のテキストを返す
 * @param {number} paramId パラメータID
 * @return {string}
 */
TextManager.sparam = function (paramId: number): string {
  return paramNames.specialParamNames[paramId] || '';
};
