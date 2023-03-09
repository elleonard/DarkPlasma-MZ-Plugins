// DarkPlasma_SkillCooldown 2.3.3
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/03/09 2.3.3 クールタイム初期化タイミングの変更
 *                  リファクタ
 * 2022/12/11 2.3.2 リファクタ
 * 2022/11/22 2.3.1 クールタイム中判定をGame_BattlerBaseクラスに寄せる
 *            2.3.0 初期クールタイム用のインターフェース追加
 * 2022/11/21 2.2.0 クールタイムを増減・終了するプラグインコマンドを追加
 *            2.1.1 typescript移行
 * 2022/06/12 2.1.0 メモ欄による設定をサポート
 * 2022/01/07 2.0.5 TPBにおいてターンカウントが正常に進まない不具合を修正
 * 2021/11/14 2.0.4 戦闘中にパーティメンバーを追加するとエラーが発生する不具合を修正
 * 2021/07/05 2.0.3 MZ 1.3.2に対応
 * 2021/06/22 2.0.2 サブフォルダからの読み込みに対応
 * 2020/10/20 2.0.1 設定値が正常に読み込まれない不具合を修正
 * 2020/09/08 2.0.0 パラメータ名を変更
 * 2020/09/01 1.0.1 クールダウンターン数が1少ない不具合を修正
 * 2020/08/27 1.0.0 MZ版公開
 */

/*:
 * @plugindesc スキルにクールタイムを指定する
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param skillCooldownSettings
 * @text スキルクールタイム
 * @type struct<SkillCooldown>[]
 * @default []
 *
 * @param displaySetting
 * @text クールタイム表示設定
 *
 * @param displayCooldownTurn
 * @desc スキル消費の代わりにクールタイムを表示する
 * @text クールタイム表示
 * @type boolean
 * @default true
 * @parent displaySetting
 *
 * @param cooldownFormat
 * @desc クールタイムの表示形式（{turn}がターン数に置き換えられる）
 * @text クールタイム表示形式
 * @type string
 * @default CT:{turn}
 * @parent displaySetting
 *
 * @param cooldownTextColor
 * @desc クールタイムの表示色
 * @text クールタイム表示色
 * @type number
 * @default 2
 * @parent displaySetting
 *
 * @param decreaseBenchwarmersCooldown
 * @desc 控えメンバーのクールタイムも進める(ターン制のみ)
 * @text 控えクールタイム減
 * @type boolean
 * @default true
 *
 * @command plusCooldownTurns
 * @text クールタイム増減
 * @desc 開始済みクールタイムを増減させます。
 * @arg turn
 * @text 増加ターン数
 * @desc 増加ターン数を指定します。負の値を指定するとクールタイムが減少します。
 * @type number
 * @min -9999
 * @arg actors
 * @text 対象アクター一覧
 * @desc クールタイムを増減させたいアクター一覧を指定します。省略時にはパーティ全体を対象とします。
 * @type actor[]
 * @arg skills
 * @text 対象スキル一覧
 * @desc クールタイムを増減させたいスキル一覧を指定します。省略時には全てのクールタイム中スキルを対象とします。
 * @type skill[]
 *
 * @command finishCooldowns
 * @text クールタイム終了
 * @desc 開始済みクールタイムを終了します。
 * @arg actors
 * @text 対象アクター一覧
 * @desc クールタイムを増減させたいアクター一覧を指定します。省略時にはパーティ全体を対象とします。
 * @type actor[]
 * @arg skills
 * @text 対象スキル一覧
 * @desc クールタイムを増減させたいスキル一覧を指定します。省略時には全てのクールタイム中スキルを対象とします。
 * @type skill[]
 *
 * @help
 * version: 2.3.3
 * スキルにクールタイムを指定します。
 * バトラーがスキルXを使用した後、
 * そのバトラーのスキルYの使用を一定ターン数制限することができます。
 *
 * バトラーがスキルXを使用した後、
 * そのバトラーのスキルX自体の使用をxターン数制限する場合、
 * スキルのメモ欄でも設定可能です。
 * <cooldownTurn:x>
 */
/*~struct~SkillCooldown:
 * @param triggerSkillId
 * @desc クールタイムを発生させるトリガーとなるスキル
 * @text トリガースキル
 * @type skill
 * @default 0
 *
 * @param targetSkills
 * @desc クールタイムを発生させる対象
 * @text 対象設定
 * @type struct<SkillCooldownTarget>[]
 * @default []
 */
/*~struct~SkillCooldownTarget:
 * @param targetSkillId
 * @desc クールタイムを発生させる対象となるスキル
 * @text 対象スキル
 * @type skill
 * @default 0
 *
 * @param cooldownTurnCount
 * @desc クールタイムのターン数
 * @text ターン数
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
    skillCooldownSettings: JSON.parse(pluginParameters.skillCooldownSettings || '[]').map((e) => {
      return ((parameter) => {
        const parsed = JSON.parse(parameter);
        return {
          triggerSkillId: Number(parsed.triggerSkillId || 0),
          targetSkills: JSON.parse(parsed.targetSkills || '[]').map((e) => {
            return ((parameter) => {
              const parsed = JSON.parse(parameter);
              return {
                targetSkillId: Number(parsed.targetSkillId || 0),
                cooldownTurnCount: Number(parsed.cooldownTurnCount || 3),
              };
            })(e || '{}');
          }),
        };
      })(e || '{}');
    }),
    displayCooldownTurn: String(pluginParameters.displayCooldownTurn || true) === 'true',
    cooldownFormat: String(pluginParameters.cooldownFormat || `CT:{turn}`),
    cooldownTextColor: Number(pluginParameters.cooldownTextColor || 2),
    decreaseBenchwarmersCooldown: String(pluginParameters.decreaseBenchwarmersCooldown || true) === 'true',
  };

  function parseArgs_plusCooldownTurns(args) {
    return {
      turn: Number(args.turn || 0),
      actors: JSON.parse(args.actors || '[]').map((e) => {
        return Number(e || 0);
      }),
      skills: JSON.parse(args.skills || '[]').map((e) => {
        return Number(e || 0);
      }),
    };
  }

  function parseArgs_finishCooldowns(args) {
    return {
      actors: JSON.parse(args.actors || '[]').map((e) => {
        return Number(e || 0);
      }),
      skills: JSON.parse(args.skills || '[]').map((e) => {
        return Number(e || 0);
      }),
    };
  }

  const command_plusCooldownTurns = 'plusCooldownTurns';

  const command_finishCooldowns = 'finishCooldowns';

  class Game_SkillCooldown {
    /**
     * @param {number} skillId スキルID
     * @param {number} turnCount ターン数
     */
    constructor(skillId, turnCount) {
      this._skillId = skillId;
      this._turnCount = turnCount;
    }
    /**
     * 指定IDのスキル使用をトリガーとするクールダウンオブジェクトのセットアップ
     * @param {number} triggerSkillId トリガースキルID
     * @return {Game_SkillCooldown[]}
     */
    static setup(triggerSkillId) {
      const cooldownSetting = settings.skillCooldownSettings.find(
        (cooldown) => cooldown.triggerSkillId === triggerSkillId
      );
      /**
       * メモ欄による設定
       */
      const result = [];
      if ($dataSkills[triggerSkillId].meta.cooldownTurn) {
        result.push(new Game_SkillCooldown(triggerSkillId, Number($dataSkills[triggerSkillId].meta.cooldownTurn) + 1));
      }
      /**
       * プラグインパラメータによる設定
       */
      return result.concat(
        cooldownSetting
          ? cooldownSetting.targetSkills.map(
              (target) => new Game_SkillCooldown(target.targetSkillId, target.cooldownTurnCount + 1)
            )
          : []
      );
    }
    /**
     * @return {number}
     */
    get skillId() {
      return this._skillId;
    }
    /**
     * @return {number}
     */
    get turnCount() {
      return this._turnCount;
    }
    /**
     * @return {boolean}
     */
    isFinished() {
      return this._turnCount <= 0;
    }
    finish() {
      this._turnCount = 0;
    }
    /**
     * ターンカウントを進める
     */
    decreaseTurn() {
      this.plusTurn(-1);
    }
    plusTurn(plus) {
      this._turnCount += plus;
      if (this._turnCount < 0) {
        this._turnCount = 0;
      }
    }
  }
  /**
   * スキルクールタイムの管理
   */
  class SkillCooldownManager {
    constructor() {
      /**
       * @type {Game_SkillCooldown[][]}
       */
      this._actorsSkillCooldowns = [];
      /**
       * @type {Game_SkillCooldown[][]}
       */
      this._enemysSkillCooldowns = [];
    }
    /**
     * 初期化する。戦闘開始時に呼び出される
     */
    initialize() {
      $gameParty.allMembers().forEach((actor) => {
        this._actorsSkillCooldowns[actor.actorId()] = actor.initialSkillCooldowns();
      });
      $gameTroop.members().forEach((enemy) => {
        this._enemysSkillCooldowns[enemy.index()] = enemy.initialSkillCooldowns();
      });
    }
    /**
     * @param {number} actorId
     * @return {Game_SkillCooldown[]}
     */
    actorsCooldowns(actorId) {
      if (!this._actorsSkillCooldowns[actorId]) {
        this._actorsSkillCooldowns[actorId] = [];
      }
      return this._actorsSkillCooldowns[actorId];
    }
    /**
     * @param {number} index
     * @return {Game_SkillCooldown[]}
     */
    enemysCooldowns(index) {
      if (!this._enemysSkillCooldowns[index]) {
        this._enemysSkillCooldowns[index] = [];
      }
      return this._enemysSkillCooldowns[index];
    }
    /**
     * クールダウン開始
     * @param {number} id
     * @param {MZ.Skill} triggerSkill スキルデータ
     * @param {boolean} isActor
     */
    setupCooldownTurn(id, triggerSkill, isActor) {
      const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
      const cooldowns = Game_SkillCooldown.setup(triggerSkill.id);
      cooldowns.forEach((cooldown) => {
        targetCooldowns[cooldown.skillId] = cooldown;
      });
    }
    /**
     * クールダウン中かどうか
     * @param {number} id アクターIDまたは敵キャラインデックス
     * @param {MZ.Skill} skill スキルデータ
     * @param {boolean} isActor
     * @return {boolean}
     */
    isDuringCooldown(id, skill, isActor) {
      const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
      const cooldown = targetCooldowns[skill.id];
      return cooldown ? !cooldown.isFinished() : false;
    }
    /**
     * 残りクールダウンターン数を返す
     * @param {number} id アクターIDまたは敵キャラインデックス
     * @param {MZ.Skill} skill スキルデータ
     * @param {boolean} isActor
     * @return {number}
     */
    cooldownTurn(id, skill, isActor) {
      const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
      const cooldown = targetCooldowns[skill.id];
      return cooldown ? cooldown.turnCount : 0;
    }
    /**
     * すべてのクールダウンターン数を進める
     */
    decreaseAllCooldownTurns() {
      const actorsCooldowns = settings.decreaseBenchwarmersCooldown
        ? this._actorsSkillCooldowns
        : this._actorsSkillCooldowns.filter((_, actorId) => $gameActors.actor(actorId)?.isBattleMember());
      const cooldowns = actorsCooldowns.flat().concat(this._enemysSkillCooldowns.flat());
      cooldowns.forEach((cooldown) => cooldown.decreaseTurn());
    }
    /**
     * 特定バトラーのクールダウンターン数を進める
     * @param {number} id
     * @param {boolean} isActor
     */
    decreaseCooldownTurns(id, isActor) {
      const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
      targetCooldowns.forEach((cooldown) => cooldown.decreaseTurn());
    }
    /**
     * すでに開始しているクールタイムを増減する
     * 開始していない(または終了済みの)クールタイムについては何もしない
     * クールタイム開始のトリガーは、設定されたスキルの使用のみとする
     *
     * @param {Game_Battler[]} targetBattlers クールタイム増減対象バトラーリスト
     * @param {number} plus 増減ターン数。正の値でクールタイム増加、負の値でクールタイム減少
     * @param {MZ.Skill[]} skills クールタイム増減対象スキルリスト。省略した場合、開始している全てのクールタイムが対象となる
     */
    plusCooldownTurns(targetBattlers, plus, skills) {
      const targetCooldowns = targetBattlers
        .map((battler) => {
          const cooldowns = battler.isActor()
            ? this.actorsCooldowns(battler.skillCooldownId())
            : this.enemysCooldowns(battler.skillCooldownId());
          return skills ? cooldowns.filter((_, skillId) => skills.some((skill) => skill.id === skillId)) : cooldowns;
        })
        .flat();
      targetCooldowns.filter((cooldown) => !cooldown.isFinished()).forEach((cooldown) => cooldown.plusTurn(plus));
    }
    /**
     * すでに開始してるクールタイムを終了する
     *
     * @param {Game_Battler[]} targetBattlers 対象バトラーリスト
     * @param {MZ.Skill[]} skills 対象スキルリスト。省略時には全スキルが対象
     */
    finishCooldowns(targetBattlers, skills) {
      const targetCooldowns = targetBattlers
        .map((battler) => {
          const cooldowns = battler.isActor()
            ? this.actorsCooldowns(battler.skillCooldownId())
            : this.enemysCooldowns(battler.skillCooldownId());
          return skills ? cooldowns.filter((_, skillId) => skills.some((skill) => skill.id === skillId)) : cooldowns;
        })
        .flat();
      targetCooldowns.forEach((cooldown) => cooldown.finish());
    }
  }
  const skillCooldownManager = new SkillCooldownManager();
  PluginManager.registerCommand(pluginName, command_plusCooldownTurns, function (args) {
    const parsedArgs = parseArgs_plusCooldownTurns(args);
    const targetBattlers =
      parsedArgs.actors.length === 0
        ? $gameParty.allMembers()
        : parsedArgs.actors.map((actorId) => $gameActors.actor(actorId));
    const targetSkills =
      parsedArgs.skills.length === 0 ? null : parsedArgs.skills.map((skillId) => $dataSkills[skillId]);
    skillCooldownManager.plusCooldownTurns(targetBattlers, parsedArgs.turn, targetSkills);
  });
  PluginManager.registerCommand(pluginName, command_finishCooldowns, function (args) {
    const parsedArgs = parseArgs_finishCooldowns(args);
    const targetBattlers =
      parsedArgs.actors.length === 0
        ? $gameParty.allMembers()
        : parsedArgs.actors.map((actorId) => $gameActors.actor(actorId));
    const targetSkills =
      parsedArgs.skills.length === 0 ? null : parsedArgs.skills.map((skillId) => $dataSkills[skillId]);
    skillCooldownManager.finishCooldowns(targetBattlers, targetSkills);
  });
  function BattleManager_SkillCooldownMixIn(battleManager) {
    const _startBattle = battleManager.startBattle;
    battleManager.startBattle = function () {
      skillCooldownManager.initialize();
      _startBattle.call(this);
    };
    const _endTurn = battleManager.endTurn;
    battleManager.endTurn = function () {
      _endTurn.call(this);
      /**
       * ターン制のみ、控えメンバーのターン経過
       */
      if (!this.isTpb() && settings.decreaseBenchwarmersCooldown) {
        $gameParty
          .allMembers()
          .filter((actor) => !actor.isBattleMember())
          .forEach((actor) => skillCooldownManager.decreaseCooldownTurns(actor.skillCooldownId(), true));
      }
    };
  }
  BattleManager_SkillCooldownMixIn(BattleManager);
  /**
   * @param {Game_BattlerBase.prototype} gameBattlerBase
   */
  function Game_BattlerBase_SkillCooldownMixIn(gameBattlerBase) {
    const _meetsSkillConditions = gameBattlerBase.meetsSkillConditions;
    gameBattlerBase.meetsSkillConditions = function (skill) {
      return _meetsSkillConditions.call(this, skill) && !this.isDuringCooldown(skill);
    };
    /**
     * スキルクールタイムを開始する
     * @param {MZ.Skill} triggerSkill スキルデータ
     */
    gameBattlerBase.setupCooldownTurn = function (triggerSkill) {
      skillCooldownManager.setupCooldownTurn(this.skillCooldownId(), triggerSkill, this.isActor());
    };
    /**
     * 指定したスキルのクールタイム中であるかどうか
     * @param {MZ.Skill} skill スキルデータ
     * @return {boolean}
     */
    gameBattlerBase.isDuringCooldown = function (skill) {
      return (
        $gameParty.inBattle() && skillCooldownManager.isDuringCooldown(this.skillCooldownId(), skill, this.isActor())
      );
    };
    /**
     * 指定したスキルの残りクールタイムを返す
     * @param {MZ.Skill} skill スキルデータ
     * @return {number}
     */
    gameBattlerBase.cooldownTurn = function (skill) {
      return skillCooldownManager.cooldownTurn(this.skillCooldownId(), skill, this.isActor());
    };
    gameBattlerBase.skillCooldownId = function () {
      return 0;
    };
    /**
     * クールダウンターンカウントを進める
     */
    gameBattlerBase.decreaseCooldownTurns = function () {
      skillCooldownManager.decreaseCooldownTurns(this.skillCooldownId(), this.isActor());
    };
    gameBattlerBase.initialSkillCooldowns = function () {
      return [];
    };
  }
  Game_BattlerBase_SkillCooldownMixIn(Game_BattlerBase.prototype);
  /**
   * @param {Game_Battler.prototype} gameBattler
   */
  function Game_Battler_SkillCooldownMixIn(gameBattler) {
    const _useItem = gameBattler.useItem;
    gameBattler.useItem = function (item) {
      _useItem.call(this, item);
      if (DataManager.isSkill(item) && $gameParty.inBattle()) {
        this.setupCooldownTurn(item);
      }
    };
    const _onTurnEnd = gameBattler.onTurnEnd;
    gameBattler.onTurnEnd = function () {
      _onTurnEnd.call(this);
      /**
       * アクターの場合、マップ上でもターンエンド判定があるため、戦闘中に限定する
       */
      if ($gameParty.inBattle()) {
        this.decreaseCooldownTurns();
      }
    };
  }
  Game_Battler_SkillCooldownMixIn(Game_Battler.prototype);
  function Game_Actor_SkillCooldownMixIn(gameActor) {
    gameActor.skillCooldownId = function () {
      return this.actorId();
    };
  }
  Game_Actor_SkillCooldownMixIn(Game_Actor.prototype);
  function Game_Enemy_SkillCooldownMixIn(gameEnemy) {
    gameEnemy.skillCooldownId = function () {
      return this.index();
    };
  }
  Game_Enemy_SkillCooldownMixIn(Game_Enemy.prototype);
  function Window_SkillList_SkillCooldownMixIn(windowClass) {
    const _drawSkillCost = windowClass.drawSkillCost;
    windowClass.drawSkillCost = function (skill, x, y, width) {
      if (settings.displayCooldownTurn && this._actor && this._actor.isDuringCooldown(skill)) {
        const cooldownText = settings.cooldownFormat.replace(/\{turn\}/gi, `${this._actor.cooldownTurn(skill)}`);
        this.changeTextColor(ColorManager.textColor(settings.cooldownTextColor));
        this.drawText(cooldownText, x, y, width, 'right');
      } else {
        _drawSkillCost.call(this, skill, x, y, width);
      }
    };
  }
  Window_SkillList_SkillCooldownMixIn(Window_SkillList.prototype);
  globalThis.Game_SkillCooldown = Game_SkillCooldown;
  globalThis.skillCooldownManager = skillCooldownManager;
  globalThis.SkillCooldownManager = SkillCooldownManager;
})();
