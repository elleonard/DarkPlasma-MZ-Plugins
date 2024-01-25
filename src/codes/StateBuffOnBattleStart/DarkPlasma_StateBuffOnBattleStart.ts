/// <reference path="./StateBuffOnBattleStart.d.ts" />

import { settings } from './_build/DarkPlasma_StateBuffOnBattleStart_parameters';
import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

const localTraitId = 1;
const old_stateOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, "戦闘開始時ステート");
const old_buffOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, "戦闘開始時強化・弱体");
/**
 * 名前が口語的になるが、文字サイズを考えると仕方ない
 */
const old_stateOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 2, "開幕ランダムステート");
const old_buffOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 3, "開幕ランダム強化・弱体");

const stateOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 4, "戦闘開始時ステート");
const buffOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 5, "戦闘開始時強化・弱体");

class StateOnBattleStart {
  _id: number;
  _stateId: number;
  _turn: number;

  constructor(id: number, stateId: number, turn: number) {
    this._id = id;
    this._stateId = stateId;
    this._turn = turn;
  }

  /**
   * @param {StateOnBattleStartSetting} object オブジェクト
   * @return {StateOnBattleStart}
   */
  static fromObject(object: StateOnBattleStartSetting): StateOnBattleStart {
    return new StateOnBattleStart(object.id, object.stateId, object.turn);
  }

  /**
   * @return {number}
   */
  get id(): number {
    return this._id;
  }

  /**
   * @return {number}
   */
  get stateId(): number {
    return this._stateId;
  }

  /**
   * @return {number}
   */
  get turn(): number {
    return this._turn;
  }
}

class BuffOnBattleStart {
  _id: number;
  _paramId: number;
  _buffStep: number;
  _turn: number;

  constructor(id: number, paramId: number, buffStep: number, turn: number) {
    this._id = id;
    this._paramId = paramId;
    this._buffStep = buffStep;
    this._turn = turn;
  }

  /**
   * @param {BuffOnBattleStartSetting} object オブジェクト
   * @return {BuffOnBattleStart}
   */
  static fromObject(object: BuffOnBattleStartSetting): BuffOnBattleStart {
    return new BuffOnBattleStart(object.id, object.paramId, object.buffStep, object.turn);
  }

  /**
   * @return {number}
   */
  get id(): number {
    return this._id;
  }

  /**
   * @return {number}
   */
  get paramId(): number {
    return this._paramId;
  }

  /**
   * @return {number}
   */
  get buffStep(): number {
    return this._buffStep;
  }

  /**
   * @return {number}
   */
  get turn(): number {
    return this._turn;
  }
}

type OneOfStatesOnBattleStart = {
  id: number;
  stateIds: number[];
  turn?: number;
  rate: number;
};

type OneOfBuffsOnBattleStart = {
  id: number;
  params: {
    paramName: typeof paramNames[number];
    buffStep: number;
  }[];
  turn: number;
  rate: number;
};

const paramNames = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"] as const;

const $oneOfStatesOnBattleStarts: OneOfStatesOnBattleStart[] = [];
const $oneOfBuffsOnBattleStarts: OneOfBuffsOnBattleStart[] = [];

class StateBuffOnBattleStartManager {
  _states: StateOnBattleStart[];
  _buffs: BuffOnBattleStart[];

  constructor() {
    this._states = settings.stateOnBattleStart
      .map((object: StateOnBattleStartSetting) => StateOnBattleStart.fromObject(object));
    this._buffs = settings.buffOnBattleStart
      .map((object: BuffOnBattleStartSetting) => BuffOnBattleStart.fromObject(object));
  }

  /**
   * IDから戦闘開始時ステートを取得する
   * @param {number[]} ids IDリスト
   * @return {StateOnBattleStart[]}
   */
  statesFromIds(ids: number[]): StateOnBattleStart[] {
    return this._states.filter((state) => ids.includes(state.id));
  }

  /**
   * IDから戦闘開始時バフを取得する
   * @param {number[]} ids IDリスト
   * @return {BuffOnBattleStart[]}
   */
  buffsFromIds(ids: number[]): BuffOnBattleStart[] {
    return this._buffs.filter((buff) => ids.includes(buff.id));
  }
}

const stateBuffOnBattleStartManager = new StateBuffOnBattleStartManager();

/**
 * @param {typeof DataManager} dataManager
 */
function DataManager_StateBuffOnBattleStartMixIn(dataManager: typeof DataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (this: typeof DataManager, data) {
    _extractMetadata.call(this, data);
    if (hasTraits(data)) {
      if (data.meta.StateOnBattleStartId) {
        String(data.meta.StateOnBattleStartId).split(',')
          .map((id) => Number(id))
          .forEach(id => data.traits.push({
            code: data.meta.StateOnBattleStartRandom ? old_stateOnBattleStartRandomTraitId.id : old_stateOnBattleStartTraitId.id,
            dataId: id,
            value: 0
          }));
      }
      if (data.meta.BuffOnBattleStartId) {
        String(data.meta.BuffOnBattleStartId).split(',')
          .map((id) => Number(id))
          .forEach(id => data.traits.push({
            code: data.meta.BuffOnBattleStartRandom ? old_buffOnBattleStartRandomTraitId.id : old_buffOnBattleStartTraitId.id,
            dataId: id,
            value: 0
          }));
      }
      if (data.meta.stateOnBattleStart) {
        String(data.meta.stateOnBattleStart).split('\n')
          .filter(line => line.contains("oneOf:"))
          .forEach(line => {
            const tokens = /oneOf: ?(([0-9]+,?)+)/.exec(line);
            if (tokens) {
              const stateIds = tokens[1].split(',').map(id => Number(id));
              const turnTokens = /turn: ?([0-9]+)/.exec(line);
              const turn = turnTokens ? Number(turnTokens[1]) : undefined;
              const rateTokens = /rate: ?([0-9]+)/.exec(line);
              const rate = rateTokens ? Number(rateTokens[1]) : 100;
              const oneOfStatesOnBattleStart: OneOfStatesOnBattleStart = {
                id: $oneOfStatesOnBattleStarts.length,
                stateIds: stateIds,
                turn: turn,
                rate: rate,
              }
              $oneOfStatesOnBattleStarts.push(oneOfStatesOnBattleStart);
              data.traits.push({
                code: stateOnBattleStartTraitId.id,
                dataId: oneOfStatesOnBattleStart.id,
                value: 0,
              });
            }
          });
      }
      if (data.meta.buffOnBattleStart) {
        String(data.meta.buffOnBattleStart).split('\n')
          .filter(line => line.contains("oneOf:"))
          .forEach(line => {
            const tokens = /oneOf: ?(((mhp|mmp|atk|def|mat|mdf|agi|luk)[\+\-][1-9]+,?)+)/.exec(line);
            if (tokens) {
              type OmitUndefined<T> = {[K in keyof T]: Exclude<T[K], undefined>};
              type ParamAndStep = {paramName: typeof paramNames[number] | undefined, buffStep: number};
              const paramAndSteps: OmitUndefined<ParamAndStep>[] = tokens[1].split(',')
                .map(paramAndStep => {
                  const step = /[\+\-][1-9]+/.exec(paramAndStep);
                  return {
                    paramName: paramNames.find(n => paramAndStep.startsWith(n)),
                    buffStep: Number(step ? step[0] : 1),
                  };
                })
                .filter((paramAndStep): paramAndStep is OmitUndefined<ParamAndStep> => !!paramAndStep.paramName);
              const turnTokens = /turn: ?([0-9]+)/.exec(line);
              const turn = turnTokens ? Number(turnTokens[1]) : 3;
              const rateTokens = /rate: ?([0-9]+)/.exec(line);
              const rate = rateTokens ? Number(rateTokens[1]) : 100;
              const oneOfBuffsOnBattleStart: OneOfBuffsOnBattleStart = {
                id: $oneOfBuffsOnBattleStarts.length,
                params: paramAndSteps,
                turn: turn,
                rate: rate,
              }
              $oneOfBuffsOnBattleStarts.push(oneOfBuffsOnBattleStart);
              data.traits.push({
                code: buffOnBattleStartTraitId.id,
                dataId: oneOfBuffsOnBattleStart.id,
                value: 0,
              });
            }
          });
      }
    }
  };
}

DataManager_StateBuffOnBattleStartMixIn(DataManager);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_StateBuffOnBattleStartMixIn(gameBattler: Game_Battler) {
  const _onBattleStart = gameBattler.onBattleStart;
  gameBattler.onBattleStart = function (this: Game_Battler, advantageous) {
    _onBattleStart.call(this, advantageous);
    /**
     * 戦闘開始時ステート
     */
    this.statesOnBattleStart().forEach((stateOnBattleStart) => {
      this.addState(stateOnBattleStart.stateId);
      /**
       * ターン数上書き
       */
      if (this.isStateAffected(stateOnBattleStart.stateId) && stateOnBattleStart.turn >= 0) {
        this._stateTurns[stateOnBattleStart.stateId] = stateOnBattleStart.turn;
      }
    });
    /**
     * 戦闘開始時の強化・弱体
     * 強化・弱体はターン終了時にターン数が1減り、次ターンの行動時に解除される
     * つまり、5ターン持続としてかけられた強化・弱体は次ターンから数えて5ターン目の行動時に解除される
     * 戦闘開始時にかけられたものは初ターンから数えるため、1減らしておく
     */
    this.buffsOnBattleStart().forEach((buffOnBattleStart) => {
      let buffStep = buffOnBattleStart.buffStep;
      while (buffStep > 0) {
        this.addBuff(buffOnBattleStart.paramId, buffOnBattleStart.turn - 1);
        buffStep--;
      }
      while (buffStep < 0) {
        this.addDebuff(buffOnBattleStart.paramId, buffOnBattleStart.turn - 1);
        buffStep++;
      }
    });
  };

  /**
   * 戦闘開始時ステート一覧
   */
  gameBattler.statesOnBattleStart = function (this: Game_Battler): T_StateOnBattleStart[] {
    const states: T_StateOnBattleStart[] = this.traits(stateOnBattleStartTraitId.id)
      .filter(trait => $oneOfStatesOnBattleStarts[trait.dataId].rate > Math.randomInt(100))
      .map(trait => {
        const stateIds = $oneOfStatesOnBattleStarts[trait.dataId].stateIds;
        const stateId = stateIds[Math.randomInt(stateIds.length-1)];
        const state = $dataStates[stateId];
        const turn = $oneOfStatesOnBattleStarts[trait.dataId].turn
          || state.minTurns + Math.randomInt(1 + Math.max(state.maxTurns - state.minTurns, 0))
        return {
          stateId: stateId,
          turn: turn,
        };
      });
    /**
     * 特徴の付与されたオブジェクト内でランダムに選択する (旧形式)
     */
    const old_randomIds = this.traitObjects()
      .filter(object => object.traits.some(trait => trait.code === old_stateOnBattleStartRandomTraitId.id))
      .map(object => {
        const traits = object.traits.filter(trait => trait.code === old_stateOnBattleStartRandomTraitId.id);
        return traits[Math.randomInt(traits.length)].dataId;
      });
    return states.concat(stateBuffOnBattleStartManager.statesFromIds(
      this.traitsSet(old_stateOnBattleStartTraitId.id).concat(old_randomIds)
    ));
  };

  /**
   * 戦闘開始時強化・弱体一覧
   */
  gameBattler.buffsOnBattleStart = function (this: Game_Battler): T_BuffOnBattleStart[] {
    const buffs: T_BuffOnBattleStart[] = this.traits(buffOnBattleStartTraitId.id)
      .filter(trait => $oneOfBuffsOnBattleStarts[trait.dataId].rate > Math.randomInt(100))
      .map(trait => {
        const paramIds = $oneOfBuffsOnBattleStarts[trait.dataId].params.map(param => paramNames.indexOf(param.paramName));
        const index = Math.randomInt(paramIds.length);
        return {
          paramId: paramIds[index],
          buffStep: $oneOfBuffsOnBattleStarts[trait.dataId].params[index].buffStep,
          turn: $oneOfBuffsOnBattleStarts[trait.dataId].turn,
        };
      });

    const old_randomIds = this.traitObjects()
      .filter(object => object.traits.some(trait => trait.code === old_buffOnBattleStartRandomTraitId.id))
      .map(object => {
        const traits = object.traits.filter(trait => trait.code === old_buffOnBattleStartRandomTraitId.id);
        return traits[Math.randomInt(traits.length-1)].dataId;
      });
    return buffs.concat(stateBuffOnBattleStartManager.buffsFromIds(
      this.traitsSet(old_buffOnBattleStartTraitId.id).concat(old_randomIds)
    ));
  };
}

Game_Battler_StateBuffOnBattleStartMixIn(Game_Battler.prototype);

function Scene_Equip_StateBuffOnBattleStartMixIn(sceneEquip: Scene_Equip) {
  const _EquipFilterBuilder = sceneEquip.equipFilterBuilder;
  sceneEquip.equipFilterBuilder = function (equips) {
    return _EquipFilterBuilder.call(this, equips)
      .withTrait(old_stateOnBattleStartTraitId.id)
      .withTrait(old_buffOnBattleStartTraitId.id)
      .withTrait(old_stateOnBattleStartRandomTraitId.id)
      .withTrait(old_buffOnBattleStartRandomTraitId.id);
  };
}

Scene_Equip_StateBuffOnBattleStartMixIn(Scene_Equip.prototype);
