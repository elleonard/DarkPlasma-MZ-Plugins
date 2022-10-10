/// <reference path="./StateBuffOnBattleStart.d.ts" />

import { settings } from './_build/DarkPlasma_StateBuffOnBattleStart_parameters';
import { pluginName } from '../../common/pluginName';
import { hasTraits } from '../../common/data/hasTraits';

const localTraitId = 1;
const stateOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId, "戦闘開始時ステート");
const buffOnBattleStartTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 1, "戦闘開始時強化・弱体");
const stateOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 2, "戦闘開始時ランダムステート");
const buffOnBattleStartRandomTraitId = uniqueTraitIdCache.allocate(pluginName, localTraitId + 3, "戦闘開始時ランダム強化・弱体");

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
            code: data.meta.StateOnBattleStartRandom ? stateOnBattleStartRandomTraitId.id : stateOnBattleStartTraitId.id,
            dataId: id,
            value: 0
          }));
      }
      if (data.meta.BuffOnBattleStartId) {
        String(data.meta.BuffOnBattleStartId).split(',')
          .map((id) => Number(id))
          .forEach(id => data.traits.push({
            code: data.meta.BuffOnBattleStartRandom ? buffOnBattleStartRandomTraitId.id : buffOnBattleStartTraitId.id,
            dataId: id,
            value: 0
          }));
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
  gameBattler.onBattleStart = function (this: Game_Battler) {
    _onBattleStart.call(this);
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
     * 戦闘開始時バフ
     */
    this.buffsOnBattleStart().forEach((buffOnBattleStart) => {
      let buffStep = buffOnBattleStart.buffStep;
      while (buffStep > 0) {
        this.addBuff(buffOnBattleStart.paramId, buffOnBattleStart.turn);
        buffStep--;
      }
      while (buffStep < 0) {
        this.addDebuff(buffOnBattleStart.paramId, buffOnBattleStart.turn);
        buffStep++;
      }
    });
  };

  /**
   * 戦闘開始時ステート一覧
   * @return {StateOnBattleStart[]}
   */
  gameBattler.statesOnBattleStart = function (this: Game_Battler): StateOnBattleStart[] {
    /**
     * 特徴の付与されたオブジェクト内でランダムに選択する
     */
    const randomIds = this.traitObjects()
      .filter(object => object.traits.some(trait => trait.code === stateOnBattleStartRandomTraitId.id))
      .map(object => {
        const traits = object.traits.filter(trait => trait.code === stateOnBattleStartRandomTraitId.id);
        return traits[Math.randomInt(traits.length-1)].dataId;
      });
    return stateBuffOnBattleStartManager.statesFromIds(
      this.traitsSet(stateOnBattleStartTraitId.id).concat(randomIds)
    );
  };

  /**
   * 戦闘開始時強化・弱体一覧
   * @return {StateOnBattleStart[]}
   */
  gameBattler.buffsOnBattleStart = function (this: Game_Battler): BuffOnBattleStart[] {
    const randomIds = this.traitObjects()
      .filter(object => object.traits.some(trait => trait.code === buffOnBattleStartRandomTraitId.id))
      .map(object => {
        const traits = object.traits.filter(trait => trait.code === buffOnBattleStartRandomTraitId.id);
        return traits[Math.randomInt(traits.length-1)].dataId;
      });
    return stateBuffOnBattleStartManager.buffsFromIds(
      this.traitsSet(buffOnBattleStartTraitId.id).concat(randomIds)
    );
  };
}

Game_Battler_StateBuffOnBattleStartMixIn(Game_Battler.prototype);
