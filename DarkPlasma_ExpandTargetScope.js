// DarkPlasma_ExpandTargetScope 1.4.0
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2023/01/14 1.4.0 拡張プラグイン用インターフェース追加
 * 2022/08/21 1.3.1 typescript移行
 *                  アクターコマンド入力決定後にキャンセルすると全体化MP消費率が全スキルに反映される不具合を修正
 * 2022/08/16 1.3.0 メニュー画面でも全体化する機能を追加
 *            1.2.2 余計なセーブデータ拡張を排除
 * 2022/05/09 1.2.1 全体化できないスキルが全体化される不具合を修正
 * 2022/01/05 1.2.0 元々全体を対象とするスキルの対象選択スキップ設定を追加
 * 2022/01/03 1.1.0 DarkPlasma_ExpandTargetScopeButtonに対応
 *            1.0.9 全体化ON/OFF時にカーソルを更新するよう修正
 *                  全体化ON/OFF時にカーソルSEを再生
 * 2021/07/05 1.0.8 MZ 1.3.2に対応
 * 2021/06/22 1.0.7 サブフォルダからの読み込みに対応
 * 2020/11/10 1.0.6 もともと全体対象のスキルに全体化倍率が乗る不具合を修正
 * 2020/10/26 1.0.5 リファクタ
 *            1.0.4 SkillCostExtensionとの競合を修正
 * 2020/10/17 1.0.3 全体化スキル選択のカーソルが不自然になる不具合を修正
 *                  味方対象のスキルが全体化できない不具合を修正
 * 2020/09/18 1.0.2 全体化ボタンが効いていない不具合を修正
 * 2020/09/08 1.0.1 rollup構成へ移行
 * 2020/09/05 1.0.0 公開
 */

/*:ja
 * @plugindesc スキル/アイテムの対象全体化
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @base DarkPlasma_CustomKeyHandler
 * @orderAfter DarkPlasma_CustomKeyHandler
 *
 * @param switchScopeButton
 * @text 全体化ボタン
 * @type select
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @option tab
 * @default shift
 *
 * @param damageRateForAll
 * @desc 全体化時のダメージ倍率（％）
 * @text 全体ダメージ倍率
 * @type number
 * @default 70
 *
 * @param mpCostRateForAll
 * @desc 全体化時のMP消費倍率（％）
 * @text 全体MP倍率
 * @type number
 * @default 100
 *
 * @param skipTargetSelectionForAll
 * @desc ONの場合、もともと全体を対象とするスキルの対象選択をスキップする
 * @text 全体対象の選択スキップ
 * @type boolean
 * @default false
 *
 * @help
 * version: 1.4.0
 * 対象が単体のスキルやアイテムのメモ欄に以下のように記述することで、
 * 戦闘中に対象を全体化できるようになります。
 * <canExpandScope>
 *
 * 以下のように記述すると、全体化時のアニメーションが n に差し替えられます。
 * <expandedAnimationId:n>
 *
 * 本プラグインの利用には下記プラグインを必要とします。
 * DarkPlasma_CustomKeyHandler version:1.2.1
 * 下記プラグインと共に利用する場合、それよりも下に追加してください。
 * DarkPlasma_CustomKeyHandler
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    switchScopeButton: String(pluginParameters.switchScopeButton || 'shift'),
    damageRateForAll: Number(pluginParameters.damageRateForAll || 70),
    mpCostRateForAll: Number(pluginParameters.mpCostRateForAll || 100),
    skipTargetSelectionForAll: String(pluginParameters.skipTargetSelectionForAll || false) === 'true',
  };

  /**
   * @param {Game_Temp.prototype} gameTemp
   */
  function Game_Temp_ExpandTargetScopeMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._syncSelectionEffectRequestedBattlers = [];
    };
    /**
     * @param {Game_Battler} battler
     */
    gameTemp.requestSyncSelectionEffect = function (battler) {
      this._syncSelectionEffectRequestedBattlers.push(battler);
    };
    /**
     * @param {Game_Battler} battler
     */
    gameTemp.isSyncSelectionEffectRequested = function (battler) {
      return this._syncSelectionEffectRequestedBattlers.includes(battler);
    };
    /**
     * @param {Game_Battler} battler
     */
    gameTemp.processSyncSelectionEffect = function (battler) {
      this._syncSelectionEffectRequestedBattlers = this._syncSelectionEffectRequestedBattlers.filter(
        (b) => b !== battler
      );
    };
  }
  Game_Temp_ExpandTargetScopeMixIn(Game_Temp.prototype);
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
    gameAction.resetExpandScope = function () {
      this._isExpandedScope = false;
    };
    gameAction.canExpandScope = function () {
      return !!this._item.object()?.meta.canExpandScope;
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
      return _needsSelection.call(this) || (this.isForAll() && !settings.skipTargetSelectionForAll);
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
  function Game_Unit_ExpandTargetScopeMixIn(gameUnit) {
    gameUnit.selectAll = function () {
      this.aliveMembers().forEach((member) => member.select());
      this.aliveMembers().forEach((member) => $gameTemp.requestSyncSelectionEffect(member));
    };
  }
  Game_Unit_ExpandTargetScopeMixIn(Game_Unit.prototype);
  function Game_Battler_ExpandTargetScopeMixIn(gameBattler) {
    const _skillMpCost = gameBattler.skillMpCost;
    gameBattler.skillMpCost = function (skill) {
      const value = _skillMpCost.call(this, skill);
      const action = this.currentAction();
      if (action && action.isExpandedScope()) {
        return Math.floor((value * settings.mpCostRateForAll) / 100);
      }
      return value;
    };
    gameBattler.resetAllActionsExpandedScope = function () {
      this._actions.forEach((action) => action.resetExpandScope());
    };
  }
  Game_Battler_ExpandTargetScopeMixIn(Game_Battler.prototype);
  /**
   * @param {Scene_ItemBase.prototype} sceneItemBase
   */
  function Scene_ItemBase_ExpandScopeTargetMixIn(sceneItemBase) {
    const _createActorWindow = sceneItemBase.createActorWindow;
    sceneItemBase.createActorWindow = function () {
      _createActorWindow.call(this);
      this._actorWindow.setHandler(settings.switchScopeButton, this.toggleTargetScope.bind(this));
    };
    sceneItemBase.toggleTargetScope = function () {
      this._actorWindow.toggleCursorAll();
    };
    const _itemTargetActors = sceneItemBase.itemTargetActors;
    sceneItemBase.itemTargetActors = function () {
      if (this._actorWindow.canToggleScope() && this._actorWindow.cursorAll()) {
        return $gameParty.members();
      }
      return _itemTargetActors.call(this);
    };
    const _showActorWindow = sceneItemBase.showActorWindow;
    sceneItemBase.showActorWindow = function () {
      this._actorWindow?.setItem(this.item());
      _showActorWindow.call(this);
    };
  }
  Scene_ItemBase_ExpandScopeTargetMixIn(Scene_ItemBase.prototype);
  /**
   * @param {Scene_Battle.prototype} sceneBattle
   */
  function Scene_Battle_ExpandScopeTargetMixIn(sceneBattle) {
    const _createActorWindow = sceneBattle.createActorWindow;
    sceneBattle.createActorWindow = function () {
      _createActorWindow.call(this);
      this._actorWindow.setHandler(settings.switchScopeButton, this.toggleTargetScopeActor.bind(this));
    };
    const _createEnemyWindow = sceneBattle.createEnemyWindow;
    sceneBattle.createEnemyWindow = function () {
      _createEnemyWindow.call(this);
      this._enemyWindow.setHandler(settings.switchScopeButton, this.toggleTargetScopeEnemy.bind(this));
    };
    const _startActorCommandSelection = sceneBattle.startActorCommandSelection;
    sceneBattle.startActorCommandSelection = function () {
      _startActorCommandSelection.call(this);
      BattleManager.actor()?.resetAllActionsExpandedScope();
    };
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
      const action = BattleManager.inputtingAction();
      if (this._actorWindow.cursorAll()) {
        action.expandScope();
      } else {
        action.resetExpandScope();
      }
      _onActorOk.call(this);
    };
    const _onEnemyOk = sceneBattle.onEnemyOk;
    sceneBattle.onEnemyOk = function () {
      const action = BattleManager.inputtingAction();
      if (this._enemyWindow.cursorAll()) {
        action.expandScope();
      } else {
        action.resetExpandScope();
      }
      _onEnemyOk.call(this);
    };
    sceneBattle.toggleTargetScopeActor = function () {
      this._actorWindow.toggleCursorAll();
    };
    sceneBattle.toggleTargetScopeEnemy = function () {
      this._enemyWindow.toggleCursorAll();
    };
  }
  Scene_Battle_ExpandScopeTargetMixIn(Scene_Battle.prototype);
  function Sprite_Battler_ExpandTargetScopeMixIn(spriteBattler) {
    const _updateSelectionEffect = spriteBattler.updateSelectionEffect;
    spriteBattler.updateSelectionEffect = function () {
      if (this._battler.isSelected()) {
        if ($gameTemp.isSyncSelectionEffectRequested(this._battler)) {
          this._selectionEffectCount = 0;
          $gameTemp.processSyncSelectionEffect(this._battler);
        }
      }
      _updateSelectionEffect.call(this);
    };
  }
  Sprite_Battler_ExpandTargetScopeMixIn(Sprite_Battler.prototype);
  /**
   * @param {Window_MenuActor.prototype} windowClass
   */
  function Window_MenuActor_ExpandTargetScopeMixIn(windowClass) {
    windowClass.setItem = function (item) {
      if (item) {
        this._currentAction = new Game_Action($gameParty.menuActor());
        this._currentAction.setItemObject(item);
      }
    };
    const _selectForItem = windowClass.selectForItem;
    windowClass.selectForItem = function (item) {
      _selectForItem.call(this, item);
      this._currentAction = new Game_Action($gameParty.menuActor());
      this._currentAction.setItemObject(item);
    };
    windowClass.toggleCursorAll = function () {
      this.setCursorAll(!this._cursorAll);
      this.forceSelect(0);
      SoundManager.playCursor();
    };
    windowClass.canToggleScope = function () {
      return this._currentAction && this._currentAction.canExpandScope() && !this.cursorFixed();
    };
    const _isCustomKeyEnabled = windowClass.isCustomKeyEnabled;
    windowClass.isCustomKeyEnabled = function (key) {
      if (key === settings.switchScopeButton) {
        return this.canToggleScope();
      }
      return _isCustomKeyEnabled.call(this, key);
    };
  }
  Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_MenuActor.prototype);
  Window_MenuActor_ExpandTargetScopeMixIn(Window_MenuActor.prototype);
  /**
   * @param {Window_BattleActor.prototype|Window_BattleEnemy.prototype} windowClass
   */
  function Window_BattleTarget_ExpandTargetScopeMixIn(windowClass) {
    windowClass.toggleCursorAll = function () {
      this.setCursorAll(!this._cursorAll);
    };
    const _isCustomKeyEnabled = windowClass.isCustomKeyEnabled;
    windowClass.isCustomKeyEnabled = function (key) {
      if (key === settings.switchScopeButton) {
        return this.canToggleScope();
      }
      return _isCustomKeyEnabled.call(this, key);
    };
    windowClass.canToggleScope = function () {
      return $gameParty.inBattle() && !!BattleManager.inputtingAction()?.canExpandScope() && !this.cursorFixed();
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
  Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_BattleActor.prototype);
  Window_CustomKeyHandlerMixIn(settings.switchScopeButton, Window_BattleEnemy.prototype);
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
  function Window_BattleLog_ExpandTargetScopeMixIn(windowClass) {
    /**
     * 全体化アニメーションのため上書き
     * @param {Game_Battler} subject
     * @param {Game_Action} action
     * @param {Game_Battler[]} targets
     */
    windowClass.startAction = function (subject, action, targets) {
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
  }
  Window_BattleLog_ExpandTargetScopeMixIn(Window_BattleLog.prototype);
})();
