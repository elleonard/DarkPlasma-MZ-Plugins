// DarkPlasma_PartyAbilityTraitExtension 2.1.0
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2026/06/25 2.1.0 全特徴をuniqueTraitIdCacheで確保するように変更
 *                  ステート有効度乗算、ステート有効度加算を追加
 *                  正常に動作しない不具合を修正
 * 2026/06/24 2.0.0 configをTypeScript移行
 *                  旧形式の記述サポートを終了
 *                  特徴の展開を遅延評価に変更
 *                  属性有効度乗算、属性有効度加算を追加
 * 2024/11/05 1.2.3 通常能力値乗算が効かない不具合を修正
 *                  競合により特殊能力値加算、追加能力値乗算が効かない不具合を修正
 *                  AddSParamTrait、MultiplyXParamTraitとの順序を明示
 * 2024/11/04 1.2.2 旧形式の記述で特殊能力値乗算が100倍になる不具合を修正
 *            1.2.1 特殊能力値乗算が正常に働かない不具合を修正
 *            1.2.0 メモ欄の記法を一新
 *                  通常能力値乗算、特殊能力値加算、追加能力値に対応
 * 2024/03/17 1.1.2 TypeScript移行
 * 2022/05/08 1.1.1 乗算系能力を1％以上100％未満にできない不具合を修正
 * 2021/08/24 1.1.0 装備絞り込みプラグインに対応
 * 2021/07/05 1.0.1 MZ 1.3.2に対応
 * 2021/06/27 1.0.0 公開
 */

/*:
 * @plugindesc パーティ能力特徴を追加する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_MultiplyXParamTrait
 * @base DarkPlasma_AddSParamTrait
 * @base DarkPlasma_AllocateUniqueTraitId
 * @base DarkPlasma_LazyExtractData
 * @orderAfter DarkPlasma_FilterEquip
 * @orderAfter DarkPlasma_MultiplyXParamTrait
 * @orderAfter DarkPlasma_AddSParamTrait
 * @orderAfter DarkPlasma_AllocateUniqueTraitId
 * @orderAfter DarkPlasma_LazyExtractData
 *
 * @help
 * version: 2.1.0
 * パーティ能力特徴を追加します。
 * アクター/職業/装備/ステートのメモ欄に指定の記述を行うことで、
 * パーティ全体に効果を及ぼす特徴を付与できます。
 *
 * 基本構文:
 * <partyAbility:[trait]:[data]:[value]>
 * パーティ全体に[trait]で指定した特徴を、
 * 特徴データ[data], 効果量[value]で付与します。
 *
 * 記述例
 * 最大HP+10:
 * <partyAbility:paramPlus:mhp:10>
 *
 * 会心率+20:
 * <partyAbility:xparamPlus:cri:20>
 *
 * 床ダメージ率*0:
 * <partyAbility:sparamRate:fdr:0>
 *
 * 火属性有効度*110％:
 * <partyAbility:elementRate:火:110>
 *
 * ステートID4有効度+20％:
 * <partyAbility:stateRatePlus:4:20>
 *
 * 上記すべてを設定する
 * <partyAbility:
 *   paramPlus:mhp:10
 *   xparamPlus:cri:20
 *   sparamRate:fdr:0
 *   elementRate:火:110
 *   stateRatePlus:4:20
 * >
 *
 * [trait]:
 *   paramPlus: パラメータ加算
 *   paramRate: パラメータ乗算
 *   xparamPlus: 追加能力値加算(※1)
 *   xparamRate: 追加能力値乗算
 *   sparamPlus: 特殊能力値加算
 *   sparamRate: 特殊能力値乗算(※2)
 *   elementRate: 属性有効度乗算
 *   elementRatePlus: 属性有効度加算(※3)
 *   stateRate: ステート有効度乗算
 *   stateRatePlus: ステート有効度加算(※4)
 *
 * param系特徴の[data]:
 *   mhp: 最大HP
 *   mmp: 最大MP
 *   atk: 攻撃力
 *   def: 防御力
 *   mat: 魔法攻撃力
 *   mdf: 魔法防御力
 *   agi: 敏捷性
 *   luk: 運
 *
 * xparam系特徴の[data]:
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
 * sparam系特徴の[data]:
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
 * ※1: 追加能力値加算
 * パーティ能力による加算は乗算の対象外になります。
 *
 * ※2: 特殊能力値乗算
 * パーティ能力による乗算は加算の後に行います。
 *
 * ※3: 属性有効度加算
 * パーティ能力による加算は乗算の対象外になります。
 *
 * ※4: ステート有効度加算
 * パーティ能力による加算は乗算の対象外になります。
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_MultiplyXParamTrait version:1.0.1
 * DarkPlasma_AddSParamTrait version:1.0.2
 * DarkPlasma_AllocateUniqueTraitId version:1.0.3
 * DarkPlasma_LazyExtractData version:1.0.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_FilterEquip
 * DarkPlasma_MultiplyXParamTrait
 * DarkPlasma_AddSParamTrait
 * DarkPlasma_AllocateUniqueTraitId
 * DarkPlasma_LazyExtractData
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  function hasTraits(data) {
    return 'traits' in data;
  }

  const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
  const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
  const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'];
  const $paramPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    0,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARAM),
  );
  const $paramRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    1,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARAM),
  );
  const $xparamPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    2,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_XPARAM),
  );
  const $xparamRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    3,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_XPARAM),
  );
  const $sparamPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    4,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_SPARAM),
  );
  const $sparamRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    5,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_SPARAM),
  );
  const $elementRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    6,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_ELEMENT_RATE),
  );
  const $elementRatePlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    7,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_ELEMENT_RATE),
  );
  const $stateRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    8,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_STATE_RATE),
  );
  const $stateRatePlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    9,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_STATE_RATE),
  );
  const $partyParamPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    10,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyParamRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    11,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyXparamPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    12,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyXparamRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    13,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partySparamPlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    14,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partySparamRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    15,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyElementRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    16,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyElementRatePlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    17,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyStateRateTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    18,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  const $partyStateRatePlusTraitId = uniqueTraitIdCache.allocate(
    pluginName,
    19,
    Game_BattlerBase.TRAIT_NAME(Game_BattlerBase.TRAIT_PARTY_ABILITY),
  );
  function DataManager_PartyAbilityTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if (hasTraits(data)) {
        if (data.meta.partyAbility) {
          this.pushLazyExtractData(data);
        }
      }
    };
    const _lazyExtractMetadata = dataManager.lazyExtractMetadata;
    dataManager.lazyExtractMetadata = function (data) {
      _lazyExtractMetadata.call(this, data);
      if (hasTraits(data) && data.meta.partyAbility) {
        data.traits.push(...this.parsePartyAbility(String(data.meta.partyAbility)));
      }
    };
    dataManager.parsePartyAbility = function (meta) {
      return meta
        .trim()
        .split('\n')
        .flatMap((line) => this.parsePartyAbilityLine(line));
    };
    dataManager.parsePartyAbilityLine = function (line) {
      const metaTokens = line.split(':').map((token) => token.trim());
      const paramId = (() => {
        switch (metaTokens[0]) {
          case 'paramPlus':
          case 'paramRate':
            return PARAM_KEYS.indexOf(metaTokens[1]);
          case 'xparamPlus':
          case 'xparamRate':
            return XPARAM_KEYS.indexOf(metaTokens[1]);
          case 'sparamPlus':
          case 'sparamRate':
            return SPARAM_KEYS.indexOf(metaTokens[1]);
          case 'elementRate':
          case 'elementRatePlus':
            return $dataSystem.elements.indexOf(metaTokens[1]);
          case 'stateRate':
            return $dataStates.findIndex((state) => state?.id === Number(metaTokens[1]));
          case 'stateRatePlus':
            return $dataStates.findIndex((state) => state?.id === Number(metaTokens[1]));
          default:
            throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
        }
      })();
      if (paramId < 0) {
        throw Error(`パーティ能力特徴 パラメータ名指定が不正です: ${metaTokens[1]}`);
      }
      const traitId = (() => {
        switch (metaTokens[0]) {
          case 'paramPlus':
            return $paramPlusTraitId.id;
          case 'paramRate':
            return $paramRateTraitId.id;
          case 'xparamPlus':
            return $xparamPlusTraitId.id;
          case 'xparamRate':
            return $xparamRateTraitId.id;
          case 'sparamPlus':
            return $sparamPlusTraitId.id;
          case 'sparamRate':
            return $sparamRateTraitId.id;
          case 'elementRate':
            return $elementRateTraitId.id;
          case 'elementRatePlus':
            return $elementRatePlusTraitId.id;
          case 'stateRate':
            return $stateRateTraitId.id;
          case 'stateRatePlus':
            return $stateRatePlusTraitId.id;
          default:
            throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
        }
      })();
      const partyTraitId = (() => {
        switch (metaTokens[0]) {
          case 'paramPlus':
            return $partyParamPlusTraitId.id;
          case 'paramRate':
            return $partyParamRateTraitId.id;
          case 'xparamPlus':
            return $partyXparamPlusTraitId.id;
          case 'xparamRate':
            return $partyXparamRateTraitId.id;
          case 'sparamPlus':
            return $partySparamPlusTraitId.id;
          case 'sparamRate':
            return $partySparamRateTraitId.id;
          case 'elementRate':
            return $partyElementRateTraitId.id;
          case 'elementRatePlus':
            return $partyElementRatePlusTraitId.id;
          case 'stateRate':
            return $partyStateRateTraitId.id;
          case 'stateRatePlus':
            return $partyStateRatePlusTraitId.id;
          default:
            throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
        }
      })();
      const value = metaTokens[0] === 'paramPlus' ? Number(metaTokens[2]) : Number(metaTokens[2]) / 100;
      return [
        { code: traitId, dataId: paramId, value: value },
        { code: partyTraitId, dataId: paramId, value: value },
      ];
    };
  }
  DataManager_PartyAbilityTraitMixIn(DataManager);
  const _TRAIT_NAME = Game_BattlerBase.TRAIT_NAME;
  Game_BattlerBase.TRAIT_NAME = function (traitId) {
    const name = _TRAIT_NAME?.call(this, traitId);
    if (name) {
      return name;
    }
    switch (traitId) {
      case Game_BattlerBase.TRAIT_PARAM:
        return '通常能力値';
      case Game_BattlerBase.TRAIT_XPARAM:
        return '追加能力値';
      case Game_BattlerBase.TRAIT_SPARAM:
        return '特殊能力値';
      case Game_BattlerBase.TRAIT_ELEMENT_RATE:
        return '属性有効度';
      case Game_BattlerBase.TRAIT_STATE_RATE:
        return 'ステート有効度';
      case Game_BattlerBase.TRAIT_PARTY_ABILITY:
        return 'パーティ能力';
    }
    return '';
  };
  function Game_BattlerBase_PartyAbilityTraitMixIn(gameBattlerBase) {
    const _paramBasePlus = gameBattlerBase.paramBasePlus;
    gameBattlerBase.paramBasePlus = function (paramId) {
      return Math.max(0, _paramBasePlus.call(this, paramId) + this.paramPlusByPartyAbility(paramId));
    };
    const _paramRate = gameBattlerBase.paramRate;
    gameBattlerBase.paramRate = function (paramId) {
      return _paramRate.call(this, paramId) * this.paramRateByPartyAbility(paramId);
    };
    gameBattlerBase.paramPlusByPartyAbility = function (_paramId) {
      return 0;
    };
    gameBattlerBase.paramRateByPartyAbility = function (_paramId) {
      return 1;
    };
    const _xparam = gameBattlerBase.xparam;
    gameBattlerBase.xparam = function (paramId) {
      return _xparam.call(this, paramId) + this.xparamPlusByPartyAbility(paramId);
    };
    const _xparamRate = gameBattlerBase.xparamRate;
    gameBattlerBase.xparamRate = function (paramId) {
      return _xparamRate.call(this, paramId) * this.xparamRateByPartyAbility(paramId);
    };
    gameBattlerBase.xparamPlusByPartyAbility = function (_paramId) {
      return 0;
    };
    gameBattlerBase.xparamRateByPartyAbility = function (_paramId) {
      return 1;
    };
    const _sparam = gameBattlerBase.sparam;
    gameBattlerBase.sparam = function (paramId) {
      return _sparam.call(this, paramId) * this.sparamRateByPartyAbility(paramId);
    };
    const _sparamPlus = gameBattlerBase.sparamPlus;
    gameBattlerBase.sparamPlus = function (paramId) {
      return _sparamPlus.call(this, paramId) + this.sparamPlusByPartyAbility(paramId);
    };
    gameBattlerBase.sparamPlusByPartyAbility = function (_paramId) {
      return 0;
    };
    gameBattlerBase.sparamRateByPartyAbility = function (_paramId) {
      return 1;
    };
    const _elementRate = gameBattlerBase.elementRate;
    gameBattlerBase.elementRate = function (elementId) {
      return (
        _elementRate.call(this, elementId) * this.elementRateByPartyAbility(elementId) +
        this.elementRatePlusByPartyAbility(elementId)
      );
    };
    gameBattlerBase.elementRateByPartyAbility = function (_elementId) {
      return 1;
    };
    gameBattlerBase.elementRatePlusByPartyAbility = function (_elementId) {
      return 0;
    };
    const _stateRate = gameBattlerBase.stateRate;
    gameBattlerBase.stateRate = function (stateId) {
      return (
        _stateRate.call(this, stateId) * this.stateRateByPartyAbility(stateId) +
        this.stateRatePlusByPartyAbility(stateId)
      );
    };
    gameBattlerBase.stateRateByPartyAbility = function (_stateId) {
      return 1;
    };
    gameBattlerBase.stateRatePlusByPartyAbility = function (_stateId) {
      return 0;
    };
  }
  Game_BattlerBase_PartyAbilityTraitMixIn(Game_BattlerBase.prototype);
  function Game_Actor_PartyAbilityTraitMixIn(gameActor) {
    /**
     * ステータス計算用の一時パーティをセットする
     * 一時アクターにのみセットされるため、この値はセーブデータには含まれない
     * @param {Game_Party} tempParty ステータス計算用一時パーティ
     */
    gameActor.setTempParty = function (tempParty) {
      this._tempParty = tempParty;
    };
    gameActor.paramPlusByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).paramPlusByPartyAbility(paramId);
    };
    gameActor.paramRateByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).paramRateByPartyAbility(paramId);
    };
    gameActor.xparamPlusByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).xparamPlusByPartyAbility(paramId);
    };
    gameActor.xparamRateByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).xparamRateByPartyAbility(paramId);
    };
    gameActor.sparamPlusByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).sparamPlusByPartyAbility(paramId);
    };
    gameActor.sparamRateByPartyAbility = function (paramId) {
      return (this._tempParty || $gameParty).sparamRateByPartyAbility(paramId);
    };
    gameActor.elementRateByPartyAbility = function (elementId) {
      return (this._tempParty || $gameParty).elementRateByPartyAbility(elementId);
    };
    gameActor.elementRatePlusByPartyAbility = function (elementId) {
      return (this._tempParty || $gameParty).elementRatePlusByPartyAbility(elementId);
    };
    gameActor.stateRateByPartyAbility = function (stateId) {
      return (this._tempParty || $gameParty).stateRateByPartyAbility(stateId);
    };
    gameActor.stateRatePlusByPartyAbility = function (stateId) {
      return (this._tempParty || $gameParty).stateRatePlusByPartyAbility(stateId);
    };
  }
  Game_Actor_PartyAbilityTraitMixIn(Game_Actor.prototype);
  function Game_Party_PartyAbilityTraitMixIn(gameParty) {
    gameParty.paramPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result + actor.traitsSum($paramPlusTraitId.id, paramId), 0);
    };
    gameParty.paramRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result * actor.traitsPi($paramRateTraitId.id, paramId), 1);
    };
    gameParty.xparamPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result + actor.traitsSum($xparamPlusTraitId.id, paramId), 0);
    };
    gameParty.xparamRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result * actor.traitsPi($xparamRateTraitId.id, paramId), 1);
    };
    gameParty.sparamPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result + actor.traitsSum($sparamPlusTraitId.id, paramId), 0);
    };
    gameParty.sparamRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce((result, actor) => result * actor.traitsPi($sparamRateTraitId.id, paramId), 1);
    };
    gameParty.elementRateByPartyAbility = function (elementId) {
      return this.allMembers().reduce((result, actor) => result * actor.traitsPi($elementRateTraitId.id, elementId), 1);
    };
    gameParty.elementRatePlusByPartyAbility = function (elementId) {
      return this.allMembers().reduce(
        (result, actor) => result + actor.traitsSum($elementRatePlusTraitId.id, elementId),
        0,
      );
    };
    gameParty.stateRateByPartyAbility = function (stateId) {
      return this.allMembers().reduce((result, actor) => result * actor.traitsPi($stateRateTraitId.id, stateId), 1);
    };
    gameParty.stateRatePlusByPartyAbility = function (stateId) {
      return this.allMembers().reduce(
        (result, actor) => result + actor.traitsSum($stateRatePlusTraitId.id, stateId),
        0,
      );
    };
  }
  Game_Party_PartyAbilityTraitMixIn(Game_Party.prototype);
  function Scene_Equip_PartyAbilityTraitMixIn(sceneEquip) {
    const _equipFilterBuilder = sceneEquip.equipFilterBuilder;
    sceneEquip.equipFilterBuilder = function (equips) {
      return _equipFilterBuilder
        .call(this, equips)
        .withTrait($paramPlusTraitId.id)
        .withTrait($paramRateTraitId.id)
        .withTrait($xparamPlusTraitId.id)
        .withTrait($xparamRateTraitId.id)
        .withTrait($sparamPlusTraitId.id)
        .withTrait($sparamRateTraitId.id)
        .withTrait($elementRateTraitId.id)
        .withTrait($elementRatePlusTraitId.id)
        .withTrait($stateRateTraitId.id)
        .withTrait($stateRatePlusTraitId.id)
        .withTrait($partyParamPlusTraitId.id)
        .withTrait($partyParamRateTraitId.id)
        .withTrait($partyXparamPlusTraitId.id)
        .withTrait($partyXparamRateTraitId.id)
        .withTrait($partySparamPlusTraitId.id)
        .withTrait($partySparamRateTraitId.id)
        .withTrait($partyElementRateTraitId.id)
        .withTrait($partyElementRatePlusTraitId.id)
        .withTrait($partyStateRateTraitId.id)
        .withTrait($partyStateRatePlusTraitId.id)
        .withTraitToEffectNameRule((traitId, dataId) => {
          if (
            traitId === $paramPlusTraitId.id ||
            traitId === $paramRateTraitId.id ||
            traitId === $partyParamPlusTraitId.id ||
            traitId === $partyParamRateTraitId.id
          )
            return TextManager.param(dataId) || null;
          if (
            traitId === $xparamPlusTraitId.id ||
            traitId === $xparamRateTraitId.id ||
            traitId === $partyXparamPlusTraitId.id ||
            traitId === $partyXparamRateTraitId.id
          )
            return (TextManager.xparam ? TextManager.xparam(dataId) : null) || null;
          if (
            traitId === $sparamPlusTraitId.id ||
            traitId === $sparamRateTraitId.id ||
            traitId === $partySparamPlusTraitId.id ||
            traitId === $partySparamRateTraitId.id
          )
            return (TextManager.sparam ? TextManager.sparam(dataId) : null) || null;
          if (
            traitId === $elementRateTraitId.id ||
            traitId === $elementRatePlusTraitId.id ||
            traitId === $partyElementRateTraitId.id ||
            traitId === $partyElementRatePlusTraitId.id
          )
            return $dataSystem.elements[dataId] || null;
          if (
            traitId === $stateRateTraitId.id ||
            traitId === $stateRatePlusTraitId.id ||
            traitId === $partyStateRateTraitId.id ||
            traitId === $partyStateRatePlusTraitId.id
          )
            return $dataStates[dataId]?.name || null;
          return null;
        });
    };
  }
  Scene_Equip_PartyAbilityTraitMixIn(Scene_Equip.prototype);
  function Window_EquipStatus_PartyAbilityTraitMixIn(windowEquipStatus) {
    const _setTempActor = windowEquipStatus.setTempActor;
    windowEquipStatus.setTempActor = function (tempActor) {
      if (this._tempActor !== tempActor && tempActor) {
        /**
         * 表示ステータス計算用の一時パーティ生成
         */
        const party = new Game_Party();
        $gameParty.allMembers().forEach((actor) => party.addActor(actor.actorId()));
        party.allMembers = function () {
          return this._actors
            .map((id) => (id === tempActor.actorId() ? tempActor : $gameActors.actor(id)))
            .filter((actor) => !!actor);
        };
        tempActor.setTempParty(party);
      }
      _setTempActor.call(this, tempActor);
    };
  }
  Window_EquipStatus_PartyAbilityTraitMixIn(Window_EquipStatus.prototype);
})();
