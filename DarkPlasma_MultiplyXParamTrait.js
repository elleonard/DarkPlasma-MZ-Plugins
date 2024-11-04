// DarkPlasma_MultiplyXParamTrait 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/04 1.0.1 ParameterTextとの順序関係を明記
 * 2024/11/04 1.0.0 公開
 */

/*:
 * @plugindesc 追加能力値を乗算する特徴
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
 * @help
 * version: 1.0.1
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に指定の記述を行うことで
 * 追加能力値を乗算する特徴を追加します。
 * エディタで指定できる加算特徴を適用した後に、この倍率が適用されます。
 *
 * 記述例:
 * 回避率半減
 * <multiplyXParam:eva:50>
 *
 * HP再生率2倍
 * <multiplyXParam:hrg:200>
 *
 * 基本構文:
 * <multiplyXParam:[param]:[value]>
 *
 * [param]:
 *   hit: 命中率
 *   eva: 回避率
 *   cri: 会心率
 *   cev: 会心回避率
 *   mev: 魔法回避率
 *   mrf: 魔法反射率
 *   cnt: 反撃率
 *   hrg: HP再生率
 *   mrg: MP再生率
 *   trg: TP再生率
 *
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_AllocateUniqueTraitDataId version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_ParameterText
 * DarkPlasma_AllocateUniqueTraitDataId
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
  const xparamRateDataIds = XPARAM_KEYS.map((_, paramId) =>
    uniqueTraitDataIdCache.allocate(
      pluginName,
      Game_BattlerBase.TRAIT_XPARAM,
      paramId,
      TextManager.xparam ? TextManager.xparam(paramId) : '',
    ),
  );
  function DataManager_MultiplyXParamTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.multiplyXParam) {
          data.traits.push(this.parseMultiplyXParamTrait(String(data.meta.multiplyXParam)));
        }
      }
    };
    dataManager.parseMultiplyXParamTrait = function (meta) {
      const metaTokens = meta.split(':').map((token) => token.trim());
      if (metaTokens.length < 2) {
        throw Error(`追加能力値乗算の特徴の記述が不正です: ${meta}`);
      }
      const paramId = XPARAM_KEYS.indexOf(metaTokens[0]);
      if (paramId < 0) {
        throw Error(`追加能力値乗算の対象パラメータの記述が不正です: ${metaTokens[0]}`);
      }
      return {
        code: Game_BattlerBase.TRAIT_XPARAM,
        dataId: xparamRateDataIds[paramId].id,
        value: Number(metaTokens[1]) / 100,
      };
    };
  }
  DataManager_MultiplyXParamTraitMixIn(DataManager);
  function Game_BattlerBase_MultiplyXParamTraitMixIn(gameBattlerBase) {
    const _xparam = gameBattlerBase.xparam;
    gameBattlerBase.xparam = function (paramId) {
      return _xparam.call(this, paramId) * this.xparamRate(paramId);
    };
    gameBattlerBase.xparamRate = function (paramId) {
      return this.traitsPi(Game_BattlerBase.TRAIT_XPARAM, xparamRateDataIds[paramId].id);
    };
  }
  Game_BattlerBase_MultiplyXParamTraitMixIn(Game_BattlerBase.prototype);
})();
