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
    if (this.isActor(data) || this.isSkill(data) || this.isWeapon(data) || this.isArmor(data) || this.isEnemy(data)) {
      if (data.meta.StateOnBattleStartId) {
        data.stateOnBattleStartIds = data.meta.StateOnBattleStartId.split(',').map((id) => Number(id));
      }
      if (data.meta.BuffOnBattleStartId) {
        data.buffOnBattleStartIds = data.meta.BuffOnBattleStartId.split(',').map((id) => Number(id));
      }
    }
  };

  dataManager.isEnemy = function (data) {
    return $dataEnemies && data && data.id && $dataEnemies.length > data.id && data === $dataEnemies[data.id];
  };

  const _isSkill = dataManager.isSkill;
  dataManager.isSkill = function (data) {
    return $dataSkills && _isSkill.call(this, data);
  };

  const _isWeapon = dataManager.isWeapon;
  dataManager.isWeapon = function (data) {
    return $dataWeapons && _isWeapon.call(this, data);
  };

  const _isArmor = dataManager.isArmor;
  dataManager.isArmor = function (data) {
    return $dataArmors && _isArmor.call(this, data);
  };

  dataManager.isActor = function (data) {
    return $dataActors && data && data.id && $dataActors.length > data.id && data === $dataActors[data.id];
  };
}

DataManager_StateBuffOnBattleStartMixIn(DataManager);

/**
 * @param {Game_Actor.prototype} gameActor
 */
function Game_Actor_StateBuffOnBattleStartMixIn(gameActor) {
  const _onBattleStart = gameActor.onBattleStart;
  gameActor.onBattleStart = function () {
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
    this.buffsOnStartBattle().forEach((buffOnBattleStart) => {
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
  gameActor.statesOnBattleStart = function () {
    const statesOnBattleStartIds = (this.actor().stateOnBattleStartIds || [])
      .concat(this.equipsStatesOnBattleStartIds())
      .concat(this.skillsStatesOnBattleStartIds());
    return stateBuffOnBattleStartManager.statesFromIds(statesOnBattleStartIds);
  };

  /**
   * 装備による戦闘開始時ステート IDリスト
   * @return {number[]}
   */
  gameActor.equipsStatesOnBattleStartIds = function () {
    return this.equips()
      .filter((equip) => equip && equip.stateOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.stateOnBattleStartIds), []);
  };

  /**
   * スキルによる戦闘開始時ステート IDリスト
   * @return {number[]}
   */
  gameActor.skillsStatesOnBattleStartIds = function () {
    return this.skills()
      .filter((skill) => skill && skill.stateOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.stateOnBattleStartIds), []);
  };

  /**
   * 戦闘開始時バフ一覧
   * @return {BuffOnBattleStart[]}
   */
  gameActor.buffsOnStartBattle = function () {
    const buffsOnStartBattleIds = (this.actor().buffOnBattleStartIds || [])
      .concat(this.equipsBuffsOnBattleStartIds())
      .concat(this.skillsBuffsOnBattleStartIds());
    return stateBuffOnBattleStartManager.buffsFromIds(buffsOnStartBattleIds);
  };

  /**
   * 装備による戦闘開始時バフ一覧
   * @return {number[]}
   */
  gameActor.equipsBuffsOnBattleStartIds = function () {
    return this.equips()
      .filter((equip) => equip && equip.buffOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.buffOnBattleStartIds), []);
  };

  /**
   * スキルによる戦闘開始時バフ一覧
   * @return {number[]}
   */
  gameActor.skillsBuffsOnBattleStartIds = function () {
    return this.skills()
      .filter((equip) => equip && equip.buffOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.buffOnBattleStartIds), []);
  };
}

Game_Actor_StateBuffOnBattleStartMixIn(Game_Actor.prototype);

/**
 * @param {Game_Enemy.prototype} gameEnemy
 */
function Game_Enemy_StateBuffOnBattleStartMixIn(gameEnemy) {
  const _onBattleStart = gameEnemy.onBattleStart;
  gameEnemy.onBattleStart = function () {
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
    this.buffsOnStartBattle().forEach((buffOnBattleStart) => {
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
  gameEnemy.statesOnBattleStart = function () {
    const statesOnBattleStartIds = this.enemy().stateOnBattleStartIds || [];
    return stateBuffOnBattleStartManager.statesFromIds(statesOnBattleStartIds);
  };

  /**
   * 戦闘開始時バフ一覧
   * @return {BuffOnBattleStart[]}
   */
  gameEnemy.buffsOnStartBattle = function () {
    const buffsOnStartBattleIds = this.enemy().buffOnBattleStartIds || [];
    return stateBuffOnBattleStartManager.buffsFromIds(buffsOnStartBattleIds);
  };
}

Game_Enemy_StateBuffOnBattleStartMixIn(Game_Enemy.prototype);
