import { settings } from './_build/DarkPlasma_ExpandTargetScope_parameters';

/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_ExpandTargetScopeMixIn(gameAction) {
  const _clear = gameAction.clear;
  gameAction.clear = function () {
    _clear.call(this);
    this._isExpandedScope = false;
    this._enableForAllRate = false;
  };

  gameAction.expandScope = function () {
    this._isExpandedScope = !this.isForAllByDefault();
  };

  gameAction.canExpandScope = function () {
    return this._item.object().meta.canExpandScope;
  };

  gameAction.isExpandedScope = function () {
    return this._isExpandedScope;
  };

  const _isForOne = gameAction.isForOne;
  gameAction.isForOne = function () {
    return _isForOne.call(this) && !this._isExpandedScope;
  };

  const _isForAll = gameAction.isForAll;
  gameAction.isForAll = function () {
    return _isForAll.call(this) || this._isExpandedScope;
  };

  /**
   * 元々から全体対象であるかどうか
   * @return {boolean}
   */
  gameAction.isForAllByDefault = function () {
    return _isForAll.call(this);
  };

  const _needsSelection = gameAction.needsSelection;
  gameAction.needsSelection = function () {
    return _needsSelection.call(this) || this.isForAll();
  };

  const _makeDamageValue = gameAction.makeDamageValue;
  gameAction.makeDamageValue = function (target, critical) {
    const value = _makeDamageValue.call(this, target, critical);
    return Math.floor(value * this.expandedScopeDamageRate());
  };

  /**
   * 全体化している場合、全体化ダメージ倍率を返す
   * 全体化していない場合、1を返す
   * @return {number}
   */
  gameAction.expandedScopeDamageRate = function () {
    /**
     * 全体化済み かつ 敵残数2以上なら全体化倍率を有効化
     * 単純に同条件で倍率をかけると、全体化攻撃で残り1体になった場合、最後の1体に倍率がかからない
     * そのため、やや気持ち悪いが一度でも全体化倍率がかかった行動には必ず全体化倍率をかける
     */
    if (this._isExpandedScope && $gameTroop.aliveMembers().length > 1) {
      this._enableForAllRate = true;
    }
    return this._enableForAllRate ? settings.damageRateForAll / 100 : 1;
  };
}

Game_Action_ExpandTargetScopeMixIn(Game_Action.prototype);

Game_Unit.prototype.selectAll = function () {
  this.aliveMembers().forEach((member) => member.select());
  this.aliveMembers().forEach((member) => member.requestSyncSelectionEffect());
};

const _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
Game_BattlerBase.prototype.skillMpCost = function (skill) {
  const value = _Game_BattlerBase_skillMpCost.call(this, skill);
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

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_ExpandScopeTargetMixIn(sceneBattle) {
  const _startActorSelection = sceneBattle.startActorSelection;
  sceneBattle.startActorSelection = function () {
    _startActorSelection.call(this);
    const action = BattleManager.inputtingAction();
    if (action.isForAllByDefault()) {
      this._actorWindow.setCursorAll(true);
      this._actorWindow.setCursorFixed(true);
    } else {
      this._actorWindow.setCursorAll(false);
      this._actorWindow.setCursorFixed(false);
    }
    this._actorWindow.refreshCursor();
  };

  const _startEnemySelection = sceneBattle.startEnemySelection;
  sceneBattle.startEnemySelection = function () {
    _startEnemySelection.call(this);
    const action = BattleManager.inputtingAction();
    if (action.isForAllByDefault()) {
      this._enemyWindow.setCursorAll(true);
      this._enemyWindow.setCursorFixed(true);
    } else {
      this._enemyWindow.setCursorAll(false);
      this._enemyWindow.setCursorFixed(false);
    }
    this._enemyWindow.refreshCursor();
  };

  const _onActorOk = sceneBattle.onActorOk;
  sceneBattle.onActorOk = function () {
    if (this._actorWindow.cursorAll()) {
      const action = BattleManager.inputtingAction();
      action.expandScope();
    }
    _onActorOk.call(this);
  };

  const _onEnemyOk = sceneBattle.onEnemyOk;
  sceneBattle.onEnemyOk = function () {
    if (this._enemyWindow.cursorAll()) {
      const action = BattleManager.inputtingAction();
      action.expandScope();
    }
    _onEnemyOk.call(this);
  };
}

Scene_Battle_ExpandScopeTargetMixIn(Scene_Battle.prototype);

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

/**
 * @param {Window_BattleActor.prototype|Window_BattleEnemy.prototype} windowClass
 */
function Window_BattleTarget_ExpandTargetScopeMixIn(windowClass) {
  windowClass.processExpandScope = function () {
    if (!$gameParty.inBattle()) {
      return false;
    }
    const action = BattleManager.inputtingAction();
    if (action.canExpandScope() && Input.isTriggered(settings.switchScopeButton) && !this.cursorFixed()) {
      this.setCursorAll(!this._cursorAll);
      return true;
    }
    return false;
  };

  const _processHandling = windowClass.processHandling;
  windowClass.processHandling = function () {
    if (this.isOpenAndActive()) {
      if (this.processExpandScope()) {
        return;
      }
    }
    return _processHandling.call(this);
  };

  /**
   * @return {Game_Unit}
   */
  windowClass.unit = function () {
    return null;
  };

  /**
   * @return {Game_Battler}
   */
  windowClass.currentTarget = function () {
    return null;
  };

  const _setCursorAll = windowClass.setCursorAll;
  windowClass.setCursorAll = function (cursorAll) {
    _setCursorAll.call(this, cursorAll);
    if (cursorAll) {
      this.unit().selectAll();
    } else {
      this.unit().select(this.currentTarget());
    }
    SoundManager.playCursor();
    this.refreshCursor();
  };
}

Window_BattleTarget_ExpandTargetScopeMixIn(Window_BattleActor.prototype);
Window_BattleTarget_ExpandTargetScopeMixIn(Window_BattleEnemy.prototype);

/**
 * @param {Window_BattleActor.prototype} windowClass
 */
function Window_BattleActor_ExpandTargetScopeMixIn(windowClass) {
  windowClass.unit = function () {
    return $gameParty;
  };

  windowClass.currentTarget = function () {
    return this.actor(this.index());
  };
}

Window_BattleActor_ExpandTargetScopeMixIn(Window_BattleActor.prototype);

/**
 * @param {Window_BattleEnemy.prototype} windowClass
 */
function Window_BattleEnemy_ExpandScopeTargetMixIn(windowClass) {
  windowClass.unit = function () {
    return $gameTroop;
  };

  windowClass.currentTarget = function () {
    return this.enemy();
  };

  const _refreshCursorForAll = windowClass.refreshCursorForAll;
  windowClass.refreshCursorForAll = function () {
    const maxItems = this.maxItems();
    if (maxItems > 0) {
      const rect = this.itemRect(0);
      [...Array(maxItems).keys()].forEach((index) => rect.enlarge(this.itemRect(index)));
      this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
      _refreshCursorForAll.call(this);
    }
  };
}

Window_BattleEnemy_ExpandScopeTargetMixIn(Window_BattleEnemy.prototype);

/**
 * 全体化アニメーションのため上書き
 * @param {Game_Battler} subject
 * @param {Game_Action} action
 * @param {Game_Battler[]} targets
 */
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
