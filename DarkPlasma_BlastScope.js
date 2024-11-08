// DarkPlasma_BlastScope 1.0.1
// Copyright (c) 2024 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2024/11/09 1.0.1 戦闘不能対象の範囲拡散の挙動が正常でない
 * 2024/11/09 1.0.0 公開
 */

/*:
 * @plugindesc 範囲「拡散」
 * @author DarkPlasma
 * @license MIT
 *
 * @target MZ
 * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release
 *
 * @param damageRate
 * @desc 対象の両隣に与えるダメージ、回復量の倍率を設定します。
 * @text ダメージ倍率(％)
 * @type number
 * @default 50
 *
 * @help
 * version: 1.0.1
 * スキルやアイテムの範囲設定に「拡散」を追加します。
 *
 * 範囲設定の陣営が「敵」または「味方」かつ数が「単体」であるような
 * スキルやアイテムのメモ欄に以下のように記述すると、
 * 範囲設定が「拡散」になります。
 * <blastScope>
 *
 * 「拡散」範囲は敵単体を指定し、その両隣にも効果を及ぼします。
 * ここで言う隣とは、敵グループに追加した順番を基準にしており、
 * 必ずしも表示位置とは関係しないことに注意してください。
 */

(() => {
  'use strict';

  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });

  const pluginParametersOf = (pluginName) => PluginManager.parameters(pluginName);

  const pluginParameters = pluginParametersOf(pluginName);

  const settings = {
    damageRate: Number(pluginParameters.damageRate || 50),
  };

  function BattleManager_BlastScopeMixIn(battleManager) {
    const _endAction = battleManager.endAction;
    battleManager.endAction = function () {
      $gameTemp.clearSubTargetOf(this._action);
      _endAction.call(this);
    };
  }
  BattleManager_BlastScopeMixIn(BattleManager);
  function Game_Temp_BlastScopeMixIn(gameTemp) {
    const _initialize = gameTemp.initialize;
    gameTemp.initialize = function () {
      _initialize.call(this);
      this._actionId = 1;
      this._actionSubTargets = new Map();
    };
    gameTemp.allocateActionId = function () {
      return this._actionId++;
    };
    gameTemp.markAsSubTarget = function (action, target) {
      const actionId = action.actionId();
      if (actionId) {
        this._actionSubTargets.set(actionId, (this._actionSubTargets.get(actionId) || []).concat([target]));
      }
    };
    gameTemp.isBattlerSubTargetOf = function (action, target) {
      const actionId = action.actionId();
      if (actionId) {
        const subTargets = this._actionSubTargets.get(actionId);
        return !!subTargets && subTargets.includes(target);
      }
      return false;
    };
    gameTemp.clearSubTargetOf = function (action) {
      const actionId = action?.actionId();
      if (actionId) {
        this._actionSubTargets.delete(actionId);
      }
    };
  }
  Game_Temp_BlastScopeMixIn(Game_Temp.prototype);
  function Game_Unit_BlastScopeMixIn(gameUnit) {
    /**
     * baseTargetIndexから見てtargetIndexの方向に隣の生きているバトラーを返す
     */
    gameUnit.smoothAliveNextTarget = function (baseTargetIndex, targetIndex) {
      do {
        const candidate = this.members()[targetIndex];
        if (candidate?.isAlive()) {
          return candidate;
        }
        if (baseTargetIndex < targetIndex) {
          targetIndex++;
        } else {
          targetIndex--;
        }
      } while (this.members().length > targetIndex && 0 <= targetIndex);
      return undefined;
    };
    gameUnit.smoothDeadNextTarget = function (baseTargetIndex, targetIndex) {
      do {
        const candidate = this.members()[targetIndex];
        if (candidate?.isDead()) {
          return candidate;
        }
        if (baseTargetIndex < targetIndex) {
          targetIndex++;
        } else {
          targetIndex--;
        }
      } while (this.members().length > targetIndex && 0 <= targetIndex);
      return undefined;
    };
  }
  Game_Unit_BlastScopeMixIn(Game_Unit.prototype);
  function Game_Action_BlastScopeMixIn(gameAction) {
    gameAction.actionId = function () {
      return this._actionId;
    };
    const _setTarget = gameAction.setTarget;
    gameAction.setTarget = function (targetIndex) {
      _setTarget.call(this, targetIndex);
      if (!this._actionId) {
        this._actionId = $gameTemp.allocateActionId();
      }
    };
    gameAction.isBlastScope = function () {
      return !this.isForUser() && !this.isForEveryone() && !!this.item()?.meta.blastScope;
    };
    const _targetsForDead = gameAction.targetsForDead;
    gameAction.targetsForDead = function (unit) {
      const result = _targetsForDead.call(this, unit);
      if (this.isBlastScope()) {
        result.push(
          ...result.flatMap((battler) =>
            this.makeSubTargets(battler, (targetIndex) => unit.smoothDeadNextTarget(this._targetIndex, targetIndex)),
          ),
        );
      }
      return result;
    };
    const _targetsForAlive = gameAction.targetsForAlive;
    gameAction.targetsForAlive = function (unit) {
      const result = _targetsForAlive.call(this, unit);
      if (this.isBlastScope()) {
        result.push(
          ...result.flatMap((battler) =>
            this.makeSubTargets(battler, (targetIndex) => unit.smoothAliveNextTarget(this._targetIndex, targetIndex)),
          ),
        );
      }
      return result;
    };
    const _targetsForDeadAndAlive = gameAction.targetsForDeadAndAlive;
    gameAction.targetsForDeadAndAlive = function (unit) {
      const result = _targetsForDeadAndAlive.call(this, unit);
      if (this.isBlastScope()) {
        result.push(
          ...result.flatMap((battler) => this.makeSubTargets(battler, (targetIndex) => unit.members()[targetIndex])),
        );
      }
      return result;
    };
    gameAction.makeSubTargets = function (mainTarget, findSubTargetFunction) {
      const candidates = [];
      if (this._targetIndex > 0) {
        candidates.push(findSubTargetFunction(this._targetIndex - 1));
      }
      candidates.push(findSubTargetFunction(this._targetIndex + 1));
      const subTargets = candidates.filter((candidate) => !!candidate && candidate !== mainTarget);
      /**
       * 副作用をもたらすが、冪等なのでとりあえずヨシとする
       */
      subTargets.forEach((subTarget) => this.markAsSubTarget(subTarget));
      return subTargets;
    };
    gameAction.markAsSubTarget = function (target) {
      $gameTemp.markAsSubTarget(this, target);
    };
    const _makeDamageValue = gameAction.makeDamageValue;
    gameAction.makeDamageValue = function (target, critical) {
      const value = _makeDamageValue.call(this, target, critical);
      return $gameTemp.isBattlerSubTargetOf(this, target) ? this.applySubTargetDamageRate(value) : value;
    };
    gameAction.applySubTargetDamageRate = function (value) {
      return Math.floor((value * settings.damageRate) / 100);
    };
  }
  Game_Action_BlastScopeMixIn(Game_Action.prototype);
})();
