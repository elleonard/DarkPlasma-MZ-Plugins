// DarkPlasma_StateBuffOnBattleStart 3.0.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2022/07/18 3.0.0 スキルをメモタグの対象外に変更 ステートをメモタグの対象に変更
 *                  ランダム設定を追加
 *            2.0.3 リファクタ
 * 2021/07/05 2.0.2 MZ 1.3.2に対応
 * 2021/06/22 2.0.1 サブフォルダからの読み込みに対応
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:ja
 * @plugindesc 戦闘開始時にステート/強化/弱体にかかる
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
 * @text 戦闘開始時強化・弱体
 * @type struct<BuffOnBattleStart>[]
 * @default []
 *
 * @help
 * version: 3.0.0
 * 任意のアクター、職業、装備、ステート、敵キャラのメモ欄に
 * 指定のタグを記述することで戦闘開始時にステート、強化、弱体がかかります。
 *
 * アクター: そのアクターであれば自身に
 * 職業: その職業であれば自身に
 * 装備: その武器/防具を装備していれば自身に
 * ステート: 戦闘開始時にすでにステートにかかっていれば自身に
 *
 * 敵キャラ: そのエネミーであれば自身に（敵キャラにステート、強化、弱体がかかる）
 *
 * <StateOnBattleStartId: id1, id2, id3, ...>
 * 戦闘開始時にステートにかかる
 * IDはプラグインパラメータで設定したもの
 *
 * <StateOnBattleStartRandom>
 * StateOnBattleStartIdメモタグで指定したIDの中から
 * ランダムに1つ選択してかかる
 *
 * <BuffOnBattleStartId: id1, id2, id3, ...>
 * 戦闘開始時に強化・弱体にかかる
 * IDはプラグインパラメータで設定したもの
 *
 * <BuffOnBattleStartRandom>
 * BuffOnBattleStartIdメモタグで指定したIDの中から
 * ランダムに1つ選択してかかる
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
 * @min -1
 */
/*~struct~BuffOnBattleStart:
 * @param id
 * @desc ID（メモ欄に指定する用）
 * @text ID
 * @type number
 * @default 0
 *
 * @param paramId
 * @desc 強化・弱体の対象パラメータ
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
 * @text 強化・弱体段階
 * @type select
 * @option 2段階強化
 * @value 2
 * @option 1段階強化
 * @value 1
 * @option 1段階弱体
 * @value -1
 * @option 2段階弱体
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

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

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
          paramId: Number(parsed.paramId || 0),
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
})();
