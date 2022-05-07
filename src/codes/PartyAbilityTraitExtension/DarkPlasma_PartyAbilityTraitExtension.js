import { pluginName } from '../../common/pluginName';

const _Game_Actor_paramBasePlus = Game_Actor.prototype.paramBasePlus;
Game_Actor.prototype.paramBasePlus = function (paramId) {
  return Math.max(0, _Game_Actor_paramBasePlus.call(this, paramId) + this.paramPlusByPartyAbility(paramId));
};

/**
 * ステータス計算用の一時パーティをセットする
 * 一時アクターにのみセットされるため、この値はセーブデータには含まれない
 * @param {Game_Party} tempParty ステータス計算用一時パーティ
 */
Game_Actor.prototype.setTempParty = function (tempParty) {
  this._tempParty = tempParty;
};

Game_Actor.prototype.paramPlusByPartyAbility = function (paramId) {
  const party = this._tempParty ? this._tempParty : $gameParty;
  return party.paramPlusByPartyAbility(paramId);
};

const _Game_Actor_sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function (paramId) {
  return _Game_Actor_sparam.call(this, paramId) * this.sparamRateByPartyAbility(paramId);
};

Game_Actor.prototype.sparamRateByPartyAbility = function (paramId) {
  return $gameParty.sparamRateByPartyAbility(paramId);
};

/**
 * 対象の特徴にある加算式のパーティ能力の合計値
 * @param {string} key パラメータ名を表すキー
 * @return {number}
 */
Game_Actor.prototype.partyAbilityTraitsSum = function (key) {
  return this.traitObjects().reduce((result, object) => result + partyAbilityTraitAdd(object, key), 0);
};

/**
 * 対象の特徴にある乗算式のパーティ能力を全てかけた値
 * @param {string} key パラメータ名を表すキー
 * @return {number}
 */
Game_Actor.prototype.partyAbilityTraitsPi = function (key) {
  return this.traitObjects().reduce((result, object) => result * partyAbilityTraitMulti(object, key), 1);
};

/**
 * 指定した通常能力値を加算するパーティ能力のパーティ全体の合計
 * @param {number} paramId パラメータID
 * @return {number}
 */
Game_Party.prototype.paramPlusByPartyAbility = function (paramId) {
  return this.allMembers().reduce((result, actor) => result + actor.partyAbilityTraitsSum(paramKey(paramId)), 0);
};

/**
 * 指定した特殊能力地を乗算するパーティ能力のパーティ全体の倍率
 * @param {number} paramId パラメータID
 * @return {number}
 */
Game_Party.prototype.sparamRateByPartyAbility = function (paramId) {
  return this.allMembers().reduce((result, actor) => result * actor.partyAbilityTraitsPi(sparamKey(paramId)), 1);
};

const _Window_EquipStatus_setTempActor = Window_EquipStatus.prototype.setTempActor;
Window_EquipStatus.prototype.setTempActor = function (tempActor) {
  if (this._tempActor !== tempActor && tempActor) {
    /**
     * 表示ステータス計算用の一時パーティ生成
     */
    const party = new Game_Party();
    $gameParty.allMembers().forEach((actor) => party.addActor(actor.actorId()));
    party.allMembers = function () {
      return this._actors.map((id) => (id === tempActor.actorId() ? tempActor : $gameActors.actor(id)));
    };
    tempActor.setTempParty(party);
  }
  _Window_EquipStatus_setTempActor.call(this, tempActor);
};

/**
 * 対象に設定された、加算方式のパーティ能力値を取得する
 * @param {MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State} object 対象
 * @param {string} key キー
 * @return {number}
 */
function partyAbilityTraitAdd(object, key) {
  const match = new RegExp(`${key}:([0-9]+)`).exec(object.meta.partyAbility);
  return match && match.length > 1 ? Number(match[1]) : 0;
}

/**
 * 対象に設定された、乗算方式のパーティ能力値を取得する
 * @param {MZ.Actor|MZ.Class|MZ.Weapon|MZ.Armor|MZ.State} object 対象
 * @param {string} key キー
 * @return {number}
 */
function partyAbilityTraitMulti(object, key) {
  const match = new RegExp(`${key}:([0-9]+)`).exec(object.meta.partyAbility);
  return match && match.length > 1 ? Number(match[1]) / 100 : 1;
}

const PARAM_KEYS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

const SPARAM_KEYS = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'];

/**
 * @param {number} paramId パラメータID
 * @return {string}
 */
function paramKey(paramId) {
  return PARAM_KEYS[paramId];
}

/**
 * @param {number} paramId パラメータID
 * @return {string}
 */
function sparamKey(paramId) {
  return SPARAM_KEYS[paramId];
}

/**
 * 装備絞り込みプラグイン用
 */
if (Scene_Equip.prototype.equipFilterBuilder) {
  const partyAbilitySParamDataIds = {};

  const _Scene_Equip_equipFilterBuilder = Scene_Equip.prototype.equipFilterBuilder;
  Scene_Equip.prototype.equipFilterBuilder = function (equips) {
    const builder = _Scene_Equip_equipFilterBuilder.call(this, equips);
    return builder
      .withEquipToTraitsRule((equip) => {
        const validSParamKeys = SPARAM_KEYS.filter((key) => equip && partyAbilityTraitMulti(equip, key) !== 1);
        return validSParamKeys
          .map((key) => {
            return {
              code: Game_BattlerBase.TRAIT_SPARAM,
              dataId: SPARAM_KEYS.indexOf(key),
              value: partyAbilityTraitMulti(equip, key),
            };
          })
          .concat(
            validSParamKeys.map((key) => {
              const dataId = EquipFilterBuilder.allocateUniqueDataId(
                pluginName,
                Game_BattlerBase.TRAIT_PARTY_ABILITY,
                SPARAM_KEYS.indexOf(key)
              );
              partyAbilitySParamDataIds[dataId] = SPARAM_KEYS.indexOf(key);
              return {
                code: Game_BattlerBase.TRAIT_PARTY_ABILITY,
                dataId: dataId,
                value: partyAbilityTraitMulti(equip, key),
              };
            })
          );
      })
      .withTraitToEffectNameRule((traitId, dataId) => {
        if (traitId === Game_BattlerBase.TRAIT_PARTY_ABILITY) {
          return TextManager.sparam(partyAbilitySParamDataIds[dataId]);
        }
        return null;
      });
  };
}
