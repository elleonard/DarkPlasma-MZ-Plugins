import { settings } from './_build/DarkPlasma_StateBuffOnBattleStart_parameters';

class StateOnBattleStart {
  constructor(id, stateId, turn) {
    this._id = id;
    this._stateId = stateId;
    this._turn = turn;
  }

  /**
   * @param {object} object オブジェクト
   * @return {StateOnBattleStart}
   */
  static fromObject(object) {
    return new StateOnBattleStart(object.id, object.stateId, object.turn);
  }

  /**
   * @return {number}
   */
  get id() {
    return this._id;
  }

  /**
   * @return {number}
   */
  get stateId() {
    return this._stateId;
  }

  /**
   * @return {number}
   */
  get turn() {
    return this._turn;
  }
}

class BuffOnBattleStart {
  constructor(id, paramId, buffStep, turn) {
    this._id = id;
    this._paramId = paramId;
    this._buffStep = buffStep;
    this._turn = turn;
  }

  /**
   * @param {object} object オブジェクト
   * @return {BuffOnBattleStart}
   */
  static fromObject(object) {
    return new BuffOnBattleStart(object.id, object.paramId, object.buffStep, object.turn);
  }

  /**
   * @return {number}
   */
  get id() {
    return this._id;
  }

  /**
   * @return {number}
   */
  get paramId() {
    return this._paramId;
  }

  /**
   * @return {number}
   */
  get buffStep() {
    return this._buffStep;
  }

  /**
   * @return {number}
   */
  get turn() {
    return this._turn;
  }
}

class StateBuffOnBattleStartManager {
  constructor() {
    this._states = settings.stateOnBattleStart.map((object) => StateOnBattleStart.fromObject(object));
    this._buffs = settings.buffOnBattleStart.map((object) => BuffOnBattleStart.fromObject(object));
  }

  /**
   * IDから戦闘開始時ステートを取得する
   * @param {number[]} ids IDリスト
   * @return {StateOnBattleStart[]}
   */
  statesFromIds(ids) {
    return this._states.filter((state) => ids.includes(state.id));
  }

  /**
   * IDから戦闘開始時バフを取得する
   * @param {number[]} ids IDリスト
   * @return {BuffOnBattleStart[]}
   */
  buffsFromIds(ids) {
    return this._buffs.filter((buff) => ids.includes(buff.id));
  }
}

const stateBuffOnBattleStartManager = new StateBuffOnBattleStartManager();

/**
 * @param {typeof DataManager} dataManager
 */
function DataManager_StateBuffOnBattleStartMixIn(dataManager) {
  const _extractMetadata = dataManager.extractMetadata;
  dataManager.extractMetadata = function (data) {
    _extractMetadata.call(this, data);
    if (data.meta.StateOnBattleStartId) {
      data.stateOnBattleStartIds = data.meta.StateOnBattleStartId.split(',').map((id) => Number(id));
    }
    if (data.meta.BuffOnBattleStartId) {
      data.buffOnBattleStartIds = data.meta.BuffOnBattleStartId.split(',').map((id) => Number(id));
    }
  };

  /**
   * 対象オブジェクトの戦闘開始時ステート設定ID一覧
   * @param {MZ.Actor|MZ.Class|MZ.Skill|MZ.Weapon|MZ.Armor|MZ.Enemy} data
   * @return {number[]}
   */
  dataManager.stateOnBattleStartIds = function (data) {
    if (!data || !data.stateOnBattleStartIds) {
      return [];
    }
    return data.meta.StateOnBattleStartRandom
      ? [data.stateOnBattleStartIds[Math.randomInt(data.stateOnBattleStartIds.length)]]
      : data.stateOnBattleStartIds;
  };

  /**
   * 対象オブジェクトの戦闘開始時強化・弱体設定ID一覧
   * @param {MZ.Actor|MZ.Class|MZ.Skill|MZ.Weapon|MZ.Armor|MZ.Enemy} data
   * @return {number[]}
   */
  dataManager.buffOnBattleStartIds = function (data) {
    if (!data || !data.buffOnBattleStartIds) {
      return [];
    }

    return data.meta.BuffOnBattleStartRandom
      ? [data.buffOnBattleStartIds[Math.randomInt(data.buffOnBattleStartIds.length)]]
      : data.buffOnBattleStartIds;
  };
}

DataManager_StateBuffOnBattleStartMixIn(DataManager);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_StateBuffOnBattleStartMixIn(gameBattler) {
  const _onBattleStart = gameBattler.onBattleStart;
  gameBattler.onBattleStart = function () {
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
  gameBattler.statesOnBattleStart = function () {
    return stateBuffOnBattleStartManager.statesFromIds(
      this.traitObjects().flatMap((object) => DataManager.stateOnBattleStartIds(object))
    );
  };

  /**
   * 戦闘開始時強化・弱体一覧
   * @return {StateOnBattleStart[]}
   */
  gameBattler.buffsOnBattleStart = function () {
    return stateBuffOnBattleStartManager.buffsFromIds(
      this.traitObjects().flatMap((object) => DataManager.buffOnBattleStartIds(object))
    );
  };
}

Game_Battler_StateBuffOnBattleStartMixIn(Game_Battler.prototype);
