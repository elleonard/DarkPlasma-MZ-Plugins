import { settings } from './_build/DarkPlasma_SkillCooldown_parameters';

class SkillCooldown {
  /**
   * @param {number} skillId スキルID
   * @param {number} turnCount ターン数
   */
  constructor(skillId, turnCount) {
    this._skillId = skillId;
    this._turnCount = turnCount;
  }

  /**
   * @param {number} triggerSkillId トリガースキルID
   * @return {SkillCooldown[]}
   */
  static setup(triggerSkillId) {
    const cooldownSetting = settings.skillCooldownSettings.find(
      (cooldown) => cooldown.triggerSkillId === triggerSkillId
    );
    return cooldownSetting
      ? cooldownSetting.targetSkills.map(
          (target) => new SkillCooldown(target.targetSkillId, target.cooldownTurnCount + 1)
        )
      : [];
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

  /**
   * ターンカウントを進める
   */
  decreaseTurn() {
    this._turnCount--;
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
  actorsCooldowns(actorId) {
    if (!this._actorsSkillCooldowns[actorId]) {
      this._actorsSkillCooldowns[actorId] = [];
    }
    return this._actorsSkillCooldowns[actorId];
  }

  /**
   * @param {number} index
   * @return {SkillCooldown[]}
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
   * @param {MZ.Skill} skill スキルデータ
   * @param {boolean} isActor
   */
  setupCooldownTurn(id, skill, isActor) {
    const targetCooldowns = isActor ? this.actorsCooldowns(id) : this.enemysCooldowns(id);
    const cooldowns = SkillCooldown.setup(skill.id);
    cooldowns.forEach((cooldown) => {
      targetCooldowns[cooldown.skillId] = cooldown;
    });
  }

  /**
   * クールダウン中かどうか
   * @param {number} id
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
   * @param {number} id
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
      : this._actorsSkillCooldowns.filter((_, actorId) => $gameActors.actor(actorId).isBattleMember());
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
}

const skillCooldownManager = new SkillCooldownManager();

const _BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function () {
  _BattleManager_startBattle.call(this);
  skillCooldownManager.initialize();
};

const _BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function () {
  _BattleManager_endTurn.call(this);
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
   * @param {MZ.Skill} skill スキルデータ
   */
  gameBattlerBase.setupCooldownTurn = function (skill) {
    skillCooldownManager.setupCooldownTurn(this.skillCooldownId(), skill, this.isActor());
  };

  /**
   * 指定したスキルのクールタイム中であるかどうか
   * @param {MZ.Skill} skill スキルデータ
   * @return {boolean}
   */
  gameBattlerBase.isDuringCooldown = function (skill) {
    return skillCooldownManager.isDuringCooldown(this.skillCooldownId(), skill, this.isActor());
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

Game_Actor.prototype.skillCooldownId = function () {
  return this.actorId();
};

Game_Enemy.prototype.skillCooldownId = function () {
  return this.index();
};

const _Window_SKillList_drawSkillCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
  if ($gameParty.inBattle() && settings.displayCooldownTurn && this._actor.isDuringCooldown(skill)) {
    const cooldownText = settings.cooldownFormat.replace(/\{turn\}/gi, this._actor.cooldownTurn(skill));
    this.changeTextColor(ColorManager.textColor(settings.cooldownTextColor));
    this.drawText(cooldownText, x, y, width, 'right');
  } else {
    _Window_SKillList_drawSkillCost.call(this, skill, x, y, width);
  }
};

if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth) {
    let flattend = [];
    (function flat(array, depth) {
      for (let el of array) {
        if (Array.isArray(el) && depth > 0) {
          flat(el, depth - 1);
        } else {
          flattend.push(el);
        }
      }
    })(this, Math.floor(depth) || 1);
    return flattend.filter((el) => el);
  };
}
