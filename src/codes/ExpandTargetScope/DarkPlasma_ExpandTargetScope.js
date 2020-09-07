import { settings } from './_build/DarkPlasma_ExpandTargetScope_parameters';

const _Game_Action_clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function () {
  _Game_Action_clear.call(this);
  this._isExpandedScope = false;
  this._enableForAllRate = false;
};

Game_Action.prototype.expandScope = function () {
  this._isExpandedScope = true;
};

Game_Action.prototype.canExpandScope = function () {
  return this._item.object().meta.canExpandScope;
};

Game_Action.prototype.isExpandedScope = function () {
  return this._isExpandedScope;
};

const _Game_Action_isForOne = Game_Action.prototype.isForOne;
Game_Action.prototype.isForOne = function () {
  return _Game_Action_isForOne.call(this) && !this._isExpandedScope;
};

const _Game_Action_isForAll = Game_Action.prototype.isForAll;
Game_Action.prototype.isForAll = function () {
  return _Game_Action_isForAll.call(this) || this._isExpandedScope;
};

const _Game_Action_needsSelection = Game_Action.prototype.needsSelection;
Game_Action.prototype.needsSelection = function () {
  return _Game_Action_needsSelection.call(this) || this.isForAll();
};

const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function (target, critical) {
  const value = _Game_Action_makeDamageValue.call(this, target, critical);
  /**
   * 全体化済み かつ 敵残数2以上なら全体化倍率を有効化
   * 単純に同条件で倍率をかけると、全体化攻撃で残り1体になった場合、最後の1体に倍率がかからない
   */
  if (this._isExpandedScope && $gameTroop.aliveMembers().length > 1) {
    this._enableForAllRate = true;
  }
  if (this._enableForAllRate) {
    return Math.floor((value * settings.damageRateForAll) / 100);
  }
  return value;
};

Game_Unit.prototype.selectAll = function () {
  this.aliveMembers().forEach((member) => member.select());
  this.aliveMembers().forEach((member) => member.requestSyncSelectionEffect());
};

const _Game_Battler_skillMpCost = Game_Battler.prototype.skillMpCost;
Game_Battler.prototype.skillMpCost = function (skill) {
  const value = _Game_Battler_skillMpCost.call(this, skill);
  const action = this.currentAction();
  if (action && action.isExpandedScope()) {
    return Math.floor((value * settings.mpCostRateForAll) / 100);
  }
  return value;
};

Game_Battler.prototype.requestSyncSelectionEffect = function () {
  this._syncSelectionEffectRequested = true;
};

Game_Battler.prototype.isSyncSelectionEffectRequested = function () {
  return this._syncSelectionEffectRequested;
};

Game_Battler.prototype.syncSelectionEffect = function () {
  this._syncSelectionEffectRequested = false;
};

const _Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection;
Scene_Battle.prototype.startActorSelection = function () {
  _Scene_Battle_startActorSelection.call(this);
  const action = BattleManager.inputtingAction();
  if (action.isForAll()) {
    this._actorWindow.setCursorAll(true);
    this._actorWindow.setCursorFixed(true);
  } else {
    this._actorWindow.setCursorAll(false);
    this._actorWindow.setCursorFixed(false);
  }
};

const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
Scene_Battle.prototype.startEnemySelection = function () {
  _Scene_Battle_startEnemySelection.call(this);
  const action = BattleManager.inputtingAction();
  if (action.isForAll()) {
    this._enemyWindow.setCursorAll(true);
    this._enemyWindow.setCursorFixed(true);
  } else {
    this._enemyWindow.setCursorAll(false);
    this._enemyWindow.setCursorFixed(false);
  }
};

const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
Scene_Battle.prototype.onActorOk = function () {
  if (this._actorWindow.cursorAll()) {
    const action = BattleManager.inputtingAction();
    action.expandScope();
  }
  _Scene_Battle_onActorOk.call(this);
};

const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function () {
  if (this._enemyWindow.cursorAll()) {
    const action = BattleManager.inputtingAction();
    action.expandScope();
  }
  _Scene_Battle_onEnemyOk.call(this);
};

const _Sprite_Battler_updateSelectionEffect = Sprite_Battler.prototype.updateSelectionEffect;
Sprite_Battler.prototype.updateSelectionEffect = function () {
  if (this._battler.isSelected()) {
    if (this._battler.isSyncSelectionEffectRequested()) {
      this._selectionEffectCount = 0;
      this._battler.syncSelectionEffect();
    }
  }
  _Sprite_Battler_updateSelectionEffect.call(this);
};

const _Window_BattleEnemy_processHandling = Window_BattleEnemy.prototype.processHandling;
Window_BattleEnemy.prototype.processHandling = function () {
  if (this.isOpenAndActive()) {
    const action = BattleManager.inputtingAction();
    if (action.canExpandScope() && Input.isTriggered(settings.shiftScopeButton) && !this.cursorFixed()) {
      this.setCursorAll(!this._cursorAll);
      if (this.cursorAll()) {
        $gameTroop.selectAll();
      } else {
        $gameTroop.select(this.enemy());
      }
    }
  }
  return _Window_BattleEnemy_processHandling.call(this);
};

Window_BattleLog.prototype.startAction = function (subject, action, targets) {
  const item = action.item();
  this.push('performActionStart', subject, action);
  this.push('waitForMovement');
  this.push('performAction', subject, action);
  if (action.isExpandedScope() && item.meta.expandedAnimationId) {
    this.push('showAnimation', subject, targets.clone(), item.meta.expandedAnimationId);
  } else {
    this.push('showAnimation', subject, targets.clone(), item.animationId);
  }
  this.displayAction(subject, item);
};
