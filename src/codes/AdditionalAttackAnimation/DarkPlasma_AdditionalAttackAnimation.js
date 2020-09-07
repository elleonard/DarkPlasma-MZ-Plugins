import { settings } from './_build/DarkPlasma_AdditionalAttackAnimation_parameters';

const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
Window_BattleLog.prototype.startAction = function (subject, action, targets) {
  _Window_BattleLog_startAction.call(this, subject, action, targets);
  this.push('waitForEffect');
  this.push('showAdditionalAnimation', subject, targets.clone());
};

Window_BattleLog.prototype.showAdditionalAnimation = function (subject, targets) {
  if (subject.isActor()) {
    settings.additionalAnimations.forEach((additionalAnimation) => {
      const additionalAnimationTargets = targets.filter((target) =>
        target.isAdditionalAnimationTarget(additionalAnimation)
      );
      this.showNormalAnimation(additionalAnimationTargets, additionalAnimation.animation, false);
    });
  }
};

Game_Actor.prototype.isAdditionalAnimationTarget = function (additionalAnimation) {
  if (additionalAnimation.onlyForSomeEnemies) {
    return false;
  }
  if (additionalAnimation.onlyForSomeStates) {
    if (!additionalAnimation.states.some((stateId) => this.isStateAffected(stateId))) {
      return false;
    }
  }
  return true;
};

Game_Enemy.prototype.isAdditionalAnimationTarget = function (additionalAnimation) {
  if (additionalAnimation.onlyForSomeEnemies) {
    if (!this.isEnemy()) {
      return false;
    }
    if (!additionalAnimation.enemies.some((enemyId) => enemyId === this.enemyId())) {
      return false;
    }
  }
  if (additionalAnimation.onlyForSomeStates) {
    if (!additionalAnimation.states.some((stateId) => this.isStateAffected(stateId))) {
      return false;
    }
  }
  return true;
};
