// DarkPlasma_ExpandTargetScope 1.2.1
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
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
 * version: 1.2.1
 * 対象が単体のスキルやアイテムのメモ欄に以下のように記述することで、
 * 戦闘中に対象を全体化できるようになります。
 * <canExpandScope>
 *
 * 以下のように記述すると、全体化時のアニメーションが n に差し替えられます。
 * <expandedAnimationId:n>
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    switchScopeButton: String(pluginParameters.switchScopeButton || 'shift'),
    damageRateForAll: Number(pluginParameters.damageRateForAll || 70),
    mpCostRateForAll: Number(pluginParameters.mpCostRateForAll || 100),
    skipTargetSelectionForAll: String(pluginParameters.skipTargetSelectionForAll || false) === 'true',
  };

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
        this.toggleCursorAll();
        return true;
      }
      return false;
    };

    windowClass.toggleCursorAll = function () {
      this.setCursorAll(!this._cursorAll);
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
})();
