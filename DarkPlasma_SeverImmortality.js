// DarkPlasma_SeverImmortality 1.0.2
// Copyright (c) 2021 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2021/07/05 1.0.2 MZ 1.3.2に対応
 * 2021/06/22 1.0.1 サブフォルダからの読み込みに対応
 * 2021/04/16 1.0.0 公開
 */

/*:ja
 * @plugindesc 倒した相手を復活不可にする行動
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @help
 * version: 1.0.2
 * 下記のメモタグが設定されたスキルやアイテムで敵を倒すと、対象が復活不能になります。
 *
 * <severImmortality>
 *
 * 復活とは、戦闘不能状態に陥った敵が下記いずれかの要因で戦闘に復帰することです。
 * - HP回復スキルで回復する
 * - 戦闘不能ステートを解除する行動でステートを解除する
 * - イベントコマンド 敵キャラの全回復 で回復する
 * - イベントコマンド 敵キャラのステート変更 で戦闘不能ステートを解除する
 */

(() => {
  'use strict';

  const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
  Game_Enemy.prototype.initMembers = function () {
    _Game_Enemy_initMembers.call(this);
    this._cannotRevive = false;
  };

  Game_Battler.prototype.cannotRevive = function () {
    return false;
  };

  Game_Enemy.prototype.cannotRevive = function () {
    return this._cannotRevive;
  };

  Game_Enemy.prototype.setCannotRevive = function (cannotRevive) {
    this._cannotRevive = cannotRevive;
  };

  const _Game_Enemy_recoverAll = Game_Enemy.prototype.recoverAll;
  Game_Enemy.prototype.recoverAll = function () {
    if (this.isDead() && this.cannotRevive()) {
      return;
    }
    _Game_Enemy_recoverAll.call(this);
  };

  const _Game_Enemy_removeState = Game_Enemy.prototype.removeState;
  Game_Enemy.prototype.removeState = function (stateId) {
    if (stateId === this.deathStateId() && this.cannotRevive()) {
      return;
    }
    _Game_Enemy_removeState.call(this, stateId);
  };

  const _Game_Enemy_gainHp = Game_Enemy.prototype.gainHp;
  Game_Enemy.prototype.gainHp = function (value) {
    if (this.hp === 0 && this.cannotRevive()) {
      return;
    }
    _Game_Enemy_gainHp.call(this, value);
  };

  const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
  Game_Action.prototype.testItemEffect = function (target, effect) {
    const result = _Game_Action_testItemEffect.call(this, target, effect);
    if (effect.code === Game_Action.prototype.EFFECT_REMOVE_STATE && effect.dataId === target.deathStateId()) {
      return result && !target.cannotRevive();
    }
    return result;
  };

  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    _Game_Action_apply.call(this, target);
    if (
      target.result().isHit() &&
      this.item().damage.type > 0 &&
      target.isEnemy() &&
      target.isDead() &&
      this.isSealingRevive()
    ) {
      target.setCannotRevive(true);
    }
  };

  Game_Action.prototype.isSealingRevive = function () {
    return !!this.item().meta.severImmortality;
  };
})();
