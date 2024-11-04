// DarkPlasma_AddSParamTrait 1.0.2
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @help
 * version: 1.0.2
 * アクター、職業、装備、敵キャラ、ステートのメモ欄に指定の記述を行うことで
 * 特殊能力値を加算する特徴を追加します。
 * エディタで指定できる乗算特徴を適用した後に、この設定値が加算されます。
 * 加算の結果が0未満になる場合、0として扱います。
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

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

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
      return _sparam.call(this, paramId) + this.sparamPlus(paramId);
    };
    gameBattlerBase.sparamPlus = function (paramId) {
      return this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, sparamPlusDataIds[paramId].id);
    };
  }
  Game_BattlerBase_AddSParamTraitMixIn(Game_BattlerBase.prototype);
})();
