// DarkPlasma_AddSParamTrait 2.0.0
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2025/07/21 2.0.0 限界値設定をDarkPlasma_LimitSParamに分離
 *                  特殊能力値追加プラグイン用にインターフェース追加
 * 2024/12/19 1.2.0 複数の特徴を指定できる記法を追加
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
 * @orderBefore DarkPlasma_LimitSParam
 *
 * @help
 * version: 2.0.0
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
 * 物理ダメージ率-10％, 魔法ダメージ率-10％
 * <addSParam:
 *   pdr:-10
 *   mdr:-10
 * >
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
 * 下記プラグインと共に利用する場合、それよりも上に追加してください。
 * DarkPlasma_LimitSParam
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
  function DataManager_AddSParamTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.addSParam) {
          data.traits.push(...this.parseAddSParamTraits(String(data.meta.addSParam)));
        }
      }
    };
    dataManager.parseAddSParamTraits = function (meta) {
      return meta
        .trim()
        .split('\n')
        .map((line) => this.parseAddSParamTrait(line));
    };
    dataManager.parseAddSParamTrait = function (line) {
      const metaTokens = line.split(':').map((token) => token.trim());
      if (metaTokens.length < 2) {
        throw Error(`特殊能力値加算の特徴の記述が不正です: ${line}`);
      }
      return {
        code: Game_BattlerBase.TRAIT_SPARAM,
        dataId: this.sparamIdToAddSparamDataId(this.sparamKeyToSParamId(metaTokens[0])),
        value: Number(metaTokens[1]) / 100,
      };
    };
    dataManager.sparamKeyToSParamId = function (key) {
      const paramId = SPARAM_KEYS.indexOf(key);
      if (paramId < 0) {
        throw Error(`特殊能力値加算の対象パラメータの記述が不正です: ${key}`);
      }
      return paramId;
    };
    dataManager.sparamIdToAddSparamDataId = function (paramId) {
      return sparamPlusDataIds[paramId].id;
    };
  }
  DataManager_AddSParamTraitMixIn(DataManager);
  function Game_BattlerBase_AddSParamTraitMixIn(gameBattlerBase) {
    const _sparam = gameBattlerBase.sparam;
    gameBattlerBase.sparam = function (paramId) {
      return _sparam.call(this, paramId) + this.sparamPlus(paramId);
    };
    gameBattlerBase.sparamPlus = function (paramId) {
      return this.traitsSum(Game_BattlerBase.TRAIT_SPARAM, DataManager.sparamIdToAddSparamDataId(paramId));
    };
  }
  Game_BattlerBase_AddSParamTraitMixIn(Game_BattlerBase.prototype);
})();
