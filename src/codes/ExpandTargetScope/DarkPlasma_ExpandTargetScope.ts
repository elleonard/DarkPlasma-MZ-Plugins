/// <reference path="./ExpandTargetScope.d.ts" />
import { settings } from './_build/DarkPlasma_ExpandTargetScope_parameters';

/**
 * @param {Game_Temp.prototype} gameTemp
 */
function Game_Temp_ExpandTargetScopeMixIn(gameTemp: Game_Temp) {
  const _initialize = gameTemp.initialize;
  gameTemp.initialize = function (this: Game_Temp) {
    _initialize.call(this);
    this._syncSelectionEffectRequestedBattlers = [];
    this._expandTargetScope = false;
  };

  /**
   * @param {Game_Battler} battler
   */
  gameTemp.requestSyncSelectionEffect = function (this: Game_Temp, battler: Game_Battler) {
    this._syncSelectionEffectRequestedBattlers.push(battler);
  };

  /**
   * @param {Game_Battler} battler
   */
  gameTemp.isSyncSelectionEffectRequested = function (this: Game_Temp, battler: Game_Battler) {
    return this._syncSelectionEffectRequestedBattlers.includes(battler);
  };

  /**
   * @param {Game_Battler} battler
   */
  gameTemp.processSyncSelectionEffect = function (this: Game_Temp, battler: Game_Battler) {
    this._syncSelectionEffectRequestedBattlers = this._syncSelectionEffectRequestedBattlers.filter(
      (b) => b !== battler
    );
  };

  gameTemp.isExpandScopeTargetRequested = function () {
    return this._expandTargetScope;
  };

  gameTemp.toggleExpandTargetScope = function () {
    this._expandTargetScope = !this._expandTargetScope;
  };

  gameTemp.resetExpandTargetScope = function () {
    this._expandTargetScope = false;
  };
}

Game_Temp_ExpandTargetScopeMixIn(Game_Temp.prototype);

/**
 * @param {Game_Action.prototype} gameAction
 */
function Game_Action_ExpandTargetScopeMixIn(gameAction: Game_Action) {
  const _clear = gameAction.clear;
  gameAction.clear = function (this: Game_Action) {
    _clear.call(this);
    this._isExpandedScope = $gameTemp.isExpandScopeTargetRequested();
    this._enableForAllRate = false;
  };

  gameAction.expandScope = function (this: Game_Action) {
    this._isExpandedScope = !this.isForAllByDefault();
  };

  gameAction.resetExpandScope = function (this: Game_Action) {
    this._isExpandedScope = false;
  };

  gameAction.canExpandScope = function (this: Game_Action) {
    return !!this._item.object()?.meta.canExpandScope;
  };

  gameAction.isExpandedScope = function (this: Game_Action) {
    return this._isExpandedScope;
  };

  const _isForOne = gameAction.isForOne;
  gameAction.isForOne = function (this: Game_Action) {
    return _isForOne.call(this) && !this._isExpandedScope;
  };

  const _isForAll = gameAction.isForAll;
  gameAction.isForAll = function (this: Game_Action) {
    return _isForAll.call(this) || this._isExpandedScope;
  };

  /**
   * 元々から全体対象であるかどうか
   * @return {boolean}
   */
  gameAction.isForAllByDefault = function (this: Game_Action): boolean {
    return _isForAll.call(this);
  };

  const _needsSelection = gameAction.needsSelection;
  gameAction.needsSelection = function (this: Game_Action) {
    return _needsSelection.call(this) || (this.isForAll() && !settings.skipTargetSelectionForAll);
  };

  const _makeDamageValue = gameAction.makeDamageValue;
  gameAction.makeDamageValue = function (this: Game_Action, target, critical) {
    const value = _makeDamageValue.call(this, target, critical);
    return Math.floor(value * this.expandedScopeDamageRate());
  };

  /**
   * 全体化している場合、全体化ダメージ倍率を返す
   * 全体化していない場合、1を返す
   * @return {number}
   */
  gameAction.expandedScopeDamageRate = function (this: Game_Action): number {
    /**
     * 全体化済み かつ 対象残数2以上なら全体化倍率を有効化
     * 単純に同条件で倍率をかけると、全体化攻撃で残り1体になった場合、最後の1体に倍率がかからない
     * そのため、やや気持ち悪いが一度でも全体化倍率がかかった行動には必ず全体化倍率をかける
     */
    if (this.isExpandedDamageRateEnabled()) {
      this._enableForAllRate = true;
    }
    return this._enableForAllRate ? settings.damageRateForAll / 100 : 1;
  };

  /**
   * 全体化を使うのはプレイヤーサイドのみなので、
   * 自軍向け = パーティメンバー向け
   * 敵軍向け = 敵グループ向け
   */
  gameAction.isExpandedDamageRateEnabled = function () {
    return this._isExpandedScope
      && (this.isForFriend() && $gameParty.aliveMembers().length > 1
        || this.isForOpponent() && $gameTroop.aliveMembers().length > 1);
  };
}

Game_Action_ExpandTargetScopeMixIn(Game_Action.prototype);

function Game_Unit_ExpandTargetScopeMixIn(gameUnit: Game_Unit) {
  gameUnit.selectAll = function (this: Game_Unit) {
    this.aliveMembers().forEach((member) => member.select());
    this.aliveMembers().forEach((member) => $gameTemp.requestSyncSelectionEffect(member));
  };
}

Game_Unit_ExpandTargetScopeMixIn(Game_Unit.prototype);

function Game_BattlerBase_ExpandTargetScopeMixIn(gameBattlerBase: Game_BattlerBase) {
  const _skillMpCost = gameBattlerBase.skillMpCost;
  gameBattlerBase.skillMpCost = function (skill) {
    return Math.floor(_skillMpCost.call(this, skill) * this.mpCostRateByExpandScope() / 100);
  };

  gameBattlerBase.mpCostRateByExpandScope = function () {
    return 100;
  };
}

Game_BattlerBase_ExpandTargetScopeMixIn(Game_BattlerBase.prototype);

function Game_Battler_ExpandTargetScopeMixIn(gameBattler: Game_Battler) {
  const _mpCostRateByExpandScope = gameBattler.mpCostRateByExpandScope;
  gameBattler.mpCostRateByExpandScope = function () {
    const action = this.currentAction();
    return action?.isExpandedScope()
      ? settings.mpCostRateForAll
      : _mpCostRateByExpandScope.call(this);
  };

  gameBattler.resetAllActionsExpandedScope = function (this: Game_Battler) {
    this._actions.forEach(action => action.resetExpandScope());
  };
}

Game_Battler_ExpandTargetScopeMixIn(Game_Battler.prototype);

/**
 * @param {Scene_ItemBase.prototype} sceneItemBase
 */
function Scene_ItemBase_ExpandScopeTargetMixIn(sceneItemBase: Scene_ItemBase) {
  const _createActorWindow = sceneItemBase.createActorWindow;
  sceneItemBase.createActorWindow = function (this: Scene_ItemBase) {
    _createActorWindow.call(this);
    this._actorWindow!.setHandler(settings.switchScopeButton, this.toggleTargetScope.bind(this));
  };

  sceneItemBase.toggleTargetScope = function (this: Scene_ItemBase) {
    this._actorWindow!.toggleCursorAll();
  };

  const _itemTargetActors = sceneItemBase.itemTargetActors;
  sceneItemBase.itemTargetActors = function (this: Scene_ItemBase) {
    if (this._actorWindow!.canToggleScope() && this._actorWindow!.cursorAll()) {
      return $gameParty.members();
    }
    return _itemTargetActors.call(this);
  };

  const _showActorWindow = sceneItemBase.showActorWindow;
  sceneItemBase.showActorWindow = function () {
    this._actorWindow?.setItem(this.item());
    _showActorWindow.call(this);
  };

  const _onActorCancel = sceneItemBase.onActorCancel;
  sceneItemBase.onActorCancel = function () {
    _onActorCancel.call(this);
    $gameTemp.resetExpandTargetScope();
  };
}

Scene_ItemBase_ExpandScopeTargetMixIn(Scene_ItemBase.prototype);

/**
 * @param {Scene_Battle.prototype} sceneBattle
 */
function Scene_Battle_ExpandScopeTargetMixIn(sceneBattle: Scene_Battle) {
  const _createActorWindow = sceneBattle.createActorWindow;
  sceneBattle.createActorWindow = function (this: Scene_Battle) {
    _createActorWindow.call(this);
    this._actorWindow.setHandler(settings.switchScopeButton, this.toggleTargetScopeActor.bind(this));
  };

  const _createEnemyWindow = sceneBattle.createEnemyWindow;
  sceneBattle.createEnemyWindow = function (this: Scene_Battle) {
    _createEnemyWindow.call(this);
    this._enemyWindow.setHandler(settings.switchScopeButton, this.toggleTargetScopeEnemy.bind(this));
  };

  const _startActorCommandSelection = sceneBattle.startActorCommandSelection;
  sceneBattle.startActorCommandSelection = function(this: Scene_Battle) {
    _startActorCommandSelection.call(this);
    BattleManager.actor()?.resetAllActionsExpandedScope();
  };

  const _startActorSelection = sceneBattle.startActorSelection;
  sceneBattle.startActorSelection = function (this: Scene_Battle) {
    _startActorSelection.call(this);
    const action = BattleManager.inputtingAction();
    if (action!.isForAllByDefault()) {
      this._actorWindow.setCursorAll(true);
      this._actorWindow.setCursorFixed(true);
    } else {
      this._actorWindow.setCursorAll(false);
      this._actorWindow.setCursorFixed(false);
    }
    this._actorWindow.refreshCursor();
  };

  const _startEnemySelection = sceneBattle.startEnemySelection;
  sceneBattle.startEnemySelection = function (this: Scene_Battle) {
    _startEnemySelection.call(this);
    const action = BattleManager.inputtingAction();
    if (action!.isForAllByDefault()) {
      this._enemyWindow.setCursorAll(true);
      this._enemyWindow.setCursorFixed(true);
    } else {
      this._enemyWindow.setCursorAll(false);
      this._enemyWindow.setCursorFixed(false);
    }
    this._enemyWindow.refreshCursor();
  };

  const _onActorOk = sceneBattle.onActorOk;
  sceneBattle.onActorOk = function (this: Scene_Battle) {
    const action = BattleManager.inputtingAction();
    if (this._actorWindow.cursorAll()) {
      action!.expandScope();
    } else {
      action!.resetExpandScope();
    }
    _onActorOk.call(this);
  };

  const _onEnemyOk = sceneBattle.onEnemyOk;
  sceneBattle.onEnemyOk = function (this: Scene_Battle) {
    const action = BattleManager.inputtingAction();
    if (this._enemyWindow.cursorAll()) {
      action!.expandScope();
    } else {
      action!.resetExpandScope();
    }
    _onEnemyOk.call(this);
  };

  sceneBattle.toggleTargetScopeActor = function (this: Scene_Battle) {
    this._actorWindow.toggleCursorAll();
  };

  sceneBattle.toggleTargetScopeEnemy = function (this: Scene_Battle) {
    this._enemyWindow.toggleCursorAll();
  };
}

Scene_Battle_ExpandScopeTargetMixIn(Scene_Battle.prototype);

function Sprite_Battler_ExpandTargetScopeMixIn(spriteBattler: Sprite_Battler) {
  const _updateSelectionEffect = spriteBattler.updateSelectionEffect;
  spriteBattler.updateSelectionEffect = function (this: Sprite_Battler) {
    if (this._battler!.isSelected()) {
      if ($gameTemp.isSyncSelectionEffectRequested(this._battler!)) {
        this._selectionEffectCount = 0;
        $gameTemp.processSyncSelectionEffect(this._battler!);
      }
    }
    _updateSelectionEffect.call(this);
  };
}

Sprite_Battler_ExpandTargetScopeMixIn(Sprite_Battler.prototype);

/**
 * @param {Window_MenuActor.prototype} windowClass
 */
function Window_MenuActor_ExpandTargetScopeMixIn(windowClass: Window_MenuActor) {
  windowClass.setItem = function (item) {
    if (item) {
      this._currentAction = new Game_Action($gameParty.menuActor());
      this._currentAction.setItemObject(item);
    }
  };

  const _selectForItem = windowClass.selectForItem;
  windowClass.selectForItem = function (this: Window_MenuActor, item) {
    _selectForItem.call(this, item);
    this._currentAction = new Game_Action($gameParty.menuActor());
    this._currentAction.setItemObject(item);
  };

  windowClass.toggleCursorAll = function (this: Window_MenuActor) {
    $gameTemp.toggleExpandTargetScope();
    this.setCursorAll($gameTemp.isExpandScopeTargetRequested());
    this.forceSelect(0);
    SoundManager.playCursor();
  };

  windowClass.canToggleScope = function (this: Window_MenuActor) {
    return this._currentAction && this._currentAction.canExpandScope() && !this.cursorFixed();
  };

  const _isCustomKeyEnabled = windowClass.isCustomKeyEnabled;
  windowClass.isCustomKeyEnabled = function (this: Window_MenuActor, key) {
    if (key === settings.switchScopeButton) {
      return this.canToggleScope();
    }
    return _isCustomKeyEnabled.call(this, key);
  };

  /**
   * deactivateされてしまうため
   */
  if (settings.switchScopeButton === 'pageup') {
    windowClass.processPageup = () => {};
  } else if (settings.switchScopeButton === 'pagedown') {
    windowClass.processPagedown = () => {};
  }
}

Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_MenuActor.prototype);
Window_MenuActor_ExpandTargetScopeMixIn(Window_MenuActor.prototype);

/**
 * @param {Window_BattleActor.prototype|Window_BattleEnemy.prototype} windowClass
 */
function Window_BattleTarget_ExpandTargetScopeMixIn(windowClass: Window_BattleActor | Window_BattleEnemy) {
  windowClass.toggleCursorAll = function (this: Window_BattleActor | Window_BattleEnemy) {
    this.setCursorAll(!this._cursorAll);
  };

  const _isCustomKeyEnabled = windowClass.isCustomKeyEnabled;
  windowClass.isCustomKeyEnabled = function (this: Window_BattleActor | Window_BattleEnemy, key) {
    if (key === settings.switchScopeButton) {
      return this.canToggleScope();
    }
    return _isCustomKeyEnabled.call(this, key);
  };

  windowClass.canToggleScope = function () {
    return $gameParty.inBattle() && !!BattleManager.inputtingAction()?.canExpandScope() && !this.cursorFixed()
  };

  const _setCursorAll = windowClass.setCursorAll;
  windowClass.setCursorAll = function (this: Window_BattleActor | Window_BattleEnemy, cursorAll) {
    _setCursorAll.call(this, cursorAll);
    if (cursorAll) {
      this.unit().selectAll();
    } else {
      this.unit().select(this.currentTarget());
    }
    SoundManager.playCursor();
    this.refreshCursor();
  };

  /**
   * deactivateされてしまうため
   */
  if (settings.switchScopeButton === 'pageup') {
    windowClass.processPageup = () => {};
  } else if (settings.switchScopeButton === 'pagedown') {
    windowClass.processPagedown = () => {};
  }
}

Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_BattleActor.prototype);
Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_BattleEnemy.prototype);
Window_BattleTarget_ExpandTargetScopeMixIn(Window_BattleActor.prototype);
Window_BattleTarget_ExpandTargetScopeMixIn(Window_BattleEnemy.prototype);

/**
 * @param {Window_BattleActor.prototype} windowClass
 */
function Window_BattleActor_ExpandTargetScopeMixIn(windowClass: Window_BattleActor) {
  windowClass.unit = function (this: Window_BattleActor) {
    return $gameParty;
  };

  windowClass.currentTarget = function (this: Window_BattleActor) {
    return this.actor(this.index());
  };
}

Window_BattleActor_ExpandTargetScopeMixIn(Window_BattleActor.prototype);

/**
 * @param {Window_BattleEnemy.prototype} windowClass
 */
function Window_BattleEnemy_ExpandScopeTargetMixIn(windowClass: Window_BattleEnemy) {
  windowClass.unit = function (this: Window_BattleEnemy) {
    return $gameTroop;
  };

  windowClass.currentTarget = function (this: Window_BattleEnemy) {
    return this.enemy();
  };

  const _refreshCursorForAll = windowClass.refreshCursorForAll;
  windowClass.refreshCursorForAll = function (this: Window_BattleEnemy) {
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

function Window_BattleLog_ExpandTargetScopeMixIn(windowClass: Window_BattleLog) {
  /**
   * 全体化アニメーションのため上書き
   * @param {Game_Battler} subject
   * @param {Game_Action} action
   * @param {Game_Battler[]} targets
   */
  windowClass.startAction = function (subject: Game_Battler, action: Game_Action, targets: Game_Battler[]): void {
    const item = action.item() as MZ.Skill | MZ.Item;
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
}

Window_BattleLog_ExpandTargetScopeMixIn(Window_BattleLog.prototype);
