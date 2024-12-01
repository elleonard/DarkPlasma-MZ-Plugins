// DarkPlasma_AddSParamTrait 1.1.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/12/01 1.1.0 限界値設定を追加
 * 2024/11/04 1.0.2 加算ではなく乗算になってしまっていた不具合を修正
 * 2024/11/04 1.0.1 ParameterTextとの順序関係を明記
 * 2024/11/04 1.0.0 公開
 */

/*:
 * @plugindesc 特殊能力値を加算する特徴
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_AllocateUniqueTraitDataId
 * @orderAfter DarkPlasma_ParameterText
 * @orderAfter DarkPlasma_AllocateUniqueTraitDataId
 *
 * @param statusLimit
 * @desc 各ステータスの限界値を設定します。
 * @text 限界値
 * @type struct<StatusLimit>
 * @default {"tgr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","grd":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","rec":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pha":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","tcr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","pdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","mdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","fdr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}","exr":"{\"enableUpperLimit\":\"false\",\"upperLimit\":\"999999\",\"enableLowerLimit\":\"true\",\"lowerLimit\":\"0\"}"}
 *
 * @help
 * version: 1.1.0
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に指定の記述を行うことで
 * 特殊能力値を加算する特徴を追加します。
 * エディタで指定できる乗算特徴を適用した後に、この設定値が加算されます。
 *
 * 記述例:
 * MP消費率+10％
 * <addSParam:mcr:10>
 *
 * 物理ダメージ率-10％
 * <addSParam:pdr:-10>
 *
 * 基本構文:
 * <addSParam:[param]:[value]>
 *
 * [param]:
 *   tgr: 狙われ率
 *   grd: 防御効果率
 *   rec: 回復効果率
 *   pha: 薬の知識
 *   mcr: MP消費率
 *   tcr: TPチャージ率
 *   pdr: 物理ダメージ率
 *   mdr: 魔法ダメージ率
 *   fdr: 床ダメージ率
 *   exr: 経験値獲得率
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitDataId version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ParameterText
 * DarkPlasma_AllocateUniqueTraitDataId
 */
/*~struct~LimitValue:
 * @param enableUpperLimit
 * @desc ONにすると上限値設定が有効になります。OFFにすると上限値なしとなります。
 * @text 上限値を有効にする
 * @type boolean
 * @default false
 *
 * @param upperLimit
 * @text 上限値
 * @type number
 * @default 0
 *
 * @param enableLowerLimit
 * @desc ONにすると下限値設定が有効になります。OFFにすると下限値なしとなります。
 * @text 下限値を有効にする
 * @type boolean
 * @default false
 *
 * @param lowerLimit
 * @text 下限値
 * @type number
 * @default 0
 */
/*~struct~StatusLimit:
 * @param tgr
 * @text 狙われ率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param grd
 * @text 防御効果率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param rec
 * @text 回復効果率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param pha
 * @text 薬の知識
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param mcr
 * @text MP消費率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param tcr
 * @text TPチャージ率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param pdr
 * @text 物理ダメージ率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param mdr
 * @text 魔法ダメージ率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param fdr
 * @text 床ダメージ率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 *
 * @param exr
 * @text 経験値獲得率
 * @type struct<LimitValue>
 * @default {"enableUpperLimit":"false","upperLimit":"999999","enableLowerLimit":"true","lowerLimit":"0"}
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    statusLimit: pluginParameters.statusLimit
      ? ((parameter) => {
          const parsed = JSON.parse(parameter);
          return {
            tgr: parsed.tgr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.tgr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            grd: parsed.grd
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.grd)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            rec: parsed.rec
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.rec)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            pha: parsed.pha
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.pha)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            mcr: parsed.mcr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.mcr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            tcr: parsed.tcr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.tcr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            pdr: parsed.pdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.pdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            mdr: parsed.mdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.mdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            fdr: parsed.fdr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.fdr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
            exr: parsed.exr
              ? ((parameter) => {
                  const parsed = JSON.parse(parameter);
                  return {
                    enableUpperLimit: String(parsed.enableUpperLimit || false) === 'true',
                    upperLimit: Number(parsed.upperLimit || 0),
                    enableLowerLimit: String(parsed.enableLowerLimit || false) === 'true',
                    lowerLimit: Number(parsed.lowerLimit || 0),
                  };
                })(parsed.exr)
              : { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          };
        })(pluginParameters.statusLimit)
      : {
          tgr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          grd: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          rec: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          pha: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          mcr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          tcr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          pdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          mdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          fdr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
          exr: { enableUpperLimit: false, upperLimit: 999999, enableLowerLimit: true, lowerLimit: 0 },
        },
  };

  const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'];
  const sparamPlusDataIds = SPARAM_KEYS.map((_, paramId) =>
    uniqueTraitDataIdCache.allocate(
      pluginName,
      Game_BattlerBase.TRAIT_SPARAM,
      paramId,
      TextManager.sparam ? TextManager.sparam(paramId) : '',
    ),
  );
  function DataManager_MultiplyXParamTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.addSParam) {
          data.traits.push(this.parseAddSParamTrait(String(data.meta.addSParam)));
        }
      }
    };
    dataManager.parseAddSParamTrait = function (meta) {
      const metaTokens = meta.split(':').map((token) => token.trim());
      if (metaTokens.length < 2) {
        throw Error(`特殊能力値加算の特徴の記述が不正です: ${meta}`);
      }
      const paramId = SPARAM_KEYS.indexOf(metaTokens[0]);
      if (paramId < 0) {
        throw Error(`特殊能力値加算の対象パラメータの記述が不正です: ${metaTokens[0]}`);
      }
      return {
        code: Game_BattlerBase.TRAIT_SPARAM,
        dataId: sparamPlusDataIds[paramId].id,
        value: Number(metaTokens[1]) / 100,
      };
    };
  }
  DataManager_MultiplyXParamTraitMixIn(DataManager);
  function Game_BattlerBase_AddSParamTraitMixIn(gameBattlerBase) {
    const _sparam = gameBattlerBase.sparam;
    gameBattlerBase.sparam = function (paramId) {
      const value = _sparam.call(this, paramId) + this.sparamPlus(paramId);
      const limitSetting = settings.statusLimit[SPARAM_KEYS[paramId]];
      if (limitSetting.enableLowerLimit) {
        if (limitSetting.enableUpperLimit) {
          return value.clamp(limitSetting.lowerLimit, limitSetting.upperLimit);
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
    gameBattlerBase.sparamPlus = function (paramId) {
      return this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, sparamPlusDataIds[paramId].id);
    };
  }
  Game_BattlerBase_AddSParamTraitMixIn(Game_BattlerBase.prototype);
})();
