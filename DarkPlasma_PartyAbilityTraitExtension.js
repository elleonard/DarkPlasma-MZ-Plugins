// DarkPlasma_PartyAbilityTraitExtension 1.2.3
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * @base DarkPlasma_AllocateUniqueTraitDataId
 * @orderAfter DarkPlasma_FilterEquip
 * @orderAfter DarkPlasma_AllocateUniqueTraitDataId
 * @orderAfter DarkPlasma_MultiplyXParamTrait
 * @orderAfter DarkPlasma_AddSParamTrait
 *
 * @help
 * version: 1.2.3
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
 * 上記すべてを設定する
 * <partyAbility:
 *   paramPlus:mhp:10
 *   xparamPlus:cri:20
 *   sparamRate:fdr:0
 * >
 *
 * [trait]:
 *   paramPlus: パラメータ加算
 *   paramRate: パラメータ乗算
 *   xparamPlus: 追加能力値加算(※1)
 *   xparamRate: 追加能力値乗算
 *   sparamPlus: 特殊能力値加算
 *   sparamRate: 特殊能力値乗算(※2)
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
 * 以下の構文は非推奨です。
 * 互換性のために維持していますが、
 * 次のメジャーバージョンアップで廃止されます。
 * <partyAbility:[effect]:[value]>
 * パーティ全体に[effect]で指定した効果を、効果量[value]で付与します。
 *
 * [effect]:
 *   mhp: 最大HP加算
 *   mmp: 最大MP加算
 *   atk: 攻撃力加算
 *   def: 防御力加算
 *   mat: 魔法攻撃力加算
 *   mdf: 魔法防御力加算
 *   agi: 敏捷性加算
 *   luk: 運加算
 *
 *   tgr: 狙われ率乗算
 *   grd: 防御効果率乗算
 *   rec: 回復効果率乗算
 *   pha: 薬の知識乗算
 *   mcr: MP消費率乗算
 *   tcr: TPチャージ率乗算
 *   pdr: 物理ダメージ率乗算
 *   mdr: 魔法ダメージ率乗算
 *   fdr: 床ダメージ率乗算
 *   exr: 経験値獲得率乗算
 *
 * 設定例
 * 最大HP+10:
 * <partyAbility:mhp:10>
 *
 * 床ダメージ率*0:
 * <partyAbility:fdr:0>
 *
 * MP消費率 80％:
 * <partyAbility:mcr:80>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_MultiplyXParamTrait version:1.0.1
 * DarkPlasma_AddSParamTrait version:1.0.2
 * DarkPlasma_AllocateUniqueTraitDataId version:1.1.0
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_FilterEquip
 * DarkPlasma_AllocateUniqueTraitDataId
 * DarkPlasma_MultiplyXParamTrait
 * DarkPlasma_AddSParamTrait
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
  const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
  const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'];
  const paramDataIds = {
    plus: PARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_PARAM, paramId, () =>
        TextManager.param(paramId),
      ),
    ),
    rate: PARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_PARAM, paramId + PARAM_KEYS.length, () =>
        TextManager.param(paramId),
      ),
    ),
  };
  const xparamDataIds = {
    plus: XPARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(
        pluginName,
        Game_BattlerBase.TRAIT_XPARAM,
        paramId,
        TextManager.xparam ? TextManager.xparam(paramId) : '',
      ),
    ),
    rate: XPARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(
        pluginName,
        Game_BattlerBase.TRAIT_XPARAM,
        paramId + XPARAM_KEYS.length,
        TextManager.xparam ? TextManager.xparam(paramId) : '',
      ),
    ),
  };
  const sparamDataIds = {
    plus: SPARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(
        pluginName,
        Game_BattlerBase.TRAIT_SPARAM,
        paramId,
        TextManager.sparam ? TextManager.sparam(paramId) : '',
      ),
    ),
    rate: SPARAM_KEYS.map((_, paramId) =>
      uniqueTraitDataIdCache.allocate(
        pluginName,
        Game_BattlerBase.TRAIT_SPARAM,
        paramId + SPARAM_KEYS.length,
        TextManager.sparam ? TextManager.sparam(paramId) : '',
      ),
    ),
  };
  const partyAbilityDataIds = {
    param: {
      plus: PARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId, () =>
          TextManager.param(paramId),
        ),
      ),
      rate: PARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(
          pluginName,
          Game_BattlerBase.TRAIT_PARTY_ABILITY,
          paramId + PARAM_KEYS.length,
          () => TextManager.param(paramId),
        ),
      ),
    },
    xparam: {
      plus: XPARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(
          pluginName,
          Game_BattlerBase.TRAIT_PARTY_ABILITY,
          paramId + PARAM_KEYS.length * 2,
          TextManager.xparam ? TextManager.xparam(paramId) : '',
        ),
      ),
      rate: XPARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(
          pluginName,
          Game_BattlerBase.TRAIT_PARTY_ABILITY,
          paramId + PARAM_KEYS.length * 2 + XPARAM_KEYS.length,
          TextManager.xparam ? TextManager.xparam(paramId) : '',
        ),
      ),
    },
    sparam: {
      plus: SPARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(
          pluginName,
          Game_BattlerBase.TRAIT_PARTY_ABILITY,
          paramId + PARAM_KEYS.length * 2 + XPARAM_KEYS.length * 2,
          TextManager.sparam ? TextManager.sparam(paramId) : '',
        ),
      ),
      rate: SPARAM_KEYS.map((_, paramId) =>
        uniqueTraitDataIdCache.allocate(
          pluginName,
          Game_BattlerBase.TRAIT_PARTY_ABILITY,
          paramId + PARAM_KEYS.length * 2 + XPARAM_KEYS.length * 2 + SPARAM_KEYS.length,
          TextManager.sparam ? TextManager.sparam(paramId) : '',
        ),
      ),
    },
  };
  function DataManager_PartyAbilityTraitMixIn(dataManager) {
    const _extractMetadata = dataManager.extractMetadata;
    dataManager.extractMetadata = function (data) {
      _extractMetadata.call(this, data);
      if ('traits' in data) {
        if (data.meta.partyAbility) {
          data.traits.push(...this.parsePartyAbility(String(data.meta.partyAbility)));
        }
      }
    };
    dataManager.parsePartyAbility = function (meta) {
      return meta
        .trim()
        .split('\n')
        .flatMap((line) => this.parsePartyAbilityLine(line));
    };
    /**
     * metaタグを必要な特徴の組に変換する
     * 実際のパラメータ計算に用いるのはパーティ能力特徴
     * パラメータ系特徴は装備の絞り込みプラグイン用に追加だけし、効果を発揮しない
     */
    dataManager.parsePartyAbilityLine = function (line) {
      const metaTokens = line.split(':').map((token) => token.trim());
      /**
       * 旧形式
       */
      if (metaTokens.length === 2) {
        const value = Number(metaTokens[1]);
        const paramId = PARAM_KEYS.indexOf(metaTokens[0]);
        if (paramId >= 0) {
          return [
            {
              code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
              dataId: partyAbilityDataIds.param.plus[paramId].id,
              value: value,
            },
            {
              code: Game_BattlerBase.TRAIT_PARAM,
              dataId: paramDataIds.plus[paramId].id,
              value: value,
            },
          ];
        }
        const sparamId = SPARAM_KEYS.indexOf(metaTokens[0]);
        if (sparamId >= 0) {
          return [
            {
              code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
              dataId: partyAbilityDataIds.sparam.rate[sparamId].id,
              value: value / 100,
            },
            {
              code: Game_BattlerBase.TRAIT_SPARAM,
              dataId: sparamDataIds.rate[sparamId].id,
              value: value / 100,
            },
          ];
        }
        throw Error(`パーティ能力特徴の記述が不正です: ${line}`);
      }
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
          case 'paramRate':
            return Game_BattlerBase.TRAIT_PARAM;
          case 'xparamPlus':
          case 'xparamRate':
            return Game_BattlerBase.TRAIT_XPARAM;
          case 'sparamPlus':
          case 'sparamRate':
            return Game_BattlerBase.TRAIT_SPARAM;
          default:
            throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
        }
      })();
      const dataIds = (() => {
        switch (metaTokens[0]) {
          case 'paramPlus':
            return [partyAbilityDataIds.param.plus[paramId], paramDataIds.plus[paramId]];
          case 'paramRate':
            return [partyAbilityDataIds.param.rate[paramId], paramDataIds.rate[paramId]];
          case 'xparamPlus':
            return [partyAbilityDataIds.xparam.plus[paramId], xparamDataIds.plus[paramId]];
          case 'xparamRate':
            return [partyAbilityDataIds.xparam.rate[paramId], xparamDataIds.rate[paramId]];
          case 'sparamPlus':
            return [partyAbilityDataIds.sparam.plus[paramId], sparamDataIds.plus[paramId]];
          case 'sparamRate':
            return [partyAbilityDataIds.sparam.rate[paramId], sparamDataIds.rate[paramId]];
          default:
            throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
        }
      })();
      const value = metaTokens[0] === 'paramPlus' ? Number(metaTokens[2]) : Number(metaTokens[2]) / 100;
      return [
        {
          code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
          dataId: dataIds[0].id,
          value: value,
        },
        {
          code: traitId,
          dataId: dataIds[1].id,
          value: value,
        },
      ];
    };
  }
  DataManager_PartyAbilityTraitMixIn(DataManager);
  function Game_BattlerBase_PartyAbilityTraitMixIn(gameBattlerBase) {
    const _paramBasePlus = gameBattlerBase.paramBasePlus;
    gameBattlerBase.paramBasePlus = function (paramId) {
      return Math.max(0, _paramBasePlus.call(this, paramId) + this.paramPlusByPartyAbility(paramId));
    };
    const _paramRate = gameBattlerBase.paramRate;
    gameBattlerBase.paramRate = function (paramId) {
      return _paramRate.call(this, paramId) * this.paramRateByPartyAbility(paramId);
    };
    gameBattlerBase.paramPlusByPartyAbility = function (paramId) {
      return 0;
    };
    gameBattlerBase.paramRateByPartyAbility = function (paramId) {
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
    gameBattlerBase.xparamPlusByPartyAbility = function (paramId) {
      return 0;
    };
    gameBattlerBase.xparamRateByPartyAbility = function (paramId) {
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
    gameBattlerBase.sparamPlusByPartyAbility = function (paramId) {
      return 0;
    };
    gameBattlerBase.sparamRateByPartyAbility = function (paramId) {
      return 1;
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
  }
  Game_Actor_PartyAbilityTraitMixIn(Game_Actor.prototype);
  function Game_Party_PartyAbilityTraitMixIn(gameParty) {
    /**
     * 通常能力値を加算するパーティ能力のパーティ全体の合計
     */
    gameParty.paramPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.param.plus[paramId].id),
        0,
      );
    };
    /**
     * 通常能力値を乗算するパーティ能力のパーティ全体の倍率
     */
    gameParty.paramRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.param.rate[paramId].id),
        1,
      );
    };
    /**
     * 追加能力値を加算するパーティ能力のパーティ全体の合計
     */
    gameParty.xparamPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.xparam.plus[paramId].id),
        0,
      );
    };
    /**
     * 追加能力値を蒸散するパーティ能力のパーティ全体の倍率
     */
    gameParty.xparamRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.xparam.rate[paramId].id),
        1,
      );
    };
    /**
     * 特殊能力値を加算するパーティ能力のパーティ全体の合計
     */
    gameParty.sparamPlusByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.sparam.plus[paramId].id),
        0,
      );
    };
    /**
     * 特殊能力値を乗算するパーティ能力のパーティ全体の倍率
     */
    gameParty.sparamRateByPartyAbility = function (paramId) {
      return this.allMembers().reduce(
        (result, actor) =>
          result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.sparam.rate[paramId].id),
        1,
      );
    };
  }
  Game_Party_PartyAbilityTraitMixIn(Game_Party.prototype);
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
