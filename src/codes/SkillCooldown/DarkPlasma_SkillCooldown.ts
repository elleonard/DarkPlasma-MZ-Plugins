/// <reference path="./SkillCooldown.d.ts" />

import { settings } from './_build/DarkPlasma_SkillCooldown_parameters';
import { pluginName } from '../../common/pluginName';
import { command_finishCooldowns, command_plusCooldownTurns, parseArgs_finishCooldowns, parseArgs_plusCooldownTurns } from './_build/DarkPlasma_SkillCooldown_commands';

class SkillCooldown {
  _skillId: number;
  _turnCount: number;

  /**
   * @param {number} skillId スキルID
   * @param {number} turnCount ターン数
   */
  constructor(skillId: number, turnCount: number) {
    this._skillId = skillId;
    this._turnCount = turnCount;
  }

  /**
   * 指定IDのスキル使用をトリガーとするクールダウンオブジェクトのセットアップ
   * @param {number} triggerSkillId トリガースキルID
   * @return {SkillCooldown[]}
   */
  static setup(triggerSkillId: number): SkillCooldown[] {
    const cooldownSetting: SkillCooldownSetting = settings.skillCooldownSettings.find(
      (cooldown: SkillCooldownSetting) => cooldown.triggerSkillId === triggerSkillId
    );
    /**
     * メモ欄による設定
     */
    const result: SkillCooldown[] = [];
    if ($dataSkills[triggerSkillId].meta.cooldownTurn) {
      result.push(new SkillCooldown(triggerSkillId, Number($dataSkills[triggerSkillId].meta.cooldownTurn) + 1));
    }
    /**
     * プラグインパラメータによる設定
     */
    return result.concat(
      cooldownSetting
        ? cooldownSetting.targetSkills.map(
          (target) => new SkillCooldown(target.targetSkillId, target.cooldownTurnCount + 1)
        )
        : []
    );
  }

  /**
   * @return {number}
   */
  get skillId(): number {
    return this._skillId;
  }

  /**
   * @return {number}
   */
  get turnCount(): number {
    return this._turnCount;
  }

  /**
   * @return {boolean}
   */
  isFinished(): boolean {
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

  plusTurn(plus: number) {
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
  _actorsSkillCooldowns: SkillCooldown[][];
  _enemysSkillCooldowns: SkillCooldown[][];

  constructor() {
    /**
     * @type {SkillCooldown[][]}
     */
    this._actorsSkillCooldowns = [];

    /**
     * @type {SkillCooldown[][]}
     */
    this._enemysSkillCooldowns = [];
  }

  /**
   * 初期化する。戦闘開始時に呼び出される
   */
  initialize() {
    $gameParty.allMembers().forEach((actor) => {
      this._actorsSkillCooldowns[actor.actorId()] = [];
    });
    $gameTroop.members().forEach((enemy) => {
      this._enemysSkillCooldowns[enemy.index()] = [];
    });
  }

  /**
   * @param {number} actorId
   * @return {SkillCooldown[]}
   */
  actorsCooldowns(actorId: number): SkillCooldown[] {
    if (!this._actorsSkillCooldowns[actorId]) {
      this._actorsSkillCooldowns[actorId] = [];
    }
    return this._actorsSkillCooldowns[actorId];
  }

  /**
   * @param {number} index
   * @return {SkillCooldown[]}
   */
  enemysCooldowns(index: number): SkillCooldown[] {
    if (!this._enemysSkillCooldowns[index]) {
      this._enemysSkillCooldowns[index] = [];
    }
    return this._enemysSkillCooldowns[index];
  }

  /**
   * クールダウン開始
   * @param {number} id
   * @param {MZ.Skill} skill スキルデータ
   * @param {boolean} isActor
   */
  setupCooldownTurn(id: number, skill: MZ.Skill, isActor: boolean) {
    const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
    const cooldowns = SkillCooldown.setup(skill.id);
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
  isDuringCooldown(id: number, skill: MZ.Skill, isActor: boolean): boolean {
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
  cooldownTurn(id: number, skill: MZ.Skill, isActor: boolean): number {
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
  decreaseCooldownTurns(id: number, isActor: boolean) {
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
  plusCooldownTurns(targetBattlers: Game_Battler[], plus: number, skills?: MZ.Skill[]) {
    const targetCooldowns = targetBattlers
      .map(battler => {
        const cooldowns = battler.isActor()
          ? this.actorsCooldowns(battler.skillCooldownId())
          : this.enemysCooldowns(battler.skillCooldownId());
        return skills ? cooldowns.filter((_, skillId) => skills.some(skill => skill.id === skillId)) : cooldowns;
      })
      .flat();
    targetCooldowns
      .filter(cooldown => !cooldown.isFinished())
      .forEach(cooldown => cooldown.plusTurn(plus));
  }

  /**
   * すでに開始してるクールタイムを終了する
   *
   * @param {Game_Battler[]} targetBattlers 対象バトラーリスト
   * @param {MZ.Skill[]} skills 対象スキルリスト。省略時には全スキルが対象
   */
  finishCooldowns(targetBattlers: Game_Battler[], skills?: MZ.Skill[]) {
    const targetCooldowns = targetBattlers
      .map(battler => {
        const cooldowns = battler.isActor()
          ? this.actorsCooldowns(battler.skillCooldownId())
          : this.enemysCooldowns(battler.skillCooldownId());
        return skills ? cooldowns.filter((_, skillId) => skills.some(skill => skill.id === skillId)) : cooldowns;
      })
      .flat();
    targetCooldowns.forEach(cooldown => cooldown.finish());
  }
}

const skillCooldownManager = new SkillCooldownManager();

PluginManager.registerCommand(pluginName, command_plusCooldownTurns, function (args) {
  const parsedArgs = parseArgs_plusCooldownTurns(args);
  const targetBattlers = parsedArgs.actors.length === 0
    ? $gameParty.allMembers()
    : parsedArgs.actors.map((actorId: number) => $gameActors.actor(actorId));
  const targetSkills = parsedArgs.skills.length === 0
    ? null
    : parsedArgs.skills.map((skillId: number) => $dataSkills[skillId]);
  skillCooldownManager.plusCooldownTurns(targetBattlers, parsedArgs.turn, targetSkills);
});

PluginManager.registerCommand(pluginName, command_finishCooldowns, function (args) {
  const parsedArgs = parseArgs_finishCooldowns(args);
  const targetBattlers = parsedArgs.actors.length === 0
    ? $gameParty.allMembers()
    : parsedArgs.actors.map((actorId: number) => $gameActors.actor(actorId));
  const targetSkills = parsedArgs.skills.length === 0
    ? null
    : parsedArgs.skills.map((skillId: number) => $dataSkills[skillId]);
  skillCooldownManager.finishCooldowns(targetBattlers, targetSkills);
});

function BattleManager_SkillCooldownMixIn(battleManager: typeof BattleManager) {
  const _startBattle = battleManager.startBattle;
  battleManager.startBattle = function () {
    _startBattle.call(this);
    skillCooldownManager.initialize();
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
function Game_BattlerBase_SkillCooldownMixIn(gameBattlerBase: Game_BattlerBase) {
  const _meetsSkillConditions = gameBattlerBase.meetsSkillConditions;
  gameBattlerBase.meetsSkillConditions = function (skill) {
    return _meetsSkillConditions.call(this, skill) && !this.isDuringCooldown(skill);
  };

  /**
   * スキルクールタイムを開始する
   * @param {MZ.Skill} skill スキルデータ
   */
  gameBattlerBase.setupCooldownTurn = function (skill: MZ.Skill) {
    skillCooldownManager.setupCooldownTurn(this.skillCooldownId(), skill, this.isActor());
  };

  /**
   * 指定したスキルのクールタイム中であるかどうか
   * @param {MZ.Skill} skill スキルデータ
   * @return {boolean}
   */
  gameBattlerBase.isDuringCooldown = function (skill: MZ.Skill): boolean {
    return skillCooldownManager.isDuringCooldown(this.skillCooldownId(), skill, this.isActor());
  };

  /**
   * 指定したスキルの残りクールタイムを返す
   * @param {MZ.Skill} skill スキルデータ
   * @return {number}
   */
  gameBattlerBase.cooldownTurn = function (skill: MZ.Skill): number {
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
}

Game_BattlerBase_SkillCooldownMixIn(Game_BattlerBase.prototype);

/**
 * @param {Game_Battler.prototype} gameBattler
 */
function Game_Battler_SkillCooldownMixIn(gameBattler: Game_Battler) {
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

function Game_Actor_SkillCooldownMixIn(gameActor: Game_Actor) {
  gameActor.skillCooldownId = function () {
    return this.actorId();
  };
}

Game_Actor_SkillCooldownMixIn(Game_Actor.prototype);

function Game_Enemy_SkillCooldownMixIn(gameEnemy: Game_Enemy) {
  gameEnemy.skillCooldownId = function () {
    return this.index();
  };
}

Game_Enemy_SkillCooldownMixIn(Game_Enemy.prototype);

function Window_SkillList_SkillCooldownMixIn(windowClass: Window_SkillList) {
  const _drawSkillCost = windowClass.drawSkillCost;
  windowClass.drawSkillCost = function (skill, x, y, width) {
    if ($gameParty.inBattle() && settings.displayCooldownTurn && this._actor && this._actor.isDuringCooldown(skill)) {
      const cooldownText = settings.cooldownFormat.replace(/\{turn\}/gi, `${this._actor.cooldownTurn(skill)}`);
      this.changeTextColor(ColorManager.textColor(settings.cooldownTextColor));
      this.drawText(cooldownText, x, y, width, 'right');
    } else {
      _drawSkillCost.call(this, skill, x, y, width);
    }
  };
}

Window_SkillList_SkillCooldownMixIn(Window_SkillList.prototype);
