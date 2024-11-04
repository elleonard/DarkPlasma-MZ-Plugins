import { pluginName } from '../../common/pluginName';

const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'] as const;

const XPARAM_KEYS = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'] as const;

const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'] as const;

type ParameterDataIds = {
  plus: UniqueTraitDataId[];
  rate: UniqueTraitDataId[];
};

const paramDataIds: ParameterDataIds = {
  plus: PARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_PARAM, paramId, () => TextManager.param(paramId))
  ),
  rate: PARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_PARAM, paramId + PARAM_KEYS.length, () => TextManager.param(paramId))
  ),
};

const xparamDataIds: ParameterDataIds = {
  plus: XPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_XPARAM, paramId, TextManager.xparam ? TextManager.xparam(paramId) : "")
  ),
  rate: XPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_XPARAM, paramId + XPARAM_KEYS.length, TextManager.xparam ? TextManager.xparam(paramId) : "")
  ),
};

const sparamDataIds: ParameterDataIds = {
  plus: SPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, paramId, TextManager.sparam ? TextManager.sparam(paramId) : "")
  ),
  rate: SPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_SPARAM, paramId + SPARAM_KEYS.length, TextManager.sparam ? TextManager.sparam(paramId) : "")
  ),
};

const partyAbilityDataIds: {
  param: ParameterDataIds;
  xparam: ParameterDataIds;
  sparam: ParameterDataIds;
} = {
  param: {
    plus: PARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
      .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId, () => TextManager.param(paramId))
    ),
    rate: PARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
      .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId + PARAM_KEYS.length, () => TextManager.param(paramId))
    ),
  },
  xparam: {
    plus: XPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
      .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId + PARAM_KEYS.length*2, TextManager.xparam ? TextManager.xparam(paramId) : "")
    ),
    rate: XPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
      .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId + PARAM_KEYS.length*2 + XPARAM_KEYS.length, TextManager.xparam ? TextManager.xparam(paramId) : "")
    ),
  },
  sparam: {
    plus: SPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
    .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId + PARAM_KEYS.length * 2 + XPARAM_KEYS.length * 2, TextManager.sparam ? TextManager.sparam(paramId) : "")
    ),
    rate: SPARAM_KEYS.map((_, paramId) => uniqueTraitDataIdCache
      .allocate(pluginName, Game_BattlerBase.TRAIT_PARTY_ABILITY, paramId + PARAM_KEYS.length * 2 + XPARAM_KEYS.length * 2 + SPARAM_KEYS.length, TextManager.sparam ? TextManager.sparam(paramId) : "")
    ),
  },
};

function DataManager_PartyAbilityTraitMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if ("traits" in data) {
      if (data.meta.partyAbility) {
        data.traits.push(...this.parsePartyAbility(String(data.meta.partyAbility)));
      }
    }
  };

  dataManager.parsePartyAbility = function (meta) {
    return meta.trim().split("\n").flatMap(line => this.parsePartyAbilityLine(line));
  };

  /**
   * metaタグを必要な特徴の組に変換する
   * 実際のパラメータ計算に用いるのはパーティ能力特徴
   * パラメータ系特徴は装備の絞り込みプラグイン用に追加だけし、効果を発揮しない
   */
  dataManager.parsePartyAbilityLine = function (line) {
    const metaTokens = line.split(":").map(token => token.trim());
    /**
     * 旧形式
     */
    if (metaTokens.length === 2) {
      const value = Number(metaTokens[1]);
      const paramId = PARAM_KEYS.indexOf(metaTokens[0] as typeof PARAM_KEYS[number]);
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
      const sparamId = SPARAM_KEYS.indexOf(metaTokens[0] as typeof SPARAM_KEYS[number]);
      if (sparamId >= 0) {
        return [
          {
            code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
            dataId: partyAbilityDataIds.sparam.rate[sparamId].id,
            value: value,
          },
          {
            code: Game_BattlerBase.TRAIT_SPARAM,
            dataId: sparamDataIds.rate[sparamId].id,
            value: value,
          },
        ];
      }
      throw Error(`パーティ能力特徴の記述が不正です: ${line}`);
    }
    const paramId = (() => {
      switch (metaTokens[0]) {
        case "paramPlus":
        case "paramRate":
          return PARAM_KEYS.indexOf(metaTokens[1] as typeof PARAM_KEYS[number]);
        case "xparamPlus":
        case "xparamRate":
          return XPARAM_KEYS.indexOf(metaTokens[1] as typeof XPARAM_KEYS[number]);
        case "sparamPlus":
        case "sparamRate":
          return SPARAM_KEYS.indexOf(metaTokens[1] as typeof SPARAM_KEYS[number]);
        default:
          throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
      }
    })();
    if (paramId < 0) {
      throw Error(`パーティ能力特徴 パラメータ名指定が不正です: ${metaTokens[1]}`);
    }
    const traitId =(() => {
      switch (metaTokens[0]) {
        case "paramPlus":
        case "paramRate":
          return Game_BattlerBase.TRAIT_PARAM;
        case "xparamPlus":
        case "xparamRate":
          return Game_BattlerBase.TRAIT_XPARAM;
        case "sparamPlus":
        case "sparamRate":
          return Game_BattlerBase.TRAIT_SPARAM;
        default:
          throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
      }
    })();
    const dataIds: [UniqueTraitDataId, UniqueTraitDataId] = (() => {
      switch (metaTokens[0]) {
        case "paramPlus":
          return [partyAbilityDataIds.param.plus[paramId], paramDataIds.plus[paramId]];
        case "paramRate":
          return [partyAbilityDataIds.param.rate[paramId], paramDataIds.rate[paramId]];
        case "xparamPlus":
          return [partyAbilityDataIds.xparam.plus[paramId], xparamDataIds.plus[paramId]];
        case "xparamRate":
          return [partyAbilityDataIds.xparam.rate[paramId], xparamDataIds.rate[paramId]];
        case "sparamPlus":
          return [partyAbilityDataIds.sparam.plus[paramId], sparamDataIds.plus[paramId]];
        case "sparamRate":
          return [partyAbilityDataIds.sparam.rate[paramId], sparamDataIds.rate[paramId]];
        default:
          throw Error(`パーティ能力特徴種別の記述が不正です: ${metaTokens[0]}`);
      }
    })();
    const value = metaTokens[0] === "paramPlus" ? Number(metaTokens[2]) : Number(metaTokens[2])/100;
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

function Game_Actor_PartyAbilityTraitMixIn(gameActor: Game_Actor) {
  const _paramBasePlus = gameActor.paramBasePlus;
  gameActor.paramBasePlus = function (paramId) {
    return Math.max(0, _paramBasePlus.call(this, paramId) + this.paramPlusByPartyAbility(paramId));
  };

  /**
   * ステータス計算用の一時パーティをセットする
   * 一時アクターにのみセットされるため、この値はセーブデータには含まれない
   * @param {Game_Party} tempParty ステータス計算用一時パーティ
   */
  gameActor.setTempParty = function (tempParty: Game_Party) {
    this._tempParty = tempParty;
  };

  gameActor.paramPlusByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).paramPlusByPartyAbility(paramId);
  };

  gameActor.paramRateByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).paramRateByPartyAbility(paramId);
  }

  const _xparam = gameActor.xparam;
  gameActor.xparam = function (paramId) {
    return _xparam.call(this, paramId) + this.xparamPlusByPartyAbility(paramId);
  };

  const _xparamRate = gameActor.xparamRate;
  gameActor.xparamRate = function (paramId) {
    return _xparamRate.call(this, paramId) * this.xparamRateByPartyAbility(paramId);
  };

  gameActor.xparamPlusByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).xparamPlusByPartyAbility(paramId);
  };

  gameActor.xparamRateByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).xparamRateByPartyAbility(paramId);
  };

  const _sparam = gameActor.sparam;
  gameActor.sparam = function (paramId) {
    return _sparam.call(this, paramId) * this.sparamRateByPartyAbility(paramId) + this.sparamPlusByPartyAbility(paramId);
  };

  gameActor.sparamPlusByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).sparamPlusByPartyAbility(paramId);
  };

  gameActor.sparamRateByPartyAbility = function (paramId) {
    return (this._tempParty || $gameParty).sparamRateByPartyAbility(paramId);
  };
}

Game_Actor_PartyAbilityTraitMixIn(Game_Actor.prototype);

function Game_Party_PartyAbilityTraitMixIn(gameParty: Game_Party) {
  /**
   * 通常能力値を加算するパーティ能力のパーティ全体の合計
   */
  gameParty.paramPlusByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.param.plus[paramId].id), 0);
  };

  /**
   * 通常能力値を乗算するパーティ能力のパーティ全体の倍率
   */
  gameParty.paramRateByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.param.rate[paramId].id),1);
  };

  /**
   * 追加能力値を加算するパーティ能力のパーティ全体の合計
   */
  gameParty.xparamPlusByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.xparam.plus[paramId].id), 0);
  };

  /**
   * 追加能力値を蒸散するパーティ能力のパーティ全体の倍率
   */
  gameParty.xparamRateByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.xparam.rate[paramId].id), 1);
  };

  /**
   * 特殊能力値を加算するパーティ能力のパーティ全体の合計
   */
  gameParty.sparamPlusByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.sparam.plus[paramId].id), 0);
  };

  /**
   * 特殊能力値を乗算するパーティ能力のパーティ全体の倍率
   */
  gameParty.sparamRateByPartyAbility = function (paramId) {
    return this.allMembers().reduce((result, actor) => result * actor.traitsPi(Game_BattlerBase.TRAIT_PARTY_ABILITY, partyAbilityDataIds.sparam.rate[paramId].id), 1);
  };
}

Game_Party_PartyAbilityTraitMixIn(Game_Party.prototype);

function Window_EquipStatus_PartyAbilityTraitMixIn(windowEquipStatus: Window_EquipStatus) {
  const _setTempActor = windowEquipStatus.setTempActor;
  windowEquipStatus.setTempActor = function (tempActor) {
    if (this._tempActor !== tempActor && tempActor) {
      /**
       * 表示ステータス計算用の一時パーティ生成
       */
      const party = new Game_Party();
      $gameParty.allMembers().forEach((actor) => party.addActor(actor.actorId()));
      party.allMembers = function () {
        return this._actors.map((id) => (id === tempActor.actorId() ? tempActor : $gameActors.actor(id))).filter((actor): actor is Game_Actor => !!actor);
      };
      tempActor.setTempParty(party);
    }
    _setTempActor.call(this, tempActor);
  };
}

Window_EquipStatus_PartyAbilityTraitMixIn(Window_EquipStatus.prototype);
