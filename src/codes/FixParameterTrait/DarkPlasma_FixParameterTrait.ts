/// <reference path="../../typings/rmmz/rmmz.d.ts" />

import { pluginName } from '../../common/pluginName';

const localTraitId = 1;
const fixParameterTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, "通常能力値固定");
const fixXParameterTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, "追加能力値固定")
const fixParameterVariableTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 2, "通常能力値固定(変数)");
const fixXParameterVariableTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 3, "追加能力値固定(変数)")

const parameterType = [
  'mhp',
  'mmp',
  'atk',
  'def',
  'mat',
  'mdf',
  'agi',
  'luk',
];

const xParameterType = [
  'hit',
  'eva',
  'cri',
  'cev',
  'mev',
  'mrf',
  'cnt',
  'hrg',
  'mrg',
  'trg',
];

function DataManager_FixParameterTraitMixIn() {
  const _extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data: DataManager.NoteHolder) {
    _extractMetadata.call(this, data);
    if (hasTrait(data)) {
      extractFixParameterTrait(data);
    }
  };

  function hasTrait(data: DataManager.NoteHolder): data is MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy {
    return "traits" in data;
  }

  function extractFixParameterTrait(data: MZ.Actor | MZ.Class | MZ.Weapon | MZ.Armor | MZ.State | MZ.Enemy) {
    if (data.meta.fixParameter) {
      const lines = String(data.meta.fixParameter).split('\n');
      lines.map(line => {
        const fixParameterSetting = /(.+):(.+)/.exec(line.trim());
        if (fixParameterSetting && fixParameterSetting[1] && fixParameterSetting[2]) {
          const traitId = traitIdFromSetting(fixParameterSetting[1].trim(), fixParameterSetting[2].trim());
          if (!traitId) {
            return null;
          }
          const dataId = dataIdFromTraitId(traitId, fixParameterSetting[1].trim());
          if (dataId === undefined) {
            return null;
          }
          const value = extractValue(fixParameterSetting[2].trim());
          return {
            code: traitId.id,
            dataId: dataId,
            value: value,
          };
        }
        return null;
      }).filter(trait => !!trait)
      .forEach(trait => data.traits.push(trait!));
    }
  }

  function traitIdFromSetting(parameter: string, value: string) {
    if (parameterType.includes(parameter)) {
      return value.startsWith('\\V') ? fixParameterVariableTraitId : fixParameterTraitId;
    } else if (xParameterType.includes(parameter)) {
      return value.startsWith('\\V') ? fixXParameterVariableTraitId : fixXParameterTraitId;
    }
    return undefined;
  }

  function dataIdFromTraitId(traitId: UniqueTraitId, parameter: string) {
    if (traitId === fixParameterTraitId || traitId === fixParameterVariableTraitId) {
      return parameterType.indexOf(parameter);
    } else if (traitId === fixXParameterTraitId || traitId === fixXParameterVariableTraitId) {
      return xParameterType.indexOf(parameter);
    }
    return undefined;
  }

  function extractValue(value: string) {
    if(value.startsWith('\\V')) {
      const variableId = /\\V\[(.+)\]/.exec(value);
      return variableId && variableId[1] ? Number(variableId[1]) : 0;
    }
    return Number(value);
  }
}

DataManager_FixParameterTraitMixIn();

function Game_BattlerBase_FixParameterTraitMixIn(gameBattlerBase: Game_BattlerBase) {
  gameBattlerBase.isParamFixed = function (paramId) {
    return this.traitsSet(fixParameterTraitId.id)
      .concat(this.traitsSet(fixParameterVariableTraitId.id))
      .includes(paramId);
  };

  gameBattlerBase.fixedParameter = function (paramId) {
    const traits = this.traitsWithId(fixParameterTraitId.id, paramId);
    if (traits.length > 0) {
      return traits[0].value;
    }
    const variableTraits = this.traitsWithId(fixParameterVariableTraitId.id, paramId);
    if (variableTraits.length > 0) {
      return $gameVariables.value(variableTraits[0].value);
    }
    throw Error(`不正な能力値固定特徴です。 paramId: ${paramId}`);
  };

  gameBattlerBase.isXParamFixed = function (xparamId) {
    return this.traitsSet(fixXParameterTraitId.id)
      .concat(this.traitsSet(fixXParameterVariableTraitId.id))
      .includes(xparamId);
  };

  gameBattlerBase.fixedXParameter = function (xparamId) {
    const traits = this.traitsWithId(fixXParameterTraitId.id, xparamId);
    if (traits.length > 0) {
      return traits[0].value;
    }
    const variableTraits = this.traitsWithId(fixXParameterVariableTraitId.id, xparamId);
    if (variableTraits.length > 0) {
      return $gameVariables.value(variableTraits[0].value);
    }
    throw Error(`不正な能力値固定特徴です。 paramId: ${xparamId}`);
  };

  const _param = gameBattlerBase.param;
  gameBattlerBase.param = function (paramId) {
    if (this.isParamFixed(paramId)) {
      return this.fixedParameter(paramId);
    }
    return _param.call(this, paramId);
  };

  const _xparam = gameBattlerBase.xparam;
  gameBattlerBase.xparam = function (xparamId) {
    if (this.isXParamFixed(xparamId)) {
      return this.fixedXParameter(xparamId);
    }
    return _xparam.call(this, xparamId);
  };
}

Game_BattlerBase_FixParameterTraitMixIn(Game_BattlerBase.prototype);
