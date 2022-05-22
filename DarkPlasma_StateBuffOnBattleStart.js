// DarkPlasma_StateBuffOnBattleStart 2.0.2
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 戦闘開始時にステート/バフにかかる
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param stateOnBattleStart
 * @text 戦闘開始時ステート
 * @type struct<StateOnBattleStart>[]
 * @default []
 *
 * @param buffOnBattleStart
 * @text 戦闘開始時バフ
 * @type struct<BuffOnBattleStart>[]
 * @default []
 *
 * @help
 * version: 2.0.2
 * 持続ターン数を上書き指定できるようにする
 *
 * 任意のアクター、職業、スキル、装備、敵キャラのメモ欄に以下のように記述してください。
 *
 * アクター: そのアクターであれば自身に
 * 職業: その職業であれば自身に
 * スキル: そのスキルを習得していれば自身に
 * 装備: その武器/防具を装備していれば自身に
 *
 * 敵キャラ: そのエネミーであれば自身に（敵キャラにステートやバフがかかる）
 *
 * <StateOnBattleStartId: id1, id2, id3, ...>
 * 戦闘開始時にステートにかかる
 *
 * <BuffOnBattleStartId: id1, id2, id3, ...>
 * 戦闘開始時にバフにかかる
 */
/*~struct~StateOnBattleStart:
 * @param id
 * @desc ID（メモ欄に指定する用）
 * @text ID
 * @type number
 * @default 0
 *
 * @param stateId
 * @text ステートID
 * @type state
 * @default 1
 *
 * @param turn
 * @desc 持続ターン（負の数にするとデフォルトと同じ）
 * @text 持続ターン
 * @type number
 * @default -1
 */
/*~struct~BuffOnBattleStart:
 * @param id
 * @desc ID（メモ欄に指定する用）
 * @text ID
 * @type number
 * @default 0
 *
 * @param paramId
 * @desc バフデバフ対象パラメータ
 * @text 対象パラメータ
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 * @default 0
 *
 * @param buffStep
 * @text バフデバフ段階
 * @type select
 * @option 2段階強化
 * @value 2
 * @option 1段階強化
 * @value 1
 * @option 1段階弱化
 * @value -1
 * @option 2段階弱化
 * @value -2
 * @default 1
 *
 * @param turn
 * @text 持続ターン
 * @type number
 * @default 3
 */
(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    stateOnBattleStart: JSON.parse(pluginParameters.stateOnBattleStart || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          stateId: Number(parsed.stateId || 1),
          turn: Number(parsed.turn || -1),
        };
      })(e || '{}');
    }),
    buffOnBattleStart: JSON.parse(pluginParameters.buffOnBattleStart || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          id: Number(parsed.id || 0),
          paramId: String(parsed.paramId || ''),
          buffStep: Number(parsed.buffStep || 1),
          turn: Number(parsed.turn || 3),
        };
      })(e || '{}');
    }),
  };

  class StateOnBattleStart {
    constructor(id, stateId, turn) {
      this._id = id;
      this._stateId = stateId;
      this._turn = turn;
    }

    /**
     * @param {string} json JSON
     * @return {StateOnBattleStart}
     */
    static fromJson(json) {
      const parsed = JsonEx.parse(json);
      return new StateOnBattleStart(Number(parsed.Id || 0), Number(parsed['State Id'] || 1), Number(parsed.Turn || -1));
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

    static fromJson(json) {
      const parsed = JsonEx.parse(json);
      return new BuffOnBattleStart(
        Number(parsed.Id || 0),
        Number(parsed['Param Id'] || 0),
        Number(parsed['Buff Step'] || 1),
        Number(parsed.Turn || 3)
      );
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

  const _DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function (data) {
    _DataManager_extractMetadata.call(this, data);
    if (this.isActor(data) || this.isSkill(data) || this.isWeapon(data) || this.isArmor(data) || this.isEnemy(data)) {
      if (data.meta.StateOnBattleStartId) {
        data.stateOnBattleStartIds = data.meta.StateOnBattleStartId.split(',').map((id) => Number(id));
      }
      if (data.meta.BuffOnBattleStartId) {
        data.buffOnBattleStartIds = data.meta.BuffOnBattleStartId.split(',').map((id) => Number(id));
      }
    }
  };

  DataManager.isEnemy = function (data) {
    return $dataEnemies && data && data.id && $dataEnemies.length > data.id && data === $dataEnemies[data.id];
  };

  const _DataManager_isSkill = DataManager.isSkill;
  DataManager.isSkill = function (data) {
    return $dataSkills && _DataManager_isSkill.call(this, data);
  };

  const _DataManager_isWeapon = DataManager.isWeapon;
  DataManager.isWeapon = function (data) {
    return $dataWeapons && _DataManager_isWeapon.call(this, data);
  };

  const _DataManager_isArmor = DataManager.isArmor;
  DataManager.isArmor = function (data) {
    return $dataArmors && _DataManager_isArmor.call(this, data);
  };

  DataManager.isActor = function (data) {
    return $dataActors && data && data.id && $dataActors.length > data.id && data === $dataActors[data.id];
  };

  const _Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
  Game_Actor.prototype.onBattleStart = function () {
    _Game_Actor_onBattleStart.call(this);
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
  Game_Actor.prototype.statesOnBattleStart = function () {
    const statesOnBattleStartIds = (this.actor().stateOnBattleStartIds || [])
      .concat(this.equipsStatesOnBattleStartIds())
      .concat(this.skillsStatesOnBattleStartIds());
    return stateBuffOnBattleStartManager.statesFromIds(statesOnBattleStartIds);
  };

  /**
   * 装備による戦闘開始時ステート IDリスト
   * @return {number[]}
   */
  Game_Actor.prototype.equipsStatesOnBattleStartIds = function () {
    return this.equips()
      .filter((equip) => equip && equip.stateOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.stateOnBattleStartIds), []);
  };

  /**
   * スキルによる戦闘開始時ステート IDリスト
   * @return {number[]}
   */
  Game_Actor.prototype.skillsStatesOnBattleStartIds = function () {
    return this.skills()
      .filter((skill) => skill && skill.stateOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.stateOnBattleStartIds), []);
  };

  /**
   * 戦闘開始時バフ一覧
   * @return {BuffOnBattleStart[]}
   */
  Game_Actor.prototype.buffsOnStartBattle = function () {
    const buffsOnStartBattleIds = (this.actor().buffOnBattleStartIds || [])
      .concat(this.equipsBuffsOnBattleStartIds())
      .concat(this.skillsBuffsOnBattleStartIds());
    return stateBuffOnBattleStartManager.buffsFromIds(buffsOnStartBattleIds);
  };

  /**
   * 装備による戦闘開始時バフ一覧
   * @return {number[]}
   */
  Game_Actor.prototype.equipsBuffsOnBattleStartIds = function () {
    return this.equips()
      .filter((equip) => equip && equip.buffOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.buffOnBattleStartIds), []);
  };

  /**
   * スキルによる戦闘開始時バフ一覧
   * @return {number[]}
   */
  Game_Actor.prototype.skillsBuffsOnBattleStartIds = function () {
    return this.skills()
      .filter((equip) => equip && equip.buffOnBattleStartIds)
      .reduce((previous, current) => previous.concat(current.buffOnBattleStartIds), []);
  };

  const _Game_Enemy_onBattleStart = Game_Enemy.prototype.onBattleStart;
  Game_Enemy.prototype.onBattleStart = function () {
    _Game_Enemy_onBattleStart.call(this);
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
  Game_Enemy.prototype.statesOnBattleStart = function () {
    const statesOnBattleStartIds = this.enemy().stateOnBattleStartIds || [];
    return stateBuffOnBattleStartManager.statesFromIds(statesOnBattleStartIds);
  };

  /**
   * 戦闘開始時バフ一覧
   * @return {BuffOnBattleStart[]}
   */
  Game_Enemy.prototype.buffsOnStartBattle = function () {
    const buffsOnStartBattleIds = this.enemy().buffOnBattleStartIds || [];
    return stateBuffOnBattleStartManager.buffsFromIds(buffsOnStartBattleIds);
  };
})();
